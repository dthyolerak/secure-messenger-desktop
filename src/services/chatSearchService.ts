// src/services/chatSearchService.ts
import type { ChatListItem } from '../components/ChatList';

export interface ChatSearchResult {
  chats: ChatListItem[];
  total: number;
}

export async function searchChats(query: string): Promise<ChatSearchResult> {
  if (!query.trim()) {
    // Return all chats if query is empty
    // In a real app, this would call IPC to SQLite
    return { chats: [], total: 0 };
  }

  // Debounced search via IPC
  try {
    const results = await window.secureMessenger?.sync?.searchChats?.(query);
    if (results) {
      return results;
    }
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
