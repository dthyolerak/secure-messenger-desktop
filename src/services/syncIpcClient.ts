// src/services/syncIpcClient.ts
import { store } from '../app/store';
import { addOrUpdateChat, selectChat } from '../app/slices/chatsSlice';
import { setConnectionStatus, hideNotification } from '../app/slices/connectionSlice';
import type { ChatItem } from '../app/slices/chatsSlice';

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
      console.log('[Sync] New message received:', message);
      // Message thread component will handle this
    });

    // Listen for chat updates (for reordering)
    this.api.onChatUpdated((chatData: any) => {
      console.log('[Sync] Chat updated:', chatData);
      
      // Transform to ChatItem format
      const chatItem: ChatItem = {
        id: chatData.id,
        name: chatData.name,
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
   * Mark messages as read for a chat
   */
  async markMessagesRead(chatId: string) {
    try {
      const result = await this.api.markMessagesRead(chatId);
      console.log('[Sync] Marked messages as read:', result);
      return result;
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
      throw error;
    }
  }

  /**
   * Send a message
   */
  async sendMessage(chatId: string, content: string) {
    try {
      const result = await this.api.sendMessage(chatId, content);
      console.log('[Sync] Message sent:', result);
      return result;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const syncIpcClient = new SyncIpcClient();
