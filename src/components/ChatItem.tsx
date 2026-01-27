// src/components/ChatItem.tsx
import React from 'react';

export interface ChatItemProps {
  chat: {
    id: string;
    name: string;
    lastMessage?: string;
    updatedAt: number;
    unreadCount?: number;
  };
  isSelected?: boolean;
  onClick?: () => void;
}

/**
 * Individual chat item component with Teams-style layout.
 * Shows avatar, name, last message, timestamp, and unread badge.
 */
const ChatItem: React.FC<ChatItemProps> = ({ chat, isSelected = false, onClick }) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full px-4 py-3 flex items-start space-x-3 transition-colors ${
        isSelected
          ? 'bg-gray-light border-l-4 border-primary'
          : 'hover:bg-gray-50 border-l-4 border-transparent'
      }`}
      aria-selected={isSelected}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white font-semibold">
          {chat.name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`text-sm font-medium truncate ${
            isSelected ? 'text-secondary' : 'text-gray-900'
          }`}>
            {chat.name}
          </h3>
          <span className={`text-xs ${
            isSelected ? 'text-primary' : 'text-gray-500'
          }`}>
            {formatTime(chat.updatedAt)}
          </span>
        </div>

        {chat.lastMessage && (
          <p className={`text-sm truncate ${
            isSelected ? 'text-gray-700' : 'text-gray-600'
          }`}>
            {chat.lastMessage}
          </p>
        )}
      </div>

      {/* Unread Badge */}
      {chat.unreadCount && chat.unreadCount > 0 && (
        <div className="flex-shrink-0">
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
            {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
          </span>
        </div>
      )}
    </button>
  );
};

export default ChatItem;
