// src/domains/chats/chats.ipc.ts
import { ipcMain } from 'electron';
import { z } from 'zod';
import { getChats } from './chats.service';
import { getChatsMock } from './chats.mock';
import { CHATS_IPC_CHANNELS, type GetChatsRequest, type GetChatsResponse } from './chats.types';

// Zod schema for request validation
const GetChatsRequestSchema = z.object({
  offset: z.number().int().min(0),
  limit: z.number().int().min(1).max(100),
});

/**
 * Register IPC handlers for chat operations.
 * This runs in Electron Main process only.
 */
export function registerChatsIpc(db: any): void {
  ipcMain.handle(CHATS_IPC_CHANNELS.GET_CHATS, async (_event, rawRequest: unknown) => {
    try {
      // Validate request
      const request = GetChatsRequestSchema.parse(rawRequest) as GetChatsRequest;
      
      // Use mock data if database is not available
      if (!db) {
        console.log('Using mock data - database not initialized');
        const result = getChatsMock(request);
        return {
          success: true,
          data: result,
        };
      }
      
      // Fetch chats from SQLite
      const result = getChats(db, request);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Error in getChats IPC:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });
}
