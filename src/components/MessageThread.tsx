// src/components/MessageThread.tsx
import React from 'react';
import type { MessageItem } from './MessageList';
import MessageList from './MessageList';
import MessageComposer from './MessageComposer';
import EmptyState from './EmptyState';

export interface MessageThreadProps {
  chatId?: string | null;
  chatName?: string;
  messages?: MessageItem[];
  isLoading?: boolean;
  onSendMessage?: (chatId: string, content: string) => void;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  chatId,
  chatName,
  messages = [],
  isLoading = false,
  onSendMessage,
}) => {
  if (!chatId) {
    return <EmptyState />;
  }

  return (
    <main className="message-thread">
      <header className="message-thread-header">
        <h2 className="message-thread-title">{chatName || 'Chat'}</h2>
        <div className="message-thread-actions">
          {/* Placeholder icons for future features */}
          <button className="message-thread-action" aria-label="Search" title="Search">
            🔍
          </button>
          <button className="message-thread-action" aria-label="Menu" title="Menu">
            ⋯
          </button>
        </div>
      </header>
      <MessageList chatId={chatId} messages={messages} isLoading={isLoading} />
      <MessageComposer chatId={chatId} onSend={onSendMessage} />
    </main>
  );
};

export default MessageThread;
