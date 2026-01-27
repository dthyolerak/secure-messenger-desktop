// src/app/slices/chatsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatItem {
  id: string;
  name: string;
  lastMessage?: string;
  updatedAt: number;
  unreadCount?: number;
}

interface ChatsState {
  items: ChatItem[];
  selectedChatId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatsState = {
  items: [],
  selectedChatId: null,
  loading: false,
  error: null,
};

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
      const existing = state.items.find((c) => c.id === action.payload.id);
      if (existing) {
        Object.assign(existing, action.payload);
      } else {
        state.items.push(action.payload);
      }
    },
  },
});

export const { selectChat, setChats, addOrUpdateChat } = chatsSlice.actions;
export default chatsSlice.reducer;
