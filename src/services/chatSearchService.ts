// src/services/chatSearchService.ts
import type { ChatItem } from '../app/slices/chatsSlice';
import { syncIpcClient } from './syncIpcClient';

export interface ChatSearchResult {
  chats: ChatItem[];
  total: number;
}

export async function searchChats(query: string): Promise<ChatSearchResult> {
  try {
    const { chats, total } = await syncIpcClient.searchChats(query);
    return { chats, total };
  } catch {
    // Fallback: ignore
  }

  // Placeholder: return empty
  return { chats: [], total: 0 };
}

// Highlight matching text in a string
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
