// src/domains/messages/messages.types.ts
export interface Message {
  id: string;
  chat_id: string;
  sender: string;
  content: string;
  timestamp: number;
}

export interface InsertMessagePayload {
  chat_id: string;
  sender: string;
  content: string;
}

export const MESSAGES_IPC_CHANNELS = {
  INSERT_MESSAGE: 'smd:messages:insert',
  LIST_MESSAGES: 'smd:messages:list',
} as const;
