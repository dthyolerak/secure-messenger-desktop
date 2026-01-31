// src/domains/messages/messages.types.ts
export interface Message {
  id: string;
  chat_id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: number;
  read_at?: number | null;
  is_edited?: boolean;
}

export interface InsertMessagePayload {
  chat_id: string;
  sender: string;
  recipient: string;
  content: string;
}

export interface MessageItem {
  id: string;
  chatId: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: number;
  read_at?: number | null;
  is_read?: boolean;
  is_edited?: boolean;
  isOwn?: boolean;
  type?: 'text' | 'image' | 'file';
  file_path?: string;
  file_name?: string;
  file_size?: number;
}

export const MESSAGES_IPC_CHANNELS = {
  INSERT_MESSAGE: 'smd:messages:insert',
  LIST_MESSAGES: 'smd:messages:list',
} as const;
