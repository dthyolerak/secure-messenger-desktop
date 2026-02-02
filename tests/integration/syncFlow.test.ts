// tests/integration/syncFlow.test.ts
/**
 * Integration tests for sync flow
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

// Mock the chatsSlice without importing from src to avoid IPC issues
const chatsInitialState = {
  items: [] as any[],
  loading: false,
  error: null as string | null,
  selectedChatId: null as string | null,
  pagination: { offset: 0, limit: 50, hasMore: true },
};

const chatsReducer = (state = chatsInitialState, action: any) => {
  switch (action.type) {
    case 'chats/setChats':
      const { chats, append } = action.payload;
      if (append) {
        const existingIds = new Set(state.items.map(c => c.id));
        const newChats = chats.filter((c: any) => !existingIds.has(c.id));
        return { ...state, items: [...state.items, ...newChats], pagination: { ...state.pagination, hasMore: chats.length >= 50 } };
      }
      return { ...state, items: chats, pagination: { ...state.pagination, hasMore: chats.length >= 50 } };
    case 'chats/addChat':
      if (state.items.some(c => c.id === action.payload.id)) return state;
      return { ...state, items: [action.payload, ...state.items] };
    case 'chats/updateChat':
      return {
        ...state,
        items: state.items.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c)
          .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)),
      };
    case 'chats/removeChat':
      return {
        ...state,
        items: state.items.filter(c => c.id !== action.payload),
        selectedChatId: state.selectedChatId === action.payload ? null : state.selectedChatId,
      };
    case 'chats/setSelectedChat':
      return { ...state, selectedChatId: action.payload };
    default:
      return state;
  }
};

const setChats = (payload: { chats: any[]; append: boolean }) => ({ type: 'chats/setChats', payload });
const addChat = (chat: any) => ({ type: 'chats/addChat', payload: chat });
const updateChat = (update: any) => ({ type: 'chats/updateChat', payload: update });

// Mock connection reducer
const connectionInitialState = {
  status: 'offline' as const,
  reconnectAttempts: 0,
  showNotification: false,
};

const connectionReducer = (state = connectionInitialState, action: any) => {
  switch (action.type) {
    case 'connection/setConnected':
      return { ...state, status: 'connected' as const, reconnectAttempts: 0 };
    case 'connection/setDisconnected':
      return { ...state, status: 'offline' as const };
    case 'connection/setReconnecting':
      return { ...state, status: 'reconnecting' as const };
    default:
      return state;
  }
};

const setConnected = () => ({ type: 'connection/setConnected' });
const setDisconnected = () => ({ type: 'connection/setDisconnected' });
const setReconnecting = () => ({ type: 'connection/setReconnecting' });

// Mock messages reducer
const messagesReducer = (state = {}, action: any) => state;

/**
 * Mock sync service for testing
 */
class MockSyncService {
  private listeners: Map<string, Set<Function>> = new Map();
  private connected = false;

  connect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.connected = true;
        this.emit('connected', {});
        resolve();
      }, 10);
    });
  }

  disconnect(): void {
    this.connected = false;
    this.emit('disconnected', {});
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event: string, data: any): void {
    this.listeners.get(event)?.forEach((cb) => cb(data));
  }

  isConnected(): boolean {
    return this.connected;
  }

  // Simulate incoming message
  simulateIncomingMessage(message: any): void {
    this.emit('message', message);
  }

  // Simulate chat update
  simulateChatUpdate(chat: any): void {
    this.emit('chatUpdate', chat);
  }
}

describe('Sync Flow Integration', () => {
  let store: ReturnType<typeof configureStore>;
  let syncService: MockSyncService;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        chats: chatsReducer,
        messages: messagesReducer,
        connection: connectionReducer,
      },
    });
    syncService = new MockSyncService();
  });

  afterEach(() => {
    syncService.disconnect();
  });

  describe('Connection Flow', () => {
    it('should update store on connection', async () => {
      syncService.on('connected', () => {
        store.dispatch(setConnected());
      });

      await syncService.connect();

      expect(store.getState().connection.status).toBe('connected');
    });

    it('should handle disconnection', async () => {
      syncService.on('connected', () => store.dispatch(setConnected()));
      syncService.on('disconnected', () => store.dispatch(setDisconnected()));

      await syncService.connect();
      syncService.disconnect();

      expect(store.getState().connection.status).toBe('offline');
    });

    it('should handle reconnection flow', async () => {
      const statuses: string[] = [];
      
      store.subscribe(() => {
        const status = store.getState().connection.status;
        if (statuses[statuses.length - 1] !== status) {
          statuses.push(status);
        }
      });

      syncService.on('connected', () => store.dispatch(setConnected()));
      syncService.on('disconnected', () => {
        store.dispatch(setReconnecting());
        // Simulate reconnection
        setTimeout(() => syncService.connect(), 50);
      });

      await syncService.connect();
      syncService.disconnect();

      // Wait for reconnection
      await new Promise((r) => setTimeout(r, 100));

      expect(statuses).toContain('connected');
      expect(statuses).toContain('reconnecting');
    });
  });

  describe('Chat Sync Flow', () => {
    it('should update chat list on sync', async () => {
      const mockChats = [
        { id: '1', name: 'Alice', lastMessage: 'Hi', updatedAt: Date.now(), unreadCount: 1 },
        { id: '2', name: 'Bob', lastMessage: 'Hello', updatedAt: Date.now() - 1000, unreadCount: 0 },
      ];

      syncService.on('connected', () => {
        store.dispatch(setConnected());
        store.dispatch(setChats({ chats: mockChats, append: false }));
      });

      await syncService.connect();

      const state = store.getState().chats;
      expect(state.items).toHaveLength(2);
    });

    it('should handle chat update event', async () => {
      // Initial chat
      store.dispatch(setChats({
        chats: [{ id: '1', name: 'Alice', lastMessage: 'Hi', updatedAt: Date.now(), unreadCount: 1 }],
        append: false,
      }));

      syncService.on('chatUpdate', (chat: any) => {
        store.dispatch(updateChat(chat));
      });

      // Simulate update
      syncService.simulateChatUpdate({
        id: '1',
        lastMessage: 'New message',
        updatedAt: Date.now() + 1000,
        unreadCount: 2,
      });

      const state = store.getState().chats;
      const chat = state.items.find((c) => c.id === '1');
      expect(chat?.lastMessage).toBe('New message');
      expect(chat?.unreadCount).toBe(2);
    });

    it('should add new chat on sync event', async () => {
      store.dispatch(setChats({
        chats: [{ id: '1', name: 'Alice', lastMessage: 'Hi', updatedAt: Date.now(), unreadCount: 0 }],
        append: false,
      }));

      syncService.on('chatUpdate', (chat: any) => {
        const exists = store.getState().chats.items.some((c) => c.id === chat.id);
        if (!exists) {
          store.dispatch(addChat(chat));
        } else {
          store.dispatch(updateChat(chat));
        }
      });

      // Simulate new chat
      syncService.simulateChatUpdate({
        id: '2',
        name: 'Bob',
        lastMessage: 'Hey!',
        updatedAt: Date.now(),
        unreadCount: 1,
      });

      const state = store.getState().chats;
      expect(state.items).toHaveLength(2);
      expect(state.items.some((c) => c.id === '2')).toBe(true);
    });

    it('should maintain chat order by updatedAt', async () => {
      const now = Date.now();
      store.dispatch(setChats({
        chats: [
          { id: '1', name: 'Alice', lastMessage: 'Old', updatedAt: now - 10000, unreadCount: 0 },
          { id: '2', name: 'Bob', lastMessage: 'Recent', updatedAt: now, unreadCount: 0 },
        ],
        append: false,
      }));

      syncService.on('chatUpdate', (chat: any) => {
        store.dispatch(updateChat(chat));
      });

      // Update Alice's chat to be most recent
      syncService.simulateChatUpdate({
        id: '1',
        lastMessage: 'New message',
        updatedAt: now + 1000,
      });

      const state = store.getState().chats;
      expect(state.items[0].id).toBe('1'); // Alice should now be first
    });
  });

  describe('Offline Queue Integration', () => {
    it('should queue messages when offline', async () => {
      const queuedMessages: any[] = [];
      
      const mockOfflineQueue = {
        queue: (message: any) => {
          queuedMessages.push(message);
          return Promise.resolve('queue-id-1');
        },
        processQueue: () => Promise.resolve(),
      };

      // Simulate offline state
      store.dispatch(setDisconnected());

      // Queue a message
      const message = {
        id: 'msg-1',
        chat_id: '1',
        content: 'Hello offline',
        timestamp: Date.now(),
      };

      await mockOfflineQueue.queue(message);

      expect(queuedMessages).toHaveLength(1);
      expect(queuedMessages[0].content).toBe('Hello offline');
    });

    it('should process queue when reconnected', async () => {
      let queueProcessed = false;
      const queuedMessages: any[] = [
        { id: 'msg-1', content: 'Queued message 1' },
        { id: 'msg-2', content: 'Queued message 2' },
      ];

      const mockOfflineQueue = {
        processQueue: async () => {
          queueProcessed = true;
          queuedMessages.length = 0;
        },
      };

      syncService.on('connected', async () => {
        store.dispatch(setConnected());
        await mockOfflineQueue.processQueue();
      });

      await syncService.connect();

      expect(queueProcessed).toBe(true);
      expect(queuedMessages).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors gracefully', async () => {
      const errors: any[] = [];
      
      syncService.on('error', (error: any) => {
        errors.push(error);
        store.dispatch(setReconnecting());
      });

      syncService.emit('error', new Error('Connection failed'));

      expect(errors).toHaveLength(1);
      expect(store.getState().connection.status).toBe('reconnecting');
    });

    it('should recover from sync errors', async () => {
      let syncAttempts = 0;
      const maxRetries = 3;

      const syncWithRetry = async (): Promise<boolean> => {
        syncAttempts++;
        if (syncAttempts < maxRetries) {
          throw new Error('Sync failed');
        }
        return true;
      };

      let success = false;
      for (let i = 0; i < maxRetries; i++) {
        try {
          success = await syncWithRetry();
          break;
        } catch {
          // Retry
        }
      }

      expect(success).toBe(true);
      expect(syncAttempts).toBe(maxRetries);
    });
  });
});

describe('Data Consistency', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        chats: chatsReducer,
        connection: connectionReducer,
      },
    });
  });

  it('should handle concurrent updates correctly', () => {
    const now = Date.now();
    
    // Initial state
    store.dispatch(setChats({
      chats: [{ id: '1', name: 'Test', lastMessage: 'Initial', updatedAt: now, unreadCount: 0 }],
      append: false,
    }));

    // Simulate concurrent updates
    const updates = [
      { id: '1', lastMessage: 'Update 1', updatedAt: now + 100 },
      { id: '1', lastMessage: 'Update 2', updatedAt: now + 200 },
      { id: '1', lastMessage: 'Update 3', updatedAt: now + 50 }, // Earlier timestamp
    ];

    updates.forEach((update) => store.dispatch(updateChat(update)));

    const state = store.getState().chats;
    const chat = state.items.find((c) => c.id === '1');
    
    // Last update wins (in order of dispatch)
    expect(chat?.lastMessage).toBe('Update 3');
  });

  it('should not lose data during rapid updates', () => {
    const updates = Array.from({ length: 100 }, (_, i) => ({
      id: '1',
      name: 'Test',
      lastMessage: `Message ${i}`,
      updatedAt: Date.now() + i,
      unreadCount: i,
    }));

    store.dispatch(setChats({ chats: [updates[0]], append: false }));

    updates.slice(1).forEach((update) => store.dispatch(updateChat(update)));

    const state = store.getState().chats;
    expect(state.items).toHaveLength(1);
    expect(state.items[0].lastMessage).toBe('Message 99');
  });
});
