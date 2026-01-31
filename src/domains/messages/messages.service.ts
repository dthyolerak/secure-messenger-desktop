// src/domains/messages/messages.service.ts
import type { Message, InsertMessagePayload } from './messages.types';

// Placeholder: In a real app, these would call SQLite via the main process
export async function insertMessage(payload: InsertMessagePayload): Promise<Message> {
  // Simulate async insert
  const now = Date.now();
  const message: Message = {
    id: `msg_${now}_${Math.random().toString(36).substr(2, 9)}`,
    chat_id: payload.chat_id,
    sender: payload.sender,
    recipient: payload.recipient,
    content: payload.content,
    timestamp: now,
    read_at: now,
    is_edited: false,
  };
  // TODO: IPC call to main process for SQLite insert
  return message;
}

export async function listMessages(chatId: string): Promise<Message[]> {
  // TODO: IPC call to main process for SQLite query
  return [];
}
