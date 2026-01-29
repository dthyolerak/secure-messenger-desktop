// electron/db/queries.ts
import { Database } from 'better-sqlite3';
import { z } from 'zod';
import { Notification } from 'electron';

// Zod schemas for validation
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

const ChatUpdateEventSchema = z.object({
  chat_id: z.string(),
  name: z.string().optional(),
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

      // Ensure sender exists in users table (create if needed)
      if (validated.sender_id && !validated.sender_id.startsWith('user')) {
        // This is a name like "Alice Johnson", create or get user
        const existingUser = this.db.prepare(
          'SELECT id FROM users WHERE display_name = ?'
        ).get(validated.sender_id);

        if (!existingUser) {
          // Create user for this sender
          const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          this.db.prepare(`
            INSERT INTO users (id, email, display_name, password_hash, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
          `).run(
            userId,
            `${validated.sender_id.toLowerCase().replace(' ', '_')}@example.com`,
            validated.sender_id,
            'demo_hash',
            Date.now(),
            Date.now()
          );
          console.log(`[DB] Created user for sender: ${validated.sender_id} -> ${userId}`);
          validated.sender_id = userId;
        } else {
          validated.sender_id = (existingUser as any).id;
        }
      }

      // Ensure chat exists
      const existingChat = this.db.prepare(
        'SELECT id FROM chats WHERE id = ?'
      ).get(validated.chat_id);

      if (!existingChat) {
        // Create chat if it doesn't exist
        this.db.prepare(`
          INSERT INTO chats (id, name, type, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?)
        `).run(
          validated.chat_id,
          `Chat ${validated.chat_id}`,
          'direct',
          Date.now(),
          Date.now()
        );
        console.log(`[DB] Created chat: ${validated.chat_id}`);

        // Add current user as participant
        this.db.prepare(`
          INSERT INTO chat_participants (id, chat_id, user_id, joined_at, last_read_at)
          VALUES (?, ?, ?, ?, ?)
        `).run(
          `cp_${validated.chat_id}_current_user`,
          validated.chat_id,
          'current_user',
          Date.now(),
          0
        );

        // Add sender as participant if different from current user
        if (validated.sender_id !== 'current_user') {
          this.db.prepare(`
            INSERT INTO chat_participants (id, chat_id, user_id, joined_at, last_read_at)
            VALUES (?, ?, ?, ?, ?)
          `).run(
            `cp_${validated.chat_id}_${validated.sender_id}`,
            validated.chat_id,
            validated.sender_id,
            Date.now(),
            0
          );
        }
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
   * Get chats for a specific user with unread counts
   */
  async getUserChats(userId: string): Promise<any[]> {
    try {
      this.db.prepare(`
        CREATE TABLE IF NOT EXISTS message_reads (
          id TEXT PRIMARY KEY,
          message_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          read_at INTEGER NOT NULL,
          FOREIGN KEY (message_id) REFERENCES messages (id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          UNIQUE(message_id, user_id)
        );
      `).run();

      this.db.prepare(`
        CREATE TABLE IF NOT EXISTS message_attachments (
          id TEXT PRIMARY KEY,
          message_id TEXT NOT NULL,
          filename TEXT NOT NULL,
          file_url TEXT NOT NULL,
          file_type TEXT NOT NULL,
          file_size INTEGER NOT NULL,
          uploaded_at INTEGER NOT NULL,
          FOREIGN KEY (message_id) REFERENCES messages (id) ON DELETE CASCADE
        );
      `).run();

      this.db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_message_reads_message_id ON message_reads(message_id);
      `).run();

      this.db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_message_reads_user_id ON message_reads(user_id);
      `).run();

      this.db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON message_attachments(message_id);
      `).run();

      const chats = this.db.prepare(`
        SELECT DISTINCT 
          c.id,
          c.name,
          c.type,
          c.updated_at,
          COALESCE(
            (
              SELECT COUNT(*) 
              FROM messages m 
              LEFT JOIN message_reads mr ON m.id = mr.message_id AND mr.user_id = ?
              WHERE m.chat_id = c.id 
                AND m.sender_id != ? 
                AND mr.read_at IS NULL
            ), 0
          ) as unread_count,
          (
            SELECT m.content 
            FROM messages m 
            WHERE m.chat_id = c.id 
            ORDER BY m.timestamp DESC 
            LIMIT 1
          ) as last_message
        FROM chats c
        INNER JOIN chat_participants cp ON c.id = cp.chat_id
        WHERE cp.user_id = ?
        ORDER BY c.updated_at DESC
      `).all(userId, userId, userId);

      return chats;
    } catch (error) {
      console.error('[DB] Failed to get user chats:', error);
      throw error;
    }
  }

  /**
   * Get messages for a chat with pagination and user read status
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
   * Send a message and persist to database
   */
  async sendMessage(chatId: string, senderId: string, content: string): Promise<any> {
    try {
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const timestamp = Date.now();

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
   * Get user by ID
   */
  async getUserById(userId: string): Promise<any> {
    try {
      const user = this.db.prepare(`
        SELECT id, email, display_name, created_at, updated_at
        FROM users 
        WHERE id = ?
      `).get(userId);

      return user || null;
    } catch (error) {
      console.error('[DB] Failed to get user:', error);
      throw error;
    }
  }

  /**
   * Get or create user by email
   */
  async getOrCreateUser(email: string, displayName: string): Promise<any> {
    try {
      // Try to get existing user
      let user = this.db.prepare(`
        SELECT id, email, display_name, created_at, updated_at
        FROM users 
        WHERE email = ?
      `).get(email);

      if (!user) {
        // Create new user
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = Date.now();

        this.db.prepare(`
          INSERT INTO users (id, email, display_name, password_hash, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(userId, email, displayName, 'demo_hash', now, now);

        user = {
          id: userId,
          email,
          display_name: displayName,
          created_at: now,
          updated_at: now
        };

        console.log(`[DB] Created new user: ${userId}`);
      }

      return user;
    } catch (error) {
      console.error('[DB] Failed to get or create user:', error);
      throw error;
    }
  }

  /**
   * Get chat participants
   */
  async getChatParticipants(chatId: string): Promise<any[]> {
    try {
      const participants = this.db.prepare(`
        SELECT cp.*, u.display_name, u.email
        FROM chat_participants cp
        INNER JOIN users u ON cp.user_id = u.id
        WHERE cp.chat_id = ?
        ORDER BY cp.joined_at ASC
      `).all(chatId);

      return participants;
    } catch (error) {
      console.error('[DB] Failed to get chat participants:', error);
      throw error;
    }
  }

  /**
   * Create or get direct chat between two users
   */
  async getOrCreateDirectChat(userId1: string, userId2: string): Promise<any> {
    try {
      // Check if direct chat already exists
      const existingChat = this.db.prepare(`
        SELECT c.*
        FROM chats c
        INNER JOIN chat_participants cp1 ON c.id = cp1.chat_id
        INNER JOIN chat_participants cp2 ON c.id = cp2.chat_id
        WHERE c.type = 'direct' 
          AND cp1.user_id = ? AND cp2.user_id = ?
          AND cp1.user_id != cp2.user_id
      `).get(userId1, userId2);

      if (existingChat) {
        return existingChat;
      }

      // Create new direct chat
      const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = Date.now();

      // Get other user's display name for chat name
      const otherUser = await this.getUserById(userId2);

      this.db.prepare(`
        INSERT INTO chats (id, name, type, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(chatId, otherUser?.display_name || 'Unknown User', 'direct', now, now);

      // Add participants
      this.db.prepare(`
        INSERT INTO chat_participants (id, chat_id, user_id, joined_at, last_read_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(`cp_${chatId}_${userId1}`, chatId, userId1, now, now);

      this.db.prepare(`
        INSERT INTO chat_participants (id, chat_id, user_id, joined_at, last_read_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(`cp_${chatId}_${userId2}`, chatId, userId2, now, 0);

      const chat = {
        id: chatId,
        name: otherUser?.display_name || 'Unknown User',
        type: 'direct',
        created_at: now,
        updated_at: now
      };

      console.log(`[DB] Created direct chat: ${chatId}`);
      return chat;
    } catch (error) {
      console.error('[DB] Failed to create direct chat:', error);
      throw error;
    }
  }

  /**
   * Upsert chat with latest data (for sync events)
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
      }

      return false;

    } catch (error) {
      console.error('[DB] Failed to upsert chat:', error);
      throw error;
    }
  }

  /**
   * Get all chats ordered by updated_at DESC (legacy method)
   */
  async getAllChats(): Promise<any[]> {
    try {
      const chats = this.db.prepare(`
        SELECT 
          c.id,
          c.name,
          c.type,
          c.updated_at,
          c.created_at,
          (
            SELECT m.content 
            FROM messages m 
            WHERE m.chat_id = c.id AND m.deleted_at = 0
            ORDER BY m.timestamp DESC 
            LIMIT 1
          ) as last_message,
          0 as unread_count
        FROM chats c 
        ORDER BY c.updated_at DESC
      `).all();

      return chats;
    } catch (error) {
      console.error('[DB] Failed to get chats:', error);
      throw error;
    }
  }

  /**
   * Add file attachment to a message
   */
  async addMessageAttachment(
    messageId: string,
    filename: string,
    fileUrl: string,
    fileType: string,
    fileSize: number
  ): Promise<boolean> {
    try {
      const attachmentId = `att_${messageId}_${Date.now()}`;
      
      this.db.prepare(`
        INSERT INTO message_attachments (id, message_id, filename, file_url, file_type, file_size, uploaded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        attachmentId,
        messageId,
        filename,
        fileUrl,
        fileType,
        fileSize,
        Date.now()
      );
      
      console.log(`[DB] Added attachment: ${filename} to message ${messageId}`);
      return true;
    } catch (error) {
      console.error('[DB] Failed to add message attachment:', error);
      return false;
    }
  }

  /**
   * Get attachments for a message
   */
  async getMessageAttachments(messageId: string): Promise<any[]> {
    try {
      const attachments = this.db.prepare(`
        SELECT id, filename, file_url, file_type, file_size, uploaded_at
        FROM message_attachments
        WHERE message_id = ?
        ORDER BY uploaded_at ASC
      `).all(messageId);
      
      return attachments;
    } catch (error) {
      console.error('[DB] Failed to get message attachments:', error);
      return [];
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
}
