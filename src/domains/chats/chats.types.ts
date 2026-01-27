// src/domains/chats/chats.types.ts
export interface Chat {
  id: string;
  name: string;
  last_message?: string;
  updated_at: number;
  unread_count?: number;
}

export interface GetChatsRequest {
  offset: number;
  limit: number;
}

export interface GetChatsResponse {
  chats: Chat[];
  total: number;
  hasMore: boolean;
}

export const CHATS_IPC_CHANNELS = {
  GET_CHATS: 'chats:getChats',
} as const;
