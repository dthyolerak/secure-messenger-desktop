// src/components/ChatList.tsx
import React, { useMemo } from 'react';
import ChatItem from './ChatItem';

export interface ChatListItem {
  id: string;
  name: string;
  lastMessage?: string;
  updatedAt: number;
  unreadCount?: number;
}

export interface ChatListProps {
  chats?: ChatListItem[];
  selectedChatId?: string | null;
  onSelectChat?: (chatId: string) => void;
}

/**
 * Chat list panel with Teams-style layout.
 * Optimized for performance with memoization and efficient rendering.
 */
const ChatList: React.FC<ChatListProps> = ({
  chats = [],
  selectedChatId,
  onSelectChat,
}) => {
  // Sort chats by most recent activity
  const sortedChats = useMemo(
    () => [...chats].sort((a, b) => b.updatedAt - a.updatedAt),
    [chats],
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="px-4 py-3 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-secondary">Chats</h2>
      </header>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {sortedChats.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-sm">No chats yet</p>
              <p className="text-xs mt-1">Start a conversation to see it here</p>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {sortedChats.map((chat) => (
              <li key={chat.id}>
                <ChatItem
                  chat={chat}
                  isSelected={selectedChatId === chat.id}
                  onClick={() => onSelectChat?.(chat.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatList;
