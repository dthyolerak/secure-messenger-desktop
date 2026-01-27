// src/components/ChatList.tsx
import React from 'react';

export interface ChatItem {
  id: string;
  name: string;
  lastMessage?: string;
  updatedAt: number;
  unreadCount?: number;
}

export interface ChatListProps {
  chats?: ChatItem[];
  selectedChatId?: string | null;
  onSelectChat?: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats = [],
  selectedChatId,
  onSelectChat,
}) => {
  return (
    <div className="chat-list">
      <header className="chat-list-header">
        <h2 className="chat-list-title">Chats</h2>
      </header>
      <ul className="chat-list-items" role="list">
        {chats.map((chat) => (
          <li key={chat.id}>
            <button
              type="button"
              className={`chat-list-item ${
                selectedChatId === chat.id ? 'selected' : ''
              }`}
              onClick={() => onSelectChat?.(chat.id)}
              aria-selected={selectedChatId === chat.id}
            >
              <div className="chat-item-name">{chat.name}</div>
              {chat.lastMessage && (
                <div className="chat-item-last-message">{chat.lastMessage}</div>
              )}
              <div className="chat-item-meta">
                <span className="chat-item-time">
                  {new Date(chat.updatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {chat.unreadCount ? (
                  <span className="chat-item-unread">{chat.unreadCount}</span>
                ) : null}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
