// src/domains/sync/sync.ipc.ts
import { ipcMain } from 'electron';
import { z } from 'zod';
import type { TypingEvent, PresenceEvent } from './sync.types';
import { SYNC_IPC_CHANNELS } from './sync.types';
import { addTypingUser, removeTypingUser, getTypingUsers } from './sync.service';

const TypingEventSchema = z.object({
  chatId: z.string(),
  username: z.string(),
  type: z.enum(['start', 'stop']),
  timestamp: z.number(),
});

const PresenceEventSchema = z.object({
  username: z.string(),
  status: z.enum(['online', 'offline']),
  timestamp: z.number(),
});

const SearchChatsSchema = z.object({
  query: z.string(),
});

export function registerSyncIpc() {
  ipcMain.handle(SYNC_IPC_CHANNELS.TYPING_EVENT, async (_event, raw) => {
    const parsed = TypingEventSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error('Invalid typing event payload');
    }
    const { chatId, username, type } = parsed.data;
    if (type === 'start') {
      addTypingUser(chatId, username);
    } else {
      removeTypingUser(chatId, username);
    }
    // Broadcast to other clients would happen here via WebSocket
    return { success: true };
  });

  ipcMain.handle(SYNC_IPC_CHANNELS.PRESENCE_EVENT, async (_event, raw) => {
    const parsed = PresenceEventSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error('Invalid presence event payload');
    }
    // Broadcast presence via WebSocket
    return { success: true };
  });

  ipcMain.handle(SYNC_IPC_CHANNELS.SEARCH_CHATS, async (_event, raw) => {
    const parsed = SearchChatsSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error('Invalid searchChats payload');
    }
    // TODO: SQLite query for chat search
    return { chats: [], total: 0 };
  });
}
