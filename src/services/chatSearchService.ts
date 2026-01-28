// src/services/chatSearchService.ts
import type { ChatItem } from '../app/slices/chatsSlice';

export interface ChatSearchResult {
  chats: ChatItem[];
  total: number;
}

export async function searchChats(query: string): Promise<ChatSearchResult> {
  if (!query.trim()) {
    // Return all chats if query is empty
    try {
      const results = await window.secureMessenger?.sync?.getChats?.();
      if (results?.success) {
        return { 
          chats: results.data.chats.map((chat: any) => ({
            id: chat.id,
            name: chat.name,
            lastMessage: chat.last_message,
            updatedAt: chat.updated_at,
            unreadCount: chat.unread_count,
          })), 
          total: results.data.total 
        };
      }
    } catch {
      // Fallback: ignore
    }
    return { chats: [], total: 0 };
  }

  // Search through chats using the new sync API
  try {
    const results = await window.secureMessenger?.sync?.getChats?.();
    if (results?.success) {
      const allChats = results.data.chats.map((chat: any) => ({
        id: chat.id,
        name: chat.name,
        lastMessage: chat.last_message,
        updatedAt: chat.updated_at,
        unreadCount: chat.unread_count,
      }));
      
      // Filter chats by query (client-side search for now)
      const filteredChats = allChats.filter((chat: ChatItem) =>
        chat.name.toLowerCase().includes(query.toLowerCase()) ||
        (chat.lastMessage && chat.lastMessage.toLowerCase().includes(query.toLowerCase()))
      );
      
      return { chats: filteredChats, total: filteredChats.length };
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
