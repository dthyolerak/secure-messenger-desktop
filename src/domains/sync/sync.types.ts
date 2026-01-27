// src/domains/sync/sync.types.ts
export interface TypingEvent {
  chatId: string;
  username: string;
  type: 'start' | 'stop';
  timestamp: number;
}

export interface PresenceEvent {
  username: string;
  status: 'online' | 'offline';
  timestamp: number;
}

export const SYNC_IPC_CHANNELS = {
  TYPING_EVENT: 'smd:sync:typing',
  PRESENCE_EVENT: 'smd:sync:presence',
  SEARCH_CHATS: 'smd:sync:searchChats',
} as const;
