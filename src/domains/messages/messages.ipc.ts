// src/domains/messages/messages.ipc.ts
import { ipcMain } from 'electron';
import { z } from 'zod';
import type { InsertMessagePayload, Message } from './messages.types';
import { MESSAGES_IPC_CHANNELS } from './messages.types';
import { insertMessage, listMessages } from './messages.service';

const InsertMessageSchema = z.object({
  chat_id: z.string(),
  sender: z.string(),
  recipient: z.string(),
  content: z.string().min(1),
});

const ListMessagesSchema = z.object({
  chat_id: z.string(),
});

export function registerMessageIpc() {
  ipcMain.handle(MESSAGES_IPC_CHANNELS.INSERT_MESSAGE, async (_event, raw) => {
    const parsed = InsertMessageSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error('Invalid insertMessage payload');
    }
    return await insertMessage(parsed.data);
  });

  ipcMain.handle(MESSAGES_IPC_CHANNELS.LIST_MESSAGES, async (_event, raw) => {
    const parsed = ListMessagesSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error('Invalid listMessages payload');
    }
    return await listMessages(parsed.data.chat_id);
  });
}
