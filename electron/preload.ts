// electron/preload.ts

import { contextBridge, ipcRenderer } from 'electron';

import {

  AUTH_IPC_CHANNELS,

  type AuthSession,

  type StartSessionPayload,

} from '../src/domains/auth/auth.types';

import {

  GetSessionResponseSchema,

  StartSessionInputSchema,

  StartSessionResponseSchema,

} from '../src/domains/auth/auth.schema';

import {

  MESSAGES_IPC_CHANNELS,

  type InsertMessagePayload,

  type Message,

} from '../src/domains/messages/messages.types';

import {

  SYNC_IPC_CHANNELS,

  type TypingEvent,

  type PresenceEvent,

} from '../src/domains/sync/sync.types';

import {

  CHATS_IPC_CHANNELS,

  type GetChatsRequest,

  type GetChatsResponse,

} from '../src/domains/chats/chats.types';

import { IPC_EVENTS } from './ipc/events';

import { z } from 'zod';



const authApi = {

  async getSession(): Promise<AuthSession | null> {

    const raw = await ipcRenderer.invoke(AUTH_IPC_CHANNELS.getSession);

    const parsed = GetSessionResponseSchema.parse(raw);

    return parsed.session;

  },



  async startSession(payload: StartSessionPayload): Promise<AuthSession> {

    const input = StartSessionInputSchema.parse(payload);

    const raw = await ipcRenderer.invoke(

      AUTH_IPC_CHANNELS.startSession,

      input,

    );

    const parsed = StartSessionResponseSchema.parse(raw);

    return parsed.session;

  },

};



const messagesApi = {

  async insertMessage(payload: InsertMessagePayload): Promise<Message> {

    const raw = await ipcRenderer.invoke(MESSAGES_IPC_CHANNELS.INSERT_MESSAGE, payload);

    return raw;

  },



  async listMessages(chatId: string): Promise<Message[]> {

    const raw = await ipcRenderer.invoke(MESSAGES_IPC_CHANNELS.LIST_MESSAGES, { chat_id: chatId });

    const isEditedSchema = z
      .union([z.boolean(), z.number()])
      .transform((value) => (typeof value === 'number' ? value === 1 : value));

    const MessageArraySchema = z.array(z.object({

      id: z.string(),

      chat_id: z.string(),

      sender: z.string(),

      recipient: z.string(),

      content: z.string(),

      timestamp: z.number(),

      read_at: z.number().nullable().optional(),

      is_edited: isEditedSchema.optional(),

    }));

    return MessageArraySchema.parse(raw);

  },

};



const syncApi = {

  // Connection status

  async getConnectionStatus() {

    return await ipcRenderer.invoke(IPC_EVENTS.GET_CONNECTION_STATUS);

  },



  // Messages

  async getMessages(chatId: string, limit?: number, offset?: number, currentUser?: string) {

    return await ipcRenderer.invoke(IPC_EVENTS.GET_MESSAGES, { chatId, limit, offset, currentUser });

  },



  async sendMessage(chatId: string, content: string, sender: string, recipient: string) {

    return await ipcRenderer.invoke(IPC_EVENTS.SEND_MESSAGE, { chatId, content, sender, recipient });

  },



  async markMessagesRead(chatId: string, currentUser?: string) {

    return await ipcRenderer.invoke(IPC_EVENTS.MARK_MESSAGES_READ, { chatId, currentUser });

  },



  // Chats

  async getChats() {

    return await ipcRenderer.invoke(IPC_EVENTS.GET_CHATS);

  },



  // Users (mock implementation for now)

  users: {

    async searchUsers(query: string, currentUserId: string) {

      // Mock search users functionality

      return {

        success: true,

        users: [],

        error: undefined

      };

    },

    async getAllUsers(currentUserId: string) {

      // Mock get all users functionality

      return {

        success: true,

        users: [],

        error: undefined

      };

    },

    async upsertUser(email: string, displayName: string, username: string) {

      // Mock upsert user functionality

      return {

        success: true,

        users: [{ id: username, email, displayName, username }],

        error: undefined

      };

    }

  },



  // Event listeners

  onConnectionStatus(callback: (status: any) => void) {

    ipcRenderer.on(IPC_EVENTS.CONNECTION_STATUS, (_, status) => callback(status));

  },



  onConnectionConnected(callback: () => void) {

    ipcRenderer.on(IPC_EVENTS.CONNECTION_CONNECTED, callback);

  },



  onConnectionDisconnected(callback: () => void) {

    ipcRenderer.on(IPC_EVENTS.CONNECTION_DISCONNECTED, callback);

  },



  onMessageInserted(callback: (message: any) => void) {

    ipcRenderer.on(IPC_EVENTS.MESSAGE_INSERTED, (_, message) => callback(message));

  },



  onMessageUpdated(callback: (data: { messageId: string; content: string }) => void) {

    ipcRenderer.on(IPC_EVENTS.MESSAGE_UPDATED, (_, data) => callback(data));

  },



  onMessageDeleted(callback: (data: { messageId: string }) => void) {

    ipcRenderer.on(IPC_EVENTS.MESSAGE_DELETED, (_, data) => callback(data));

  },



  onChatUpdated(callback: (chat: any) => void) {

    ipcRenderer.on(IPC_EVENTS.CHAT_UPDATED, (_, chat) => callback(chat));

  },



  onChatListUpdated(callback: () => void) {

    ipcRenderer.on(IPC_EVENTS.CHAT_LIST_UPDATED, callback);

  },



  // Cleanup listeners

  removeAllListeners() {

    ipcRenderer.removeAllListeners(IPC_EVENTS.CONNECTION_STATUS);

    ipcRenderer.removeAllListeners(IPC_EVENTS.CONNECTION_CONNECTED);

    ipcRenderer.removeAllListeners(IPC_EVENTS.CONNECTION_DISCONNECTED);

    ipcRenderer.removeAllListeners(IPC_EVENTS.MESSAGE_INSERTED);

    ipcRenderer.removeAllListeners(IPC_EVENTS.MESSAGE_UPDATED);

    ipcRenderer.removeAllListeners(IPC_EVENTS.MESSAGE_DELETED);

    ipcRenderer.removeAllListeners(IPC_EVENTS.CHAT_UPDATED);

    ipcRenderer.removeAllListeners(IPC_EVENTS.CHAT_LIST_UPDATED);

  },

};



const chatsApi = {

  async getChats(request: GetChatsRequest): Promise<GetChatsResponse> {

    const raw = await ipcRenderer.invoke(CHATS_IPC_CHANNELS.GET_CHATS, request);

    const responseSchema = z.object({

      success: z.boolean(),

      data: z.object({

        chats: z.array(z.object({

          id: z.string(),

          name: z.string(),

          last_message: z.string().optional(),

          updated_at: z.number(),

          unread_count: z.number(), // Make required

        })),

        total: z.number(),

        hasMore: z.boolean(),

      }),

      error: z.string().optional(),

    });

    const parsed = responseSchema.parse(raw);

    

    if (!parsed.success) {

      throw new Error(parsed.error || 'Failed to fetch chats');

    }

    

    return parsed.data;

  },

};



export type AuthApi = typeof authApi;

export type MessagesApi = typeof messagesApi;

export type SyncApi = typeof syncApi;

export type ChatsApi = typeof chatsApi;

export type UsersApi = typeof syncApi.users;



export interface SecureMessengerApi {

  auth: AuthApi;

  messages: MessagesApi;

  sync: SyncApi;

  chats: ChatsApi;

  users: UsersApi;

}



declare global {

  interface Window {

    secureMessenger: SecureMessengerApi;

  }

}



contextBridge.exposeInMainWorld('secureMessenger', {

  auth: authApi,

  messages: messagesApi,

  sync: syncApi,

  chats: chatsApi,

  users: syncApi.users,

} satisfies SecureMessengerApi);