// src/domains/chats/chats.service.ts
import type { Chat, GetChatsRequest, GetChatsResponse } from './chats.types';

/**
 * Fetch chats from SQLite with pagination.
 * This runs in Electron Main process only.
 */
export function getChats(db: any, request: GetChatsRequest): GetChatsResponse {
  // Check if database is initialized
  if (!db) {
    throw new Error('Database not initialized');
  }

  const { offset, limit } = request;

  try {
    // Get total count
    const totalResult = db.prepare('SELECT COUNT(*) as count FROM chats').get() as { count: number };
    const total = totalResult.count;

    // Fetch paginated chats ordered by updated_at DESC
    const chats = db.prepare(`
      SELECT 
        id,
        name,
        last_message,
        updated_at,
        unread_count
      FROM chats
      ORDER BY updated_at DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset) as Chat[];

    const hasMore = offset + chats.length < total;

    return {
      chats,
      total,
      hasMore,
    };
  } catch (error) {
    console.error('Error in getChats service:', error);
    throw error;
  }
}
