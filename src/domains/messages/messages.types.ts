// src/domains/messages/messages.types.ts
export interface MessageReaction {
  emoji: string;
  count: number;
  reactedByCurrentUser: boolean;
}

export interface MessageAttachmentPayload {
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  type: 'image' | 'file';
}

export interface AttachmentUploadProgress {
  messageId: string;
  progress: number;
}

export interface Message {
  id: string;
  chat_id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: number;
  read_at?: number | null;
  is_edited?: boolean;
  type?: 'text' | 'image' | 'file';
  file_path?: string | null;
  file_name?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  reactions?: MessageReaction[];
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
  file_path?: string | null;
  file_name?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  reactions?: MessageReaction[];
}

export interface MessageSearchResult extends Message {
  chat_name: string;
}

export const MESSAGES_IPC_CHANNELS = {
  INSERT_MESSAGE: 'smd:messages:insert',
  LIST_MESSAGES: 'smd:messages:list',
} as const;
