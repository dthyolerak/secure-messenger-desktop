// src/services/syncIpcClient.ts
import { store } from '../app/store';
import { addOrUpdateChat } from '../app/slices/chatsSlice';
import { setConnectionStatus, hideNotification } from '../app/slices/connectionSlice';
import type { ChatItem } from '../app/slices/chatsSlice';
import type {
  AttachmentUploadProgress,
  MessageAttachmentPayload,
  MessageReaction,
  MessageSearchResult,
} from '../domains/messages/messages.types';

/**
 * Sync IPC client for handling real-time updates from WebSocket sync.
 * Listens to IPC events and updates Redux state accordingly.
 */
class SyncIpcClient {
  private api: any;
  private notificationTimeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    if (!window.secureMessenger?.sync) {
      throw new Error('Sync API not available. Ensure preload is properly loaded.');
    }
    this.api = window.secureMessenger.sync;
    this.setupEventListeners();
  }

  /**
   * Setup event listeners for real-time sync events
   */
  private setupEventListeners(): void {
    // Listen for connection status changes
    this.api.onConnectionStatus((status: any) => {
      console.log('[Sync] Connection status changed:', status);
      
      // Update Redux state
      store.dispatch(setConnectionStatus({
        status: status.status,
        lastConnected: status.lastConnected,
        reconnectAttempts: status.reconnectAttempts,
      }));

      // Auto-hide notification after 3 seconds for connected status
      if (status.status === 'connected') {
        this.scheduleNotificationHide('connected', 3000);
      }
    });

    this.api.onConnectionConnected(() => {
      console.log('[Sync] Connected to server');
      store.dispatch(setConnectionStatus({ status: 'connected' }));
      this.scheduleNotificationHide('connected', 3000);
    });

    this.api.onConnectionDisconnected(() => {
      console.log('[Sync] Disconnected from server');
      store.dispatch(setConnectionStatus({ status: 'offline' }));
      // Don't auto-hide offline notification
    });

    // Listen for message insertions
    this.api.onMessageInserted((message: any) => {
      // Security: Never log message content - only log metadata
      console.log('[Sync] New message received:', { id: message.id, chat_id: message.chat_id, sender: message.sender });
      // Message thread component will handle this
    });

    // Listen for chat updates (for reordering)
    this.api.onChatUpdated((chatData: any) => {
      console.log('[Sync] Chat updated:', chatData);
      
      // Transform to ChatItem format
      const chatItem: ChatItem = {
        id: chatData.id,
        name: chatData.name,
        userId: chatData.user_id || chatData.userId,
        lastMessage: chatData.last_message,
        updatedAt: chatData.updated_at,
        unreadCount: chatData.unread_count || 0,
      };

      // Update Redux state - this will trigger reordering
      store.dispatch(addOrUpdateChat(chatItem));
    });

    // Listen for chat list updates (refresh entire list)
    this.api.onChatListUpdated(() => {
      console.log('[Sync] Chat list updated, refreshing...');
      // Could trigger a full refresh if needed
    });
  }

  /**
   * Schedule hiding of notification after delay
   */
  private scheduleNotificationHide(key: string, delay: number): void {
    // Clear existing timeout for this key
    const existing = this.notificationTimeouts.get(key);
    if (existing) {
      clearTimeout(existing);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      store.dispatch(hideNotification());
      this.notificationTimeouts.delete(key);
    }, delay);

    this.notificationTimeouts.set(key, timeout);
  }

  /**
   * Get messages for a chat
   */
  async getMessages(chatId: string, limit?: number, offset?: number, currentUser?: string) {
    try {
      return await this.api.getMessages(chatId, limit, offset, currentUser);
    } catch (error) {
      console.error('Failed to get messages:', error);
      throw error;
    }
  }

  /**
   * Get or create direct chat with user
   */
  async getOrCreateDirectChat(currentUserId: string, targetUserId: string) {
    try {
      // Mock implementation - create or return existing chat
      const chatId = [currentUserId, targetUserId].sort().join('_');
      return {
        success: true,
        data: {
          id: chatId,
          name: targetUserId,
          last_message: '',
          updated_at: Date.now(),
          unread_count: 0
        }
      };
    } catch (error) {
      console.error('Failed to get or create direct chat:', error);
      throw error;
    }
  }

  /**
   * Clear all messages in a chat (but keep the chat)
   */
  async clearChatMessages(chatId: string) {
    try {
      return await this.api.clearChatMessages(chatId);
    } catch (error) {
      console.error('Failed to clear chat messages:', error);
      throw error;
    }
  }

  /**
   * Delete a chat and all its messages
   */
  async deleteChat(chatId: string) {
    try {
      return await this.api.deleteChat(chatId);
    } catch (error) {
      console.error('Failed to delete chat:', error);
      throw error;
    }
  }

  /**
   * Get current connection status
   */
  async getConnectionStatus() {
    try {
      return await this.api.getConnectionStatus();
    } catch (error) {
      console.error('Failed to get connection status:', error);
      return { status: 'offline' };
    }
  }

  /**
   * Simulate connection drop for testing reconnection logic
   */
  async simulateDisconnect() {
    try {
      return await this.api.simulateDisconnect();
    } catch (error) {
      console.error('Failed to simulate disconnect:', error);
      return { success: false };
    }
  }

  /**
   * Force immediate reconnection
   */
  async forceReconnect() {
    try {
      return await this.api.forceReconnect();
    } catch (error) {
      console.error('Failed to force reconnect:', error);
      return { success: false };
    }
  }

  /**
   * Seed database with large dataset (200 chats, 20000 messages)
   */
  async seedLargeDataset() {
    try {
      return await this.api.seedLargeDataset();
    } catch (error) {
      console.error('Failed to seed dataset:', error);
      return { success: false };
    }
  }

  /**
   * Clear all data from database
   */
  async clearAllData() {
    try {
      return await this.api.clearAllData();
    } catch (error) {
      console.error('Failed to clear data:', error);
      return { success: false };
    }
  }

  /**
   * Mark messages as read for a chat
   */
  async markMessagesRead(chatId: string, currentUser?: string) {
    try {
      return await this.api.markMessagesRead(chatId, currentUser);
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
      throw error;
    }
  }

  /**
   * Send a message
   */
  async sendMessage(
    chatId: string,
    content: string,
    sender: string,
    recipient: string,
    attachment?: MessageAttachmentPayload,
  ) {
    try {
      return await this.api.sendMessage(chatId, content, sender, recipient, attachment);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Update message content
   */
  async updateMessage(messageId: string, content: string) {
    try {
      return await this.api.updateMessage(messageId, content);
    } catch (error) {
      console.error('Failed to update message:', error);
      throw error;
    }
  }

  /**
   * Delete message
   */
  async deleteMessage(messageId: string) {
    try {
      return await this.api.deleteMessage(messageId);
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw error;
    }
  }

  /**
   * Select a local file attachment
   */
  async selectAttachment(
    currentUser?: string,
  ): Promise<{ success: boolean; data?: MessageAttachmentPayload; error?: string }> {
    try {
      return await this.api.selectAttachment(currentUser);
    } catch (error) {
      console.error('Failed to select attachment:', error);
      throw error;
    }
  }

  /**
   * Search messages across chats
   */
  async searchMessages(
    query: string,
    currentUser?: string,
    limit?: number,
    offset?: number,
  ): Promise<MessageSearchResult[]> {
    try {
      const response = await this.api.searchMessages(query, currentUser, limit, offset);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to search messages');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to search messages:', error);
      throw error;
    }
  }

  /**
   * Search chats by name or last message
   */
  async searchChats(query: string, limit?: number, offset?: number): Promise<{ chats: ChatItem[]; total: number }> {
    try {
      const response = await this.api.searchChats(query, limit, offset);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to search chats');
      }

      const chats: ChatItem[] = response.data.chats.map((chat: any) => ({
        id: chat.id,
        name: chat.name,
        lastMessage: chat.last_message ?? undefined,
        updatedAt: chat.updated_at,
        unreadCount: chat.unread_count ?? 0,
      }));

      return { chats, total: response.data.total };
    } catch (error) {
      console.error('Failed to search chats:', error);
      throw error;
    }
  }

  /**
   * Toggle emoji reaction
   */
  async toggleReaction(messageId: string, userId: string, emoji: string): Promise<MessageReaction[]> {
    try {
      const response = await this.api.toggleReaction(messageId, userId, emoji);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to toggle reaction');
      }
      return response.data.reactions;
    } catch (error) {
      console.error('Failed to toggle reaction:', error);
      throw error;
    }
  }

  /**
   * Subscribe to reaction updates
   */
  onMessageReactionsUpdated(callback: (payload: { messageId: string; reactions: MessageReaction[] }) => void): void {
    this.api.onMessageReactionsUpdated(callback);
  }

  /**
   * Subscribe to message insertion updates
   */
  onMessageInserted(callback: (message: any) => void): void {
    this.api.onMessageInserted(callback);
  }

  /**
   * Subscribe to message update events
   */
  onMessageUpdated(callback: (payload: { messageId: string; content: string }) => void): void {
    this.api.onMessageUpdated(callback);
  }

  /**
   * Subscribe to message delete events
   */
  onMessageDeleted(callback: (payload: { messageId: string }) => void): void {
    this.api.onMessageDeleted(callback);
  }

  /**
   * Subscribe to attachment upload progress
   */
  onAttachmentUploadProgress(callback: (payload: AttachmentUploadProgress) => void): void {
    this.api.onAttachmentUploadProgress(callback);
  }
}

// Export singleton instance
export const syncIpcClient = new SyncIpcClient();
