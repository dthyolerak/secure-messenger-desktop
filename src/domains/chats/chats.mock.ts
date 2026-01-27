// src/domains/chats/chats.mock.ts
import type { Chat, GetChatsRequest, GetChatsResponse } from './chats.types';

// Mock data for development without SQLite
const mockChats: Chat[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    last_message: 'Hey, are you free later?',
    updated_at: Date.now() - 1000 * 60,
    unread_count: 2,
  },
  {
    id: '2',
    name: 'Bob Smith',
    last_message: 'Thanks for the help!',
    updated_at: Date.now() - 1000 * 60 * 5,
    unread_count: 0,
  },
  {
    id: '3',
    name: 'Team Chat',
    last_message: 'Meeting at 3pm',
    updated_at: Date.now() - 1000 * 60 * 15,
    unread_count: 5,
  },
  {
    id: '4',
    name: 'Carol White',
    last_message: 'Can you review this?',
    updated_at: Date.now() - 1000 * 60 * 30,
    unread_count: 1,
  },
  {
    id: '5',
    name: 'David Brown',
    last_message: 'Great work on the project',
    updated_at: Date.now() - 1000 * 60 * 60,
    unread_count: 0,
  },
];

// Mock messages for each chat
export const mockMessages: Record<string, Array<{
  id: string;
  chat_id: string;
  sender: string;
  content: string;
  timestamp: number;
  is_read: boolean;
  is_edited: boolean;
}>> = {
  '1': [
    {
      id: 'm1',
      chat_id: '1',
      sender: 'Alice Johnson',
      content: 'Hey, are you free later?',
      timestamp: Date.now() - 1000 * 60 * 10,
      is_read: false,
      is_edited: false,
    },
    {
      id: 'm2',
      chat_id: '1',
      sender: 'You',
      content: 'Sure, what\'s up?',
      timestamp: Date.now() - 1000 * 60 * 8,
      is_read: true,
      is_edited: false,
    },
    {
      id: 'm3',
      chat_id: '1',
      sender: 'Alice Johnson',
      content: 'Want to grab coffee?',
      timestamp: Date.now() - 1000 * 60 * 5,
      is_read: false,
      is_edited: false,
    },
    {
      id: 'm4',
      chat_id: '1',
      sender: 'Alice Johnson',
      content: 'Hey, are you free later?',
      timestamp: Date.now() - 1000 * 60,
      is_read: false,
      is_edited: false,
    },
  ],
  '2': [
    {
      id: 'm5',
      chat_id: '2',
      sender: 'Bob Smith',
      content: 'Thanks for the help!',
      timestamp: Date.now() - 1000 * 60 * 5,
      is_read: true,
      is_edited: false,
    },
  ],
  '3': [
    {
      id: 'm6',
      chat_id: '3',
      sender: 'Carol',
      content: 'Meeting at 3pm',
      timestamp: Date.now() - 1000 * 60 * 15,
      is_read: false,
      is_edited: false,
    },
    {
      id: 'm7',
      chat_id: '3',
      sender: 'David',
      content: 'I\'ll be there',
      timestamp: Date.now() - 1000 * 60 * 12,
      is_read: false,
      is_edited: false,
    },
    {
      id: 'm8',
      chat_id: '3',
      sender: 'You',
      content: 'Sounds good!',
      timestamp: Date.now() - 1000 * 60 * 10,
      is_read: false,
      is_edited: false,
    },
  ],
};

/**
 * Mock implementation of getChats for development without SQLite.
 * This simulates pagination with the mock data.
 */
export function getChatsMock(request: GetChatsRequest): GetChatsResponse {
  const { offset, limit } = request;
  
  // Sort by updated_at DESC (already sorted in mock data)
  const sortedChats = [...mockChats].sort((a, b) => b.updated_at - a.updated_at);
  
  // Apply pagination
  const paginatedChats = sortedChats.slice(offset, offset + limit);
  
  const total = sortedChats.length;
  const hasMore = offset + paginatedChats.length < total;
  
  return {
    chats: paginatedChats,
    total,
    hasMore,
  };
}
