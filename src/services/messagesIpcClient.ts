// src/services/messagesIpcClient.ts
import type { InsertMessagePayload, Message } from '../domains/messages/messages.types';

export async function insertMessage(payload: InsertMessagePayload): Promise<Message> {
  if (!window.secureMessenger?.messages) {
    throw new Error('Messages API not available');
  }
  return window.secureMessenger.messages.insertMessage(payload);
}

export async function listMessages(chatId: string): Promise<Message[]> {
  if (!window.secureMessenger?.messages) {
    throw new Error('Messages API not available');
  }
  return window.secureMessenger.messages.listMessages(chatId);
}
