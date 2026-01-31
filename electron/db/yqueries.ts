// electron/db/queries.ts
import { Database } from 'better-sqlite3';
import { z } from 'zod';

// Zod schemas for validation
const MessageEventSchema = z.object({
  id: z.string(),
  chat_id: z.string(),
  sender: z.string(),
  recipient: z.string(),
  content: z.string(),
  timestamp: z.number(),
  read_at: z.number().nullable().optional(),
  is_read: z.boolean().optional(),
  is_edited: z.boolean().optional(),
});

const ChatUpdateEventSchema = z.object({
  chat_id: z.string(),
  name: z.string().optional(),
  unread_count: z.number().optional(),
  last_message: z.string().optional(),
  updated_at: z.number(),
});

export class SyncQueries {
  constructor(private db: Database) {}

  /**
   * Insert or update message with deduplication
   * Returns true if message was inserted, false if duplicate
   */
  async insertMessage(message: unknown, currentUser: string = 'You'): Promise<boolean> {
    try {
      console.log('[DB] Raw message received:', message);
      
      const validated = MessageEventSchema.parse(message);
      console.log('[DB] Message validated successfully:', validated);

      const readAt =
        validated.read_at !== undefined
          ? validated.read_at
          : validated.is_read
            ? validated.timestamp
            : validated.sender === currentUser
              ? validated.timestamp
              : null;
      const isEdited = validated.is_edited ? 1 : 0;
      
      // Check for duplicate by message ID
      const existing = this.db.prepare(
        'SELECT id FROM messages WHERE id = ?'
      ).get(validated.id);

      if (existing) {
        console.log(`[DB] Duplicate message ignored: ${validated.id}`);
        return false;
      }

      console.log('[DB] Inserting new message into database...');

      // Insert message within transaction
      const insertMessage = this.db.prepare(`
        INSERT INTO messages (id, chat_id, sender, recipient, content, timestamp, read_at, is_edited)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const selectUnreadCount = this.db.prepare(`
        SELECT COUNT(*) as count FROM messages
        WHERE chat_id = ? AND recipient = ? AND read_at IS NULL
      `);

      const updateChat = this.db.prepare(`
        UPDATE chats 
        SET last_message = ?, updated_at = ?, unread_count = ?
        WHERE id = ?
      `);

      const transaction = this.db.transaction(() => {
        console.log('[DB] Executing message insert...');
        insertMessage.run(
          validated.id,
          validated.chat_id,
          validated.sender,
          validated.recipient,
          validated.content,
          validated.timestamp,
          readAt,
          isEdited
        );
        
        console.log('[DB] Executing chat update...');
        const unreadCount = selectUnreadCount.get(validated.chat_id, currentUser) as { count: number };
        updateChat.run(
          validated.content,
          validated.timestamp,
          unreadCount.count,
          validated.chat_id
        );
        console.log('[DB] Transaction completed successfully');
      });

      transaction();
      console.log(`[DB] Message inserted successfully: ${validated.id}`);
      return true;

    } catch (error) {
      console.error('[DB] Failed to insert message:', error);
      throw error;
    }
  }

  /**
   * Upsert chat with latest data
   * Returns true if chat was updated/inserted
   */
  async upsertChat(chatUpdate: unknown): Promise<boolean> {
    try {
      const validated = ChatUpdateEventSchema.parse(chatUpdate);
      
      // Check if chat exists
      const existing = this.db.prepare(
        'SELECT id FROM chats WHERE id = ?'
      ).get(validated.chat_id);

      if (existing) {
        // Update existing chat
        const updateFields = [];
        const values = [];

        if (validated.name !== undefined) {
          updateFields.push('name = ?');
          values.push(validated.name);
        }

        if (validated.unread_count !== undefined) {
          updateFields.push('unread_count = ?');
          values.push(validated.unread_count);
        }

        if (validated.last_message !== undefined) {
          updateFields.push('last_message = ?');
          values.push(validated.last_message);
        }

        if (validated.updated_at !== undefined) {
          updateFields.push('updated_at = ?');
          values.push(validated.updated_at);
        }

        if (updateFields.length > 0) {
          values.push(validated.chat_id);
          const query = `UPDATE chats SET ${updateFields.join(', ')} WHERE id = ?`;
          
          this.db.prepare(query).run(...values);
          console.log(`[DB] Chat updated: ${validated.chat_id}`);
          return true;
        }
      } else {
        // Insert new chat
        this.db.prepare(`
          INSERT INTO chats (id, name, last_message, updated_at, unread_count)
          VALUES (?, ?, ?, ?, ?)
        `).run(
          validated.chat_id,
          validated.name || 'Unknown Chat',
          validated.last_message || '',
          validated.updated_at,
          validated.unread_count || 0
        );
        
        console.log(`[DB] Chat inserted: ${validated.chat_id}`);
        return true;
      }

      return false;

    } catch (error) {
      console.error('[DB] Failed to upsert chat:', error);
      throw error;
    }
  }

  /**
   * Get messages for a chat with pagination (for current user)
   */
  async getMessagesForChat(
    chatId: string, 
    limit: number = 50, 
    offset: number = 0,
    currentUser: string = 'You'
  ): Promise<any[]> {
    try {
      const messages = this.db.prepare(`
        SELECT * FROM messages 
        WHERE chat_id = ? AND (sender = ? OR recipient = ?)
        ORDER BY timestamp ASC 
        LIMIT ? OFFSET ?
      `).all(chatId, currentUser, currentUser, limit, offset);

      return messages;
    } catch (error) {
      console.error('[DB] Failed to get messages:', error);
      throw error;
    }
  }

  /**
   * Get all messages for a chat (for sync purposes)
   */
  async getAllMessagesForChat(
    chatId: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<any[]> {
    try {
      const messages = this.db.prepare(`
        SELECT * FROM messages 
        WHERE chat_id = ? 
        ORDER BY timestamp ASC 
        LIMIT ? OFFSET ?
      `).all(chatId, limit, offset);

      return messages;
    } catch (error) {
      console.error('[DB] Failed to get messages:', error);
      throw error;
    }
  }

  /**
   * Get all chats ordered by updated_at DESC
   */
  async getAllChats(): Promise<any[]> {
    try {
      const chats = this.db.prepare(`
        SELECT id, name, last_message, updated_at, COALESCE(unread_count, 0) as unread_count
        FROM chats 
        ORDER BY updated_at DESC
      `).all();

      return chats;
    } catch (error) {
      console.error('[DB] Failed to get chats:', error);
      throw error;
    }
  }

  /**
   * Mark messages as read for a chat
   */
  async markMessagesAsRead(chatId: string, currentUser: string = 'You'): Promise<number> {
    try {
      const readAt = Date.now();
      const result = this.db.prepare(`
        UPDATE messages 
        SET read_at = ? 
        WHERE chat_id = ? AND recipient = ? AND read_at IS NULL
      `).run(readAt, chatId, currentUser);

      // Update chat unread count to reflect only unread messages for current user
      const unreadCount = this.db.prepare(`
        SELECT COUNT(*) as count FROM messages 
        WHERE chat_id = ? AND recipient = ? AND read_at IS NULL
      `).get(chatId, currentUser) as { count: number };

      this.db.prepare(`
        UPDATE chats 
        SET unread_count = ? 
        WHERE id = ?
      `).run(unreadCount.count, chatId);

      console.log(`[DB] Marked ${result.changes} messages as read for chat ${chatId}`);
      return result.changes;
    } catch (error) {
      console.error('[DB] Failed to mark messages as read:', error);
      throw error;
    }
  }

  /**
   * Get unread message count for all chats
   */
  async getUnreadCounts(currentUser: string = 'You'): Promise<Record<string, number>> {
    try {
      const unreadCounts = this.db.prepare(`
        SELECT chat_id, COUNT(*) as count
        FROM messages 
        WHERE read_at IS NULL AND recipient = ?
        GROUP BY chat_id
      `).all(currentUser);

      const result: Record<string, number> = {};
      unreadCounts.forEach((row: any) => {
        result[row.chat_id] = row.count;
      });

      return result;
    } catch (error) {
      console.error('[DB] Failed to get unread counts:', error);
      throw error;
    }
  }

  /**
   * Delete message by ID
   */
  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const result = this.db.prepare(`
        DELETE FROM messages WHERE id = ?
      `).run(messageId);

      return result.changes > 0;
    } catch (error) {
      console.error('[DB] Failed to delete message:', error);
      throw error;
    }
  }

  /**
   * Update message content
   */
  async updateMessage(messageId: string, content: string): Promise<boolean> {
    try {
      const result = this.db.prepare(`
        UPDATE messages 
        SET content = ?, is_edited = 1 
        WHERE id = ?
      `).run(content, messageId);

      if (result.changes > 0) {
        // Update chat last_message if this was the latest message
        this.db.prepare(`
          UPDATE chats 
          SET last_message = ?, updated_at = ?
          WHERE id = (SELECT chat_id FROM messages WHERE id = ?)
        `).run(content, Date.now(), messageId);
      }

      return result.changes > 0;
    } catch (error) {
      console.error('[DB] Failed to update message:', error);
      throw error;
    }
  }
}
