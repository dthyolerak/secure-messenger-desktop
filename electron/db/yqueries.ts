// electron/db/queries.ts
import { Database } from 'better-sqlite3';
import { z } from 'zod';

const DEFAULT_CURRENT_USER = 'You';

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
  type: z.enum(['text', 'image', 'file']).optional(),
  file_path: z.string().nullable().optional(),
  file_name: z.string().nullable().optional(),
  file_size: z.number().nullable().optional(),
  mime_type: z.string().nullable().optional(),
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

  private resolveUserAliases(currentUser: string): [string, string] {
    const primaryUser = currentUser?.trim() || DEFAULT_CURRENT_USER;
    const fallbackUser = DEFAULT_CURRENT_USER;
    return [primaryUser, fallbackUser];
  }

  private getMessageReactions(messageIds: string[], currentUser: string): Record<string, any[]> {
    if (messageIds.length === 0) {
      return {};
    }

    const placeholders = messageIds.map(() => '?').join(', ');
    const rows = this.db.prepare(`
      SELECT message_id, emoji, COUNT(*) as count,
             SUM(CASE WHEN user_id = ? THEN 1 ELSE 0 END) as reacted_by_current_user
      FROM message_reactions
      WHERE message_id IN (${placeholders})
      GROUP BY message_id, emoji
    `).all(currentUser, ...messageIds) as Array<{
      message_id: string;
      emoji: string;
      count: number;
      reacted_by_current_user: number;
    }>;

    return rows.reduce<Record<string, any[]>>((acc, row) => {
      const existing = acc[row.message_id] ?? [];
      existing.push({
        emoji: row.emoji,
        count: row.count,
        reactedByCurrentUser: row.reacted_by_current_user > 0,
      });
      acc[row.message_id] = existing;
      return acc;
    }, {});
  }

  /**
   * Insert or update message with deduplication
   * Returns true if message was inserted, false if duplicate
   */
  async insertMessage(message: unknown, currentUser: string = 'You'): Promise<boolean> {
    try {
      // Security: Never log message content - only log metadata
      const msgMeta = message as { id?: string; chat_id?: string; sender?: string };
      console.log('[DB] Raw message received:', { id: msgMeta.id, chat_id: msgMeta.chat_id, sender: msgMeta.sender });
      
      const validated = MessageEventSchema.parse(message);
      console.log('[DB] Message validated successfully:', { id: validated.id, chat_id: validated.chat_id });

      const readAt =
        validated.read_at !== undefined
          ? validated.read_at
          : validated.is_read
            ? validated.timestamp
            : validated.sender === currentUser
              ? validated.timestamp
              : null;
      const isEdited = validated.is_edited ? 1 : 0;
      const messageType = validated.type ?? 'text';
      const filePath = validated.file_path ?? null;
      const fileName = validated.file_name ?? null;
      const fileSize = validated.file_size ?? null;
      const mimeType = validated.mime_type ?? null;
      
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
        INSERT INTO messages (
          id,
          chat_id,
          sender,
          recipient,
          content,
          timestamp,
          read_at,
          is_edited,
          type,
          file_path,
          file_name,
          file_size,
          mime_type
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

      const chatPreview =
        validated.content?.trim() ||
        (messageType === 'image'
          ? `📷 ${fileName ?? 'Image'}`
          : messageType === 'file'
            ? `📎 ${fileName ?? 'Attachment'}`
            : '');

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
          isEdited,
          messageType,
          filePath,
          fileName,
          fileSize,
          mimeType
        );
        
        console.log('[DB] Executing chat update...');
        const unreadCount = selectUnreadCount.get(validated.chat_id, currentUser) as { count: number };
        updateChat.run(
          chatPreview,
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
        WHERE chat_id = ?
        ORDER BY timestamp ASC 
        LIMIT ? OFFSET ?
      `).all(chatId, limit, offset);

      const messageIds = messages.map((msg: any) => msg.id);
      const reactions = this.getMessageReactions(messageIds, currentUser);

      return messages.map((message: any) => ({
        ...message,
        reactions: reactions[message.id] ?? [],
      }));
    } catch (error) {
      console.error('[DB] Failed to get messages:', error);
      throw error;
    }
  }

  /**
   * Search messages by content or file name (case-insensitive)
   */
  async searchMessages(
    query: string,
    currentUser: string = 'You',
    limit: number = 50,
    offset: number = 0
  ): Promise<any[]> {
    try {
      const searchPattern = `%${query.toLowerCase()}%`;
      const messages = this.db.prepare(`
        SELECT m.*, c.name as chat_name
        FROM messages m
        INNER JOIN chats c ON m.chat_id = c.id
        WHERE (
          LOWER(m.content) LIKE ?
          OR LOWER(COALESCE(m.file_name, '')) LIKE ?
        )
        ORDER BY m.timestamp DESC
        LIMIT ? OFFSET ?
      `).all(searchPattern, searchPattern, limit, offset);

      const messageIds = messages.map((msg: any) => msg.id);
      const reactions = this.getMessageReactions(messageIds, currentUser);

      return messages.map((message: any) => ({
        ...message,
        reactions: reactions[message.id] ?? [],
      }));
    } catch (error) {
      console.error('[DB] Failed to search messages:', error);
      throw error;
    }
  }

  /**
   * Search chats by name or last message (case-insensitive)
   */
  async searchChats(query: string, limit: number = 50, offset: number = 0): Promise<{ chats: any[]; total: number }> {
    try {
      const trimmed = query.trim();
      if (!trimmed) {
        const chats = this.db.prepare(`
          SELECT id, name, last_message, updated_at, COALESCE(unread_count, 0) as unread_count
          FROM chats
          ORDER BY updated_at DESC
          LIMIT ? OFFSET ?
        `).all(limit, offset);

        const total = this.db.prepare('SELECT COUNT(*) as count FROM chats').get() as { count: number };
        return { chats, total: total.count };
      }

      const searchPattern = `%${trimmed.toLowerCase()}%`;
      const totalResult = this.db.prepare(`
        SELECT COUNT(*) as count
        FROM chats
        WHERE LOWER(name) LIKE ? OR LOWER(COALESCE(last_message, '')) LIKE ?
      `).get(searchPattern, searchPattern) as { count: number };

      const chats = this.db.prepare(`
        SELECT id, name, last_message, updated_at, COALESCE(unread_count, 0) as unread_count
        FROM chats
        WHERE LOWER(name) LIKE ? OR LOWER(COALESCE(last_message, '')) LIKE ?
        ORDER BY updated_at DESC
        LIMIT ? OFFSET ?
      `).all(searchPattern, searchPattern, limit, offset);

      return { chats, total: totalResult.count };
    } catch (error) {
      console.error('[DB] Failed to search chats:', error);
      throw error;
    }
  }

  /**
   * Toggle emoji reaction for a message and return updated reactions
   */
  async toggleReaction(messageId: string, userId: string, emoji: string): Promise<any[]> {
    try {
      const existing = this.db.prepare(`
        SELECT id FROM message_reactions
        WHERE message_id = ? AND user_id = ? AND emoji = ?
      `).get(messageId, userId, emoji) as { id: string } | undefined;

      if (existing) {
        this.db.prepare(`
          DELETE FROM message_reactions
          WHERE id = ?
        `).run(existing.id);
      } else {
        this.db.prepare(`
          INSERT INTO message_reactions (id, message_id, user_id, emoji, created_at)
          VALUES (?, ?, ?, ?, ?)
        `).run(`mr_${messageId}_${userId}_${Date.now()}`, messageId, userId, emoji, Date.now());
      }

      const reactions = this.db.prepare(`
        SELECT emoji, COUNT(*) as count,
               SUM(CASE WHEN user_id = ? THEN 1 ELSE 0 END) as reacted_by_current_user
        FROM message_reactions
        WHERE message_id = ?
        GROUP BY emoji
      `).all(userId, messageId) as Array<{
        emoji: string;
        count: number;
        reacted_by_current_user: number;
      }>;

      return reactions.map((reaction) => ({
        emoji: reaction.emoji,
        count: reaction.count,
        reactedByCurrentUser: reaction.reacted_by_current_user > 0,
      }));
    } catch (error) {
      console.error('[DB] Failed to toggle reaction:', error);
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
      const [primaryUser, fallbackUser] = this.resolveUserAliases(currentUser);
      const result = this.db.prepare(`
        UPDATE messages 
        SET read_at = ? 
        WHERE chat_id = ? AND recipient IN (?, ?) AND read_at IS NULL
      `).run(readAt, chatId, primaryUser, fallbackUser);

      // Update chat unread count to reflect only unread messages for current user
      const unreadCount = this.db.prepare(`
        SELECT COUNT(*) as count FROM messages 
        WHERE chat_id = ? AND recipient IN (?, ?) AND read_at IS NULL
      `).get(chatId, primaryUser, fallbackUser) as { count: number };

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
      const [primaryUser, fallbackUser] = this.resolveUserAliases(currentUser);
      const unreadCounts = this.db.prepare(`
        SELECT chat_id, COUNT(*) as count
        FROM messages 
        WHERE read_at IS NULL AND recipient IN (?, ?)
        GROUP BY chat_id
      `).all(primaryUser, fallbackUser);

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
  async deleteMessage(messageId: string): Promise<{ success: boolean; chatId?: string }> {
    try {
      const message = this.db.prepare(`
        SELECT chat_id FROM messages WHERE id = ?
      `).get(messageId) as { chat_id: string } | undefined;

      if (!message) {
        return { success: false };
      }

      const result = this.db.prepare(`
        DELETE FROM messages WHERE id = ?
      `).run(messageId);

      if (result.changes > 0) {
        const latestMessage = this.db.prepare(`
          SELECT content, type, file_name, timestamp
          FROM messages
          WHERE chat_id = ?
          ORDER BY timestamp DESC
          LIMIT 1
        `).get(message.chat_id) as
          | { content: string; type?: string | null; file_name?: string | null; timestamp: number }
          | undefined;

        const lastMessage = latestMessage
          ? latestMessage.content?.trim() ||
            (latestMessage.type === 'image'
              ? `📷 ${latestMessage.file_name ?? 'Image'}`
              : latestMessage.type === 'file'
                ? `📎 ${latestMessage.file_name ?? 'Attachment'}`
                : '')
          : '';

        const updatedAt = latestMessage ? latestMessage.timestamp : Date.now();

        this.db.prepare(`
          UPDATE chats
          SET last_message = ?, updated_at = ?
          WHERE id = ?
        `).run(lastMessage, updatedAt, message.chat_id);
      }

      return { success: result.changes > 0, chatId: message.chat_id };
    } catch (error) {
      console.error('[DB] Failed to delete message:', error);
      throw error;
    }
  }

  /**
   * Update message content
   */
  async updateMessage(messageId: string, content: string): Promise<{ success: boolean; chatId?: string }> {
    try {
      const message = this.db.prepare(`
        SELECT chat_id FROM messages WHERE id = ?
      `).get(messageId) as { chat_id: string } | undefined;

      if (!message) {
        return { success: false };
      }

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
          WHERE id = ?
        `).run(content, Date.now(), message.chat_id);
      }

      return { success: result.changes > 0, chatId: message.chat_id };
    } catch (error) {
      console.error('[DB] Failed to update message:', error);
      throw error;
    }
  }

  /**
   * Delete chat and all its messages
   */
  async deleteChat(chatId: string): Promise<{ success: boolean }> {
    try {
      // First delete all messages in the chat
      this.db.prepare(`
        DELETE FROM messages WHERE chat_id = ?
      `).run(chatId);

      // Delete all reactions for messages in this chat
      this.db.prepare(`
        DELETE FROM message_reactions WHERE message_id IN (
          SELECT id FROM messages WHERE chat_id = ?
        )
      `).run(chatId);

      // Then delete the chat itself
      const result = this.db.prepare(`
        DELETE FROM chats WHERE id = ?
      `).run(chatId);

      console.log(`[DB] Deleted chat ${chatId}: ${result.changes > 0 ? 'success' : 'not found'}`);
      return { success: result.changes > 0 };
    } catch (error) {
      console.error('[DB] Failed to delete chat:', error);
      throw error;
    }
  }

  /**
   * Seed database with large dataset for testing performance
   * Creates 200 chats with 20,000+ messages distributed across them
   */
  async seedLargeDataset(): Promise<{ chats: number; messages: number }> {
    console.log('[DB] Starting large dataset seed...');
    
    const CHAT_COUNT = 200;
    const MESSAGE_COUNT = 20000;
    const currentUser = 'You';
    
    // Sample data for realistic content
    const firstNames = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];
    const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
    const messageTemplates = [
      'Hey, how are you?',
      'Did you see the latest update?',
      'Let me know when you\'re free',
      'Great work on the project!',
      'Can we schedule a meeting?',
      'Thanks for your help!',
      'I\'ll get back to you soon',
      'That sounds good to me',
      'Let\'s discuss this tomorrow',
      'I have a question about the proposal',
      'The deadline is approaching',
      'Please review the document',
      'I\'ve updated the spreadsheet',
      'Can you send me the file?',
      'I\'m working on it now',
      'Let\'s sync up later today',
      'Great progress so far!',
      'I need more information',
      'When is the next meeting?',
      'I\'ll send the report by EOD',
    ];
    
    try {
      // Use transaction for better performance
      const insertChat = this.db.prepare(`
        INSERT OR REPLACE INTO chats (id, name, last_message, updated_at, unread_count)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      const insertMessage = this.db.prepare(`
        INSERT OR REPLACE INTO messages (id, chat_id, sender, recipient, content, timestamp, read_at, is_edited, type)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'text')
      `);
      
      const startTime = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      const thirtyDaysAgo = startTime - (30 * oneDay);
      
      // Create chats
      const chats: Array<{ id: string; name: string }> = [];
      
      this.db.exec('BEGIN TRANSACTION');
      
      for (let i = 1; i <= CHAT_COUNT; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const chatName = i <= 10 
          ? `${firstName} ${lastName}` 
          : i <= 20 
            ? `Team ${String.fromCharCode(64 + (i - 10))}` // Team A, Team B, etc.
            : `Chat ${i}`;
        
        const chatId = String(i);
        const updatedAt = thirtyDaysAgo + Math.floor(Math.random() * (startTime - thirtyDaysAgo));
        const unreadCount = Math.random() < 0.3 ? Math.floor(Math.random() * 10) : 0;
        
        insertChat.run(chatId, chatName, 'Loading messages...', updatedAt, unreadCount);
        chats.push({ id: chatId, name: chatName });
      }
      
      console.log(`[DB] Created ${CHAT_COUNT} chats`);
      
      // Distribute messages across chats (weighted towards first 50 chats)
      let messagesCreated = 0;
      
      for (let i = 0; i < MESSAGE_COUNT; i++) {
        // Weight message distribution - more messages in earlier chats
        const chatIndex = Math.floor(Math.pow(Math.random(), 1.5) * CHAT_COUNT);
        const chat = chats[chatIndex];
        if (!chat) continue;
        
        const isOutgoing = Math.random() < 0.4; // 40% outgoing
        const sender = isOutgoing ? currentUser : chat.name;
        const recipient = isOutgoing ? chat.name : currentUser;
        
        const messageId = `seed_msg_${i}_${Date.now()}`;
        const content = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
        const timestamp = thirtyDaysAgo + Math.floor(Math.random() * (startTime - thirtyDaysAgo));
        const readAt = isOutgoing ? timestamp : (Math.random() < 0.8 ? timestamp : null);
        
        insertMessage.run(messageId, chat.id, sender, recipient, content, timestamp, readAt);
        messagesCreated++;
        
        // Log progress every 5000 messages
        if (messagesCreated % 5000 === 0) {
          console.log(`[DB] Created ${messagesCreated} messages...`);
        }
      }
      
      // Update each chat's last_message with the most recent message
      const updateLastMessage = this.db.prepare(`
        UPDATE chats SET 
          last_message = (
            SELECT content FROM messages 
            WHERE chat_id = chats.id 
            ORDER BY timestamp DESC LIMIT 1
          ),
          updated_at = (
            SELECT timestamp FROM messages 
            WHERE chat_id = chats.id 
            ORDER BY timestamp DESC LIMIT 1
          )
        WHERE id = ?
      `);
      
      for (const chat of chats) {
        updateLastMessage.run(chat.id);
      }
      
      this.db.exec('COMMIT');
      
      const duration = Date.now() - startTime;
      console.log(`[DB] Seed complete: ${CHAT_COUNT} chats, ${messagesCreated} messages in ${duration}ms`);
      
      return { chats: CHAT_COUNT, messages: messagesCreated };
    } catch (error) {
      this.db.exec('ROLLBACK');
      console.error('[DB] Failed to seed dataset:', error);
      throw error;
    }
  }

  /**
   * Clear all data (for testing)
   */
  async clearAllData(): Promise<void> {
    try {
      this.db.exec('BEGIN TRANSACTION');
      this.db.exec('DELETE FROM messages');
      this.db.exec('DELETE FROM chats');
      this.db.exec('DELETE FROM message_reactions');
      this.db.exec('COMMIT');
      console.log('[DB] All data cleared');
    } catch (error) {
      this.db.exec('ROLLBACK');
      console.error('[DB] Failed to clear data:', error);
      throw error;
    }
  }
}
