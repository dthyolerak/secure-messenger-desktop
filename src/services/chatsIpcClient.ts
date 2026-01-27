// src/services/chatsIpcClient.ts
import type { GetChatsRequest, GetChatsResponse } from '../domains/chats/chats.types';

/**
 * Typed IPC client for chat operations.
 * Provides a clean interface to the chats API exposed via preload.
 */
class ChatsIpcClient {
  private api: any;

  constructor() {
    if (!window.secureMessenger?.chats) {
      throw new Error('Chats API not available. Ensure preload is properly loaded.');
    }
    this.api = window.secureMessenger.chats;
  }

  /**
   * Fetch chats with pagination from SQLite via IPC.
   */
  async getChats(request: GetChatsRequest): Promise<GetChatsResponse> {
    try {
      return await this.api.getChats(request);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const chatsIpcClient = new ChatsIpcClient();
