// src/domains/messages/messages.service.ts
import type { Message, InsertMessagePayload } from './messages.types';

// Placeholder: In a real app, these would call SQLite via the main process
export async function insertMessage(payload: InsertMessagePayload): Promise<Message> {
  // Simulate async insert
  const message: Message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    chat_id: payload.chat_id,
    sender: payload.sender,
    content: payload.content,
    timestamp: Date.now(),
  };
  // TODO: IPC call to main process for SQLite insert
  return message;
}

export async function listMessages(chatId: string): Promise<Message[]> {
  // TODO: IPC call to main process for SQLite query
  return [];
}
