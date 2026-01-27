// src/app/slices/messagesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MessageItem {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  timestamp: number;
  isOwn?: boolean;
}

interface MessagesState {
  byChatId: Record<string, MessageItem[]>;
  loading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  byChatId: {},
  loading: false,
  error: null,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessagesForChat(
      state,
      action: PayloadAction<{ chatId: string; messages: MessageItem[] }>,
    ) {
      const { chatId, messages } = action.payload;
      state.byChatId[chatId] = messages;
    },
    addMessage(state, action: PayloadAction<MessageItem>) {
      const { chatId } = action.payload;
      if (!state.byChatId[chatId]) {
        state.byChatId[chatId] = [];
      }
      state.byChatId[chatId]!.push(action.payload);
    },
  },
});

export const { setMessagesForChat, addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
