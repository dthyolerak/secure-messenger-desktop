// electron/db/messages.ts
import { Database } from 'better-sqlite3';
import { z } from 'zod';

// Message schema for validation
const MessageEventSchema = z.object({
  id: z.string(),
  chat_id: z.string(),
  sender_id: z.string().optional(),
  sender: z.string().optional(),
  content: z.string(),
  timestamp: z.number(),
}).transform((data) => {
  // Handle both sender and sender_id for backward compatibility
  return {
    ...data,
    sender_id: data.sender_id || data.sender,
  };
});

export class MessagesDB {
  constructor(private db: Database) {}

  /**
   * Insert message ONLY - NEVER creates users
   * This is the critical fix to prevent SQLITE_CONSTRAINT_UNIQUE errors
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

      // CRITICAL: Validate sender exists - NEVER create users here
      if (validated.sender_id) {
        let senderExists = this.db.prepare(
          'SELECT id FROM users WHERE id = ?'
        ).get(validated.sender_id);

        // If not found by ID, try to find by display name (for WebSocket messages)
        if (!senderExists) {
          senderExists = this.db.prepare(
            'SELECT id FROM users WHERE display_name = ?'
          ).get(validated.sender_id);
          
          if (senderExists) {
            // Update sender_id to the actual user ID
            validated.sender_id = (senderExists as any).id;
          }
        }

        if (!senderExists) {
          console.warn(`[DB] Message rejected - sender not found: ${validated.sender_id}. Users must be created explicitly.`);
          return false; // Reject message, don't create user
        }
      }

      // Validate chat exists
      const chatExists = this.db.prepare(
        'SELECT id FROM chats WHERE id = ?'
      ).get(validated.chat_id);

      if (!chatExists) {
        console.warn(`[DB] Message rejected - chat not found: ${validated.chat_id}`);
        return false; // Reject message if chat doesn't exist
      }

      // Insert message within transaction
      const insertMessage = this.db.prepare(`
        INSERT INTO messages (id, chat_id, sender_id, content, timestamp, is_edited, deleted_at)
        VALUES (?, ?, ?, ?, ?, 0, 0)
      `);

      const updateChat = this.db.prepare(`
        UPDATE chats 
        SET updated_at = ?
        WHERE id = ?
      `);

      const transaction = this.db.transaction(() => {
        insertMessage.run(
          validated.id,
          validated.chat_id,
          validated.sender_id,
          validated.content,
          validated.timestamp
        );
        
        updateChat.run(validated.timestamp, validated.chat_id);
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
   * Get messages for a chat with pagination
   */
  async getMessagesForChat(
    chatId: string, 
    userId: string,
    limit: number = 50, 
    offset: number = 0
  ): Promise<any[]> {
    try {
      const messages = this.db.prepare(`
        SELECT 
          m.*,
          u.display_name as sender_name,
          CASE 
            WHEN mr.read_at IS NOT NULL THEN 1 
            ELSE 0 
          END as is_read
        FROM messages m
        INNER JOIN users u ON m.sender_id = u.id
        LEFT JOIN message_reads mr ON m.id = mr.message_id AND mr.user_id = ?
        WHERE m.chat_id = ? AND m.deleted_at = 0
        ORDER BY m.timestamp DESC 
        LIMIT ? OFFSET ?
      `).all(userId, chatId, limit, offset);

      return messages.reverse(); // Return in chronological order
    } catch (error) {
      console.error('[DB] Failed to get messages:', error);
      throw error;
    }
  }

  /**
   * Send a message and persist to database
   */
  async sendMessage(chatId: string, senderId: string, content: string): Promise<any> {
    try {
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = Date.now();

      // Validate sender exists
      const senderExists = this.db.prepare(
        'SELECT id FROM users WHERE id = ?'
      ).get(senderId);

      if (!senderExists) {
        throw new Error(`Sender not found: ${senderId}`);
      }

      // Validate chat exists
      const chatExists = this.db.prepare(
        'SELECT id FROM chats WHERE id = ?'
      ).get(chatId);

      if (!chatExists) {
        throw new Error(`Chat not found: ${chatId}`);
      }

      const insertMessage = this.db.prepare(`
        INSERT INTO messages (id, chat_id, sender_id, content, timestamp, is_edited, deleted_at)
        VALUES (?, ?, ?, ?, ?, 0, 0)
      `);

      const updateChat = this.db.prepare(`
        UPDATE chats 
        SET updated_at = ?
        WHERE id = ?
      `);

      const transaction = this.db.transaction(() => {
        insertMessage.run(messageId, chatId, senderId, content, timestamp);
        updateChat.run(timestamp, chatId);
      });

      transaction();

      // Mark sender's own message as read immediately
      await this.markMessagesAsRead(chatId, senderId);

      const message = {
        id: messageId,
        chat_id: chatId,
        sender_id: senderId,
        content,
        timestamp,
        is_edited: 0,
        deleted_at: 0
      };

      console.log(`[DB] Message sent: ${messageId}`);
      return message;
    } catch (error) {
      console.error('[DB] Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Mark messages as read for a user in a chat
   */
  async markMessagesAsRead(chatId: string, userId: string): Promise<number> {
    try {
      // Get unread messages for this user
      const unreadMessages = this.db.prepare(`
        SELECT m.id
        FROM messages m
        LEFT JOIN message_reads mr ON m.id = mr.message_id AND mr.user_id = ?
        WHERE m.chat_id = ? 
          AND m.sender_id != ? 
          AND mr.read_at IS NULL
          AND m.deleted_at = 0
      `).all(userId, chatId, userId);

      let markedCount = 0;
      if (unreadMessages.length > 0) {
        // Insert read receipts for all unread messages
        const insertRead = this.db.prepare(`
          INSERT OR IGNORE INTO message_reads (id, message_id, user_id, read_at)
          VALUES (?, ?, ?, ?)
        `);

        const transaction = this.db.transaction(() => {
          unreadMessages.forEach((msg: any) => {
            insertRead.run(`mr_${msg.id}_${userId}_${Date.now()}`, msg.id, userId, Date.now());
            markedCount++;
          });
        });

        transaction();
      }

      // Update participant's last_read_at
      this.db.prepare(`
        UPDATE chat_participants 
        SET last_read_at = ?
        WHERE chat_id = ? AND user_id = ?
      `).run(Date.now(), chatId, userId);

      console.log(`[DB] Marked ${markedCount} messages as read for user ${userId} in chat ${chatId}`);
      return markedCount;
    } catch (error) {
      console.error('[DB] Failed to mark messages as read:', error);
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
        WHERE id = ? AND deleted_at = 0
      `).run(content, messageId);

      if (result.changes > 0) {
        // Update chat timestamp
        this.db.prepare(`
          UPDATE chats 
          SET updated_at = ?
          WHERE id = (SELECT chat_id FROM messages WHERE id = ?)
        `).run(Date.now(), messageId);
      }

      return result.changes > 0;
    } catch (error) {
      console.error('[DB] Failed to update message:', error);
      throw error;
    }
  }

  /**
   * Delete message (soft delete)
   */
  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const result = this.db.prepare(`
        UPDATE messages 
        SET deleted_at = ?
        WHERE id = ? AND deleted_at = 0
      `).run(Date.now(), messageId);

      if (result.changes > 0) {
        // Update chat timestamp
        this.db.prepare(`
          UPDATE chats 
          SET updated_at = ?
          WHERE id = (SELECT chat_id FROM messages WHERE id = ?)
        `).run(Date.now(), messageId);
      }

      return result.changes > 0;
    } catch (error) {
      console.error('[DB] Failed to delete message:', error);
      throw error;
    }
  }

  /**
   * Get unread count for a user in a specific chat
   */
  async getUnreadCount(chatId: string, userId: string): Promise<number> {
    try {
      const result = this.db.prepare(`
        SELECT COUNT(*) as count
        FROM messages m
        LEFT JOIN message_reads mr ON m.id = mr.message_id AND mr.user_id = ?
        WHERE m.chat_id = ? 
          AND m.sender_id != ? 
          AND mr.read_at IS NULL
          AND m.deleted_at = 0
      `).get(userId, chatId, userId) as { count: number };

      return result.count || 0;
    } catch (error) {
      console.error('[DB] Failed to get unread count:', error);
      throw error;
    }
  }

  /**
   * Get all unread counts for a user
   */
  async getAllUnreadCounts(userId: string): Promise<Record<string, number>> {
    try {
      const unreadCounts = this.db.prepare(`
        SELECT 
          m.chat_id,
          COUNT(*) as count
        FROM messages m
        LEFT JOIN message_reads mr ON m.id = mr.message_id AND mr.user_id = ?
        INNER JOIN chat_participants cp ON m.chat_id = cp.chat_id
        WHERE cp.user_id = ?
          AND m.sender_id != ? 
          AND mr.read_at IS NULL
          AND m.deleted_at = 0
        GROUP BY m.chat_id
      `).all(userId, userId, userId);

      const result: Record<string, number> = {};
      unreadCounts.forEach((row: any) => {
        result[row.chat_id] = row.count;
      });

      return result;
    } catch (error) {
      console.error('[DB] Failed to get all unread counts:', error);
      throw error;
    }
  }
}
