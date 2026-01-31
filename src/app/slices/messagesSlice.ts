// src/app/slices/messagesSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { syncIpcClient } from '../../services/syncIpcClient';
import type { MessageAttachmentPayload, MessageItem } from '../../domains/messages/messages.types';



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
  { chatId: string; content: string; sender: string; recipient: string; attachment?: MessageAttachmentPayload },
  { rejectValue: string }
>(
  'messages/sendMessage',
  async ({ chatId, content, sender, recipient, attachment }, { rejectWithValue }) => {
    try {
      const response = await syncIpcClient.sendMessage(chatId, content, sender, recipient, attachment);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to send message');
      }

      const message = response.data as any;
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
        is_edited: Boolean(message.is_edited),
        isOwn: sender === message.sender,
        type: message.type,
        file_path: message.file_path ?? null,
        file_name: message.file_name ?? null,
        file_size: message.file_size ?? null,
        mime_type: message.mime_type ?? null,
        reactions: message.reactions ?? [],
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

