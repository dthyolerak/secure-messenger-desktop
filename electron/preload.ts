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
    const MessageSchema = z.object({
      id: z.string(),
      chat_id: z.string(),
      sender: z.string(),
      content: z.string(),
      timestamp: z.number(),
    });
    return MessageSchema.parse(raw);
  },

  async listMessages(chatId: string): Promise<Message[]> {
    const raw = await ipcRenderer.invoke(MESSAGES_IPC_CHANNELS.LIST_MESSAGES, { chat_id: chatId });
    const MessageArraySchema = z.array(z.object({
      id: z.string(),
      chat_id: z.string(),
      sender: z.string(),
      content: z.string(),
      timestamp: z.number(),
    }));
    return MessageArraySchema.parse(raw);
  },
};

const syncApi = {
  async sendTypingEvent(event: TypingEvent): Promise<{ success: boolean }> {
    const raw = await ipcRenderer.invoke(SYNC_IPC_CHANNELS.TYPING_EVENT, event);
    return z.object({ success: z.boolean() }).parse(raw);
  },

  async sendPresenceEvent(event: PresenceEvent): Promise<{ success: boolean }> {
    const raw = await ipcRenderer.invoke(SYNC_IPC_CHANNELS.PRESENCE_EVENT, event);
    return z.object({ success: z.boolean() }).parse(raw);
  },

  async searchChats(query: string): Promise<{ chats: any[]; total: number }> {
    const raw = await ipcRenderer.invoke(SYNC_IPC_CHANNELS.SEARCH_CHATS, { query });
    return z.object({ chats: z.array(z.any()), total: z.number() }).parse(raw);
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
          unread_count: z.number().optional(),
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

export interface SecureMessengerApi {
  auth: AuthApi;
  messages: MessagesApi;
  sync: SyncApi;
  chats: ChatsApi;
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
} satisfies SecureMessengerApi);