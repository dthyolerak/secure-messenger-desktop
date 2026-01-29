// electron/db/queries.ts
import { Database } from 'better-sqlite3';
import { z } from 'zod';

// Zod schemas for validation
const MessageEventSchema = z.object({
  id: z.string(),
  chat_id: z.string(),
  sender: z.string(),
  content: z.string(),
  timestamp: z.number(),
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
  async insertMessage(message: unknown): Promise<boolean> {
    try {
      const validated = MessageEventSchema.parse(message);
      
      // Check for duplicate by message ID
      const existing = this.db.prepare(
        'SELECT id FROM messages WHERE id = ?'
      ).get(validated.id);

      if (existing) {
        console.log(`[DB] Duplicate message ignored: ${validated.id}`);
        return false;
      }

      // Insert message within transaction
      const insertMessage = this.db.prepare(`
        INSERT INTO messages (id, chat_id, sender, content, timestamp, is_read, is_edited)
        VALUES (?, ?, ?, ?, ?, 0, 0)
      `);

      const updateChat = this.db.prepare(`
        UPDATE chats 
        SET last_message = ?, updated_at = ?,
            unread_count = CASE 
              WHEN sender != 'You' THEN unread_count + 1 
              ELSE unread_count 
            END
        WHERE id = ?
      `);

      const transaction = this.db.transaction(() => {
        insertMessage.run(
          validated.id,
          validated.chat_id,
          validated.sender,
          validated.content,
          validated.timestamp
        );
        
        updateChat.run(
          validated.content,
          validated.timestamp,
          validated.chat_id
        );
      });

      transaction();
      console.log(`[DB] Message inserted: ${validated.id}`);
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
   * Get messages for a chat with pagination
   */
  async getMessagesForChat(
    chatId: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<any[]> {
    try {
      const messages = this.db.prepare(`
        SELECT * FROM messages 
        WHERE chat_id = ? 
        ORDER BY timestamp DESC 
        LIMIT ? OFFSET ?
      `).all(chatId, limit, offset);

      return messages.reverse(); // Return in chronological order
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
  async markMessagesAsRead(chatId: string): Promise<number> {
    try {
      const result = this.db.prepare(`
        UPDATE messages 
        SET is_read = 1 
        WHERE chat_id = ? AND sender != 'You' AND is_read = 0
      `).run(chatId);

      // Update chat unread count
      this.db.prepare(`
        UPDATE chats 
        SET unread_count = 0 
        WHERE id = ?
      `).run(chatId);

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
  async getUnreadCounts(): Promise<Record<string, number>> {
    try {
      const unreadCounts = this.db.prepare(`
        SELECT chat_id, COUNT(*) as count
        FROM messages 
        WHERE is_read = 0 AND sender != 'You'
        GROUP BY chat_id
      `).all();

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
