// electron/db/chats.ts
import { Database } from 'better-sqlite3';
import { z } from 'zod';

// Chat schema for validation
const ChatUpdateEventSchema = z.object({
  chat_id: z.string(),
  name: z.string().optional(),
  updated_at: z.number(),
});

export class ChatsDB {
  constructor(private db: Database) {}

  /**
   * Get chats for a specific user with unread counts
   * This returns user-specific chat data for the sidebar
   */
  async getUserChats(userId: string): Promise<any[]> {
    try {
      // Ensure tables exist
      this.ensureTables();

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

      console.log(`[CHATS] Retrieved ${chats.length} chats for user ${userId}`);
      return chats;
    } catch (error) {
      console.error('[CHATS] Failed to get user chats:', error);
      throw error;
    }
  }

  /**
   * Get all chats (legacy method for compatibility)
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

      console.log(`[CHATS] Retrieved ${chats.length} total chats`);
      return chats;
    } catch (error) {
      console.error('[CHATS] Failed to get all chats:', error);
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
      `).get(userId1, userId2) as { id: string } | undefined;

      if (existingChat) {
        console.log(`[CHATS] Found existing direct chat: ${existingChat.id}`);
        return existingChat;
      }

      // Create new direct chat
      const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = Date.now();

      // Get other user's display name for chat name
      const otherUser = this.db.prepare(
        'SELECT display_name FROM users WHERE id = ?'
      ).get(userId2) as { display_name: string } | undefined;

      if (!otherUser) {
        throw new Error(`User not found: ${userId2}`);
      }

      this.db.prepare(`
        INSERT INTO chats (id, name, type, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(chatId, otherUser.display_name, 'direct', now, now);

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
        name: otherUser.display_name,
        type: 'direct',
        created_at: now,
        updated_at: now
      };

      console.log(`[CHATS] Created direct chat: ${chatId} between ${userId1} and ${userId2}`);
      return chat;
    } catch (error) {
      console.error('[CHATS] Failed to create direct chat:', error);
      throw error;
    }
  }

  /**
   * Upsert chat with latest data (for sync events)
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
          console.log(`[CHATS] Chat updated: ${validated.chat_id}`);
          return true;
        }
      }

      return false;

    } catch (error) {
      console.error('[CHATS] Failed to upsert chat:', error);
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
      `).all(chatId) as Array<{
        id: string;
        chat_id: string;
        user_id: string;
        joined_at: number;
        last_read_at: number;
        display_name: string;
        email: string;
      }>;

      return participants;
    } catch (error) {
      console.error('[CHATS] Failed to get chat participants:', error);
      throw error;
    }
  }

  /**
   * Ensure required tables exist
   */
  private ensureTables(): void {
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

      // Create indexes for performance
      this.db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_message_reads_message_id ON message_reads(message_id);
      `).run();

      this.db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_message_reads_user_id ON message_reads(user_id);
      `).run();

      this.db.prepare(`
        CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON message_attachments(message_id);
      `).run();
    } catch (error) {
      console.error('[CHATS] Failed to ensure tables:', error);
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
      
      console.log(`[CHATS] Added attachment: ${filename} to message ${messageId}`);
      return true;
    } catch (error) {
      console.error('[CHATS] Failed to add message attachment:', error);
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
      console.error('[CHATS] Failed to get message attachments:', error);
      return [];
    }
  }
}
