// src/app/slices/chatsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { syncIpcClient } from '../../services/syncIpcClient';
import type { Chat } from '../../domains/chats/chats.types';

export interface ChatItem {
  id: string;
  name: string;
  lastMessage?: string;
  updatedAt: number;
  unreadCount: number; // Make required, default to 0
}

interface ChatsState {
  items: ChatItem[];
  selectedChatId: string | null;
  loading: boolean;
  error: string | null;
  pagination: {
    offset: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

const initialState: ChatsState = {
  items: [],
  selectedChatId: null,
  loading: false,
  error: null,
  pagination: {
    offset: 0,
    limit: 50,
    total: 0,
    hasMore: true,
  },
};

/**
 * Async thunk to fetch chats with pagination.
 * Handles incremental loading and deduplication.
 */
export const fetchChats = createAsyncThunk(
  'chats/fetchChats',
  async ({ offset = 0, limit = 50 }: { offset?: number; limit?: number } = {}) => {
    try {
      const response = await syncIpcClient.getChats();
      
      if (!response || !response.data || !response.data.chats) {
        throw new Error('Invalid response format: missing data or chats');
      }
      
      // Transform Chat to ChatItem format
      const chatItems: ChatItem[] = response.data.chats.map((chat: Chat) => ({
        id: chat.id,
        name: chat.name,
        lastMessage: chat.last_message,
        updatedAt: chat.updated_at,
        unreadCount: chat.unread_count || 0, // Ensure default value
      }));

      return {
        chats: chatItems,
        total: response.data.total || 0,
        hasMore: response.data.hasMore || false,
        offset,
      };
    } catch (error) {
      console.error('Failed to fetch chats:', error);
      throw error;
    }
  }
);

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    selectChat(state, action: PayloadAction<string | null>) {
      state.selectedChatId = action.payload;
    },
    setChats(state, action: PayloadAction<ChatItem[]>) {
      state.items = action.payload;
    },
    addOrUpdateChat(state, action: PayloadAction<ChatItem>) {
      const existingIndex = state.items.findIndex((c) => c.id === action.payload.id);
      if (existingIndex !== -1) {
        // Update existing chat
        state.items[existingIndex] = { ...state.items[existingIndex], ...action.payload };
        
        // Move chat to top if it has new activity (updated_at changed)
        const currentChat = state.items[existingIndex];
        const topChat = state.items[0];
        if (currentChat && topChat && currentChat.updatedAt > topChat.updatedAt) {
          // Remove from current position and add to top
          state.items.splice(existingIndex, 1);
          state.items.unshift(currentChat);
        }
      } else {
        // Add new chat at top
        state.items.unshift(action.payload);
      }
    },
    resetPagination(state) {
      state.pagination = {
        offset: 0,
        limit: 50,
        total: 0,
        hasMore: true,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state, action) => {
        // Only show loading for initial fetch
        if (action.meta.arg.offset === 0) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        const { chats, total, hasMore, offset } = action.payload;
        
        if (offset === 0) {
          // Initial fetch - replace all items
          state.items = chats;
        } else {
          // Incremental load - append and deduplicate
          const existingIds = new Set(state.items.map(c => c.id));
          const newChats = chats.filter(c => !existingIds.has(c.id));
          state.items.push(...newChats);
        }
        
        state.pagination = {
          offset: offset + chats.length,
          limit: 50,
          total,
          hasMore,
        };
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch chats';
      });
  },
});

export const { selectChat, setChats, addOrUpdateChat, resetPagination } = chatsSlice.actions;
export default chatsSlice.reducer;
