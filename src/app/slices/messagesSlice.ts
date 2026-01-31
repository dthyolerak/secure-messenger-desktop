// src/app/slices/messagesSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { insertMessage } from '../../services/messagesIpcClient';
import type { InsertMessagePayload, MessageItem } from '../../domains/messages/messages.types';



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



export const sendMessage = createAsyncThunk<
  MessageItem,
  { chatId: string; content: string; sender: string; recipient: string },
  { rejectValue: string }
>(
  'messages/sendMessage',
  async ({ chatId, content, sender, recipient }, { rejectWithValue }) => {
    try {
      const payload: InsertMessagePayload = { chat_id: chatId, sender, recipient, content };
      const message = await insertMessage(payload);
      const readAt = message.read_at ?? (sender === message.sender ? message.timestamp : null);

      // Map to MessageItem format
      return {
        id: message.id,
        chatId: message.chat_id,
        sender: message.sender,
        recipient: message.recipient,
        content: message.content,
        timestamp: message.timestamp,
        read_at: readAt,
        is_read: readAt !== null && readAt !== undefined,
        is_edited: message.is_edited,
        isOwn: sender === message.sender,
      };
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Failed to send message');
    }
  },
);



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

  extraReducers: (builder) => {

    builder

      .addCase(sendMessage.pending, (state) => {

        state.loading = true;

        state.error = null;

      })

      .addCase(sendMessage.fulfilled, (state, action) => {

        state.loading = false;

        const { chatId } = action.payload;

        if (!state.byChatId[chatId]) {

          state.byChatId[chatId] = [];

        }

        state.byChatId[chatId]!.push(action.payload);

      })

      .addCase(sendMessage.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload ?? 'Failed to send message';

      });

  },

});



export const { setMessagesForChat, addMessage } = messagesSlice.actions;

export default messagesSlice.reducer;

