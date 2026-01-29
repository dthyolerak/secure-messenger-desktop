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
  private currentUserId: string | null = null;

  constructor() {
    if (!window.secureMessenger?.sync) {
      throw new Error('Sync API not available. Ensure preload is properly loaded.');
    }
    this.api = window.secureMessenger.sync;
    this.setupEventListeners();
    this.initializeCurrentUser();
  }

  /**
   * Initialize current user ID
   */
  private async initializeCurrentUser(): Promise<void> {
    try {
      const userId = await this.api.getCurrentUserId();
      if (userId) {
        this.currentUserId = userId;
        console.log('[Sync] Current user ID set:', userId);
      }
    } catch (error) {
      console.error('[Sync] Failed to get current user ID:', error);
    }
  }

  /**
   * Set current user ID for multi-user operations
   */
  setCurrentUserId(userId: string): void {
    this.currentUserId = userId;
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

    // Listen for open chat events (from desktop notifications)
    this.api.onOpenChat((data: { chatId: string }) => {
      console.log('[Sync] Opening chat from notification:', data.chatId);
      store.dispatch(selectChat(data.chatId));
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
   * Get all chats (legacy method)
   */
  async getChats() {
    try {
      console.log('[Sync] Fetching chats...');
      const response = await this.api.getChats();
      console.log('[Sync] Raw response:', response);
      
      if (response.success) {
        console.log('[Sync] Chat data:', response.data);
        return response;
      } else {
        throw new Error(response.error || 'Failed to get chats');
      }
    } catch (error) {
      console.error('Failed to get chats:', error);
      throw error;
    }
  }

  /**
   * Get user chats
   */
  async getUserChats(userId: string) {
    try {
      const response = await this.api.getUserChats(userId);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to get user chats');
      }
    } catch (error) {
      console.error('Failed to get user chats:', error);
      throw error;
    }
  }

  /**
   * Get messages for a chat
   */
  async getMessages(chatId: string, userId: string, limit?: number, offset?: number) {
    try {
      const response = await this.api.getMessages(chatId, userId, limit, offset);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to get messages');
      }
    } catch (error) {
      console.error('Failed to get messages:', error);
      throw error;
    }
  }

  /**
   * Send a message
   */
  async sendMessage(chatId: string, content: string) {
    try {
      if (!this.currentUserId) {
        throw new Error('Current user ID not set');
      }

      const response = await this.api.sendMessage(chatId, this.currentUserId, content);
      if (response.success) {
        console.log('[Sync] Message sent:', response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Mark messages as read for a chat
   */
  async markMessagesRead(chatId: string) {
    try {
      if (!this.currentUserId) {
        throw new Error('Current user ID not set');
      }

      const response = await this.api.markMessagesRead(chatId, this.currentUserId);
      if (response.success) {
        console.log('[Sync] Marked messages as read:', response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to mark messages as read');
      }
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
      throw error;
    }
  }

  /**
   * Get or create user
   */
  async getOrCreateUser(email: string, displayName: string) {
    try {
      const response = await this.api.getOrCreateUser(email, displayName);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to get or create user');
      }
    } catch (error) {
      console.error('Failed to get or create user:', error);
      throw error;
    }
  }

  /**
   * Get or create direct chat
   */
  async getOrCreateDirectChat(userId1: string, userId2: string) {
    try {
      const response = await this.api.getOrCreateDirectChat(userId1, userId2);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to get or create direct chat');
      }
    } catch (error) {
      console.error('Failed to get or create direct chat:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const syncIpcClient = new SyncIpcClient();
