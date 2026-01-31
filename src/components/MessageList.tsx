// src/components/MessageList.tsx
import React from 'react';
import type { MessageItem } from '../domains/messages/messages.types';

export interface MessageListProps {
  chatId: string;
  messages?: MessageItem[];
  isLoading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
  chatId,
  messages = [],
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="message-list-loading">
        <div>Loading messages…</div>
      </div>
    );
  }

  return (
    <div className="message-list">
      <ul className="message-list-items" role="list">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className={`message-item ${msg.isOwn ? 'own' : 'other'}`}
          >
            <div className="message-header">
              <span className="message-sender">{msg.sender}</span>
              <span className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="message-content">{msg.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
