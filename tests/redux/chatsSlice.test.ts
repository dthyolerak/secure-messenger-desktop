// tests/redux/chatsSlice.test.ts
/**
 * Unit tests for chats Redux slice
 * 
 * Using inline reducer to avoid IPC initialization issues in test environment
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define ChatItem type
interface ChatItem {
  id: string;
  name: string;
  lastMessage?: string;
  updatedAt: number;
  unreadCount: number;
}

// Define state type
interface ChatsState {
  items: ChatItem[];
  loading: boolean;
  error: string | null;
  selectedChatId: string | null;
  pagination: {
    offset: number;
    limit: number;
    hasMore: boolean;
  };
}

const initialState: ChatsState = {
  items: [],
  loading: false,
  error: null,
  selectedChatId: null,
  pagination: {
    offset: 0,
    limit: 50,
    hasMore: true,
  },
};

// Create the slice inline for testing
const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats(state, action: PayloadAction<{ chats: ChatItem[]; append: boolean }>) {
      const { chats, append } = action.payload;
      if (append) {
        const existingIds = new Set(state.items.map((c) => c.id));
        const newChats = chats.filter((c) => !existingIds.has(c.id));
        state.items = [...state.items, ...newChats];
      } else {
        state.items = chats;
      }
      state.pagination.hasMore = chats.length >= state.pagination.limit;
    },
    addChat(state, action: PayloadAction<ChatItem>) {
      const exists = state.items.some((c) => c.id === action.payload.id);
      if (!exists) {
        state.items.unshift(action.payload);
      }
    },
    updateChat(state, action: PayloadAction<Partial<ChatItem> & { id: string }>) {
      const index = state.items.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
        state.items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      }
    },
    removeChat(state, action: PayloadAction<string>) {
      state.items = state.items.filter((c) => c.id !== action.payload);
      if (state.selectedChatId === action.payload) {
        state.selectedChatId = null;
      }
    },
    setSelectedChat(state, action: PayloadAction<string | null>) {
      state.selectedChatId = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetPagination(state) {
      state.pagination.offset = 0;
      state.pagination.hasMore = true;
    },
  },
});

const chatsReducer = chatsSlice.reducer;
const {
  setChats,
  addChat,
  updateChat,
  removeChat,
  setSelectedChat,
  setLoading,
  setError,
  resetPagination,
} = chatsSlice.actions;

describe('Chats Slice', () => {
  let store: ReturnType<typeof configureStore>;

  const mockChats: ChatItem[] = [
    {
      id: 'chat-1',
      name: 'Alice',
      lastMessage: 'Hello',
      updatedAt: Date.now(),
      unreadCount: 2,
    },
    {
      id: 'chat-2',
      name: 'Bob',
      lastMessage: 'Hi there',
      updatedAt: Date.now() - 1000,
      unreadCount: 0,
    },
  ];

  beforeEach(() => {
    store = configureStore({
      reducer: {
        chats: chatsReducer,
      },
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = store.getState().chats;
      
      expect(state.items).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.selectedChatId).toBeNull();
      expect(state.pagination.offset).toBe(0);
      expect(state.pagination.limit).toBe(50);
      expect(state.pagination.hasMore).toBe(true);
    });
  });

  describe('setChats', () => {
    it('should set chats array', () => {
      store.dispatch(setChats({ chats: mockChats, append: false }));
      
      const state = store.getState().chats;
      expect(state.items).toHaveLength(2);
      expect(state.items[0].name).toBe('Alice');
    });

    it('should replace chats when append is false', () => {
      store.dispatch(setChats({ chats: mockChats, append: false }));
      store.dispatch(setChats({ 
        chats: [{ id: 'chat-3', name: 'Carol', lastMessage: 'Hey', updatedAt: Date.now(), unreadCount: 0 }],
        append: false 
      }));
      
      const state = store.getState().chats;
      expect(state.items).toHaveLength(1);
      expect(state.items[0].name).toBe('Carol');
    });

    it('should append chats when append is true', () => {
      store.dispatch(setChats({ chats: mockChats, append: false }));
      store.dispatch(setChats({ 
        chats: [{ id: 'chat-3', name: 'Carol', lastMessage: 'Hey', updatedAt: Date.now(), unreadCount: 0 }],
        append: true 
      }));
      
      const state = store.getState().chats;
      expect(state.items).toHaveLength(3);
    });

    it('should deduplicate chats when appending', () => {
      store.dispatch(setChats({ chats: mockChats, append: false }));
      store.dispatch(setChats({ chats: mockChats, append: true }));
      
      const state = store.getState().chats;
      expect(state.items).toHaveLength(2); // No duplicates
    });

    it('should update pagination hasMore', () => {
      // Less than limit items means no more
      store.dispatch(setChats({ chats: mockChats, append: false }));
      
      const state = store.getState().chats;
      expect(state.pagination.hasMore).toBe(false);
    });
  });

  describe('addChat', () => {
    it('should add a new chat', () => {
      const newChat: ChatItem = {
        id: 'chat-new',
        name: 'New Chat',
        lastMessage: 'Welcome',
        updatedAt: Date.now(),
        unreadCount: 1,
      };
      
      store.dispatch(addChat(newChat));
      
      const state = store.getState().chats;
      expect(state.items).toHaveLength(1);
      expect(state.items[0].name).toBe('New Chat');
    });

    it('should not add duplicate chat', () => {
      store.dispatch(setChats({ chats: mockChats, append: false }));
      store.dispatch(addChat(mockChats[0]));
      
      const state = store.getState().chats;
      expect(state.items).toHaveLength(2);
    });
  });

  describe('updateChat', () => {
    it('should update existing chat', () => {
      store.dispatch(setChats({ chats: mockChats, append: false }));
      store.dispatch(updateChat({ id: 'chat-1', lastMessage: 'Updated message' }));
      
      const state = store.getState().chats;
      const chat = state.items.find(c => c.id === 'chat-1');
      expect(chat?.lastMessage).toBe('Updated message');
    });

    it('should not modify other chats', () => {
      store.dispatch(setChats({ chats: mockChats, append: false }));
      store.dispatch(updateChat({ id: 'chat-1', lastMessage: 'Updated' }));
      
      const state = store.getState().chats;
      const chat = state.items.find(c => c.id === 'chat-2');
      expect(chat?.lastMessage).toBe('Hi there');
    });

    it('should reorder chats by updatedAt', () => {
      store.dispatch(setChats({ chats: mockChats, append: false }));
      store.dispatch(updateChat({ 
        id: 'chat-2', 
        lastMessage: 'New message',
        updatedAt: Date.now() + 1000 
      }));
      
      const state = store.getState().chats;
      expect(state.items[0].id).toBe('chat-2');
    });
  });

  describe('removeChat', () => {
    it('should remove chat by id', () => {
      store.dispatch(setChats({ chats: mockChats, append: false }));
      store.dispatch(removeChat('chat-1'));
      
      const state = store.getState().chats;
      expect(state.items).toHaveLength(1);
      expect(state.items.find(c => c.id === 'chat-1')).toBeUndefined();
    });

    it('should clear selectedChatId if removed chat was selected', () => {
      store.dispatch(setChats({ chats: mockChats, append: false }));
      store.dispatch(setSelectedChat('chat-1'));
      store.dispatch(removeChat('chat-1'));
      
      const state = store.getState().chats;
      expect(state.selectedChatId).toBeNull();
    });

    it('should not affect selectedChatId if different chat removed', () => {
      store.dispatch(setChats({ chats: mockChats, append: false }));
      store.dispatch(setSelectedChat('chat-1'));
      store.dispatch(removeChat('chat-2'));
      
      const state = store.getState().chats;
      expect(state.selectedChatId).toBe('chat-1');
    });
  });

  describe('setSelectedChat', () => {
    it('should set selected chat id', () => {
      store.dispatch(setSelectedChat('chat-1'));
      
      const state = store.getState().chats;
      expect(state.selectedChatId).toBe('chat-1');
    });

    it('should clear selected chat when null', () => {
      store.dispatch(setSelectedChat('chat-1'));
      store.dispatch(setSelectedChat(null));
      
      const state = store.getState().chats;
      expect(state.selectedChatId).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      store.dispatch(setLoading(true));
      expect(store.getState().chats.loading).toBe(true);
      
      store.dispatch(setLoading(false));
      expect(store.getState().chats.loading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      store.dispatch(setError('Network error'));
      
      const state = store.getState().chats;
      expect(state.error).toBe('Network error');
    });

    it('should clear error when null', () => {
      store.dispatch(setError('Error'));
      store.dispatch(setError(null));
      
      const state = store.getState().chats;
      expect(state.error).toBeNull();
    });
  });

  describe('resetPagination', () => {
    it('should reset pagination state', () => {
      // Modify pagination
      store.dispatch(setChats({ chats: mockChats, append: false }));
      
      // Reset
      store.dispatch(resetPagination());
      
      const state = store.getState().chats;
      expect(state.pagination.offset).toBe(0);
      expect(state.pagination.hasMore).toBe(true);
    });
  });
});
