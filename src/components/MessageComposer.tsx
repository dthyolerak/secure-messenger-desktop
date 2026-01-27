// src/components/MessageComposer.tsx
import React, { useState, FormEvent } from 'react';

export interface MessageComposerProps {
  chatId: string;
  onSend?: (chatId: string, content: string) => void;
  disabled?: boolean;
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  chatId,
  onSend,
  disabled = false,
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || disabled) return;
    onSend?.(chatId, content.trim());
    setContent('');
  };

  return (
    <form className="message-composer" onSubmit={handleSubmit}>
      <div className="message-composer-input-wrapper">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message…"
          disabled={disabled}
          rows={1}
          className="message-composer-input"
        />
      </div>
      <button
        type="submit"
        disabled={!content.trim() || disabled}
        className="message-composer-send"
        aria-label="Send message"
      >
        Send
      </button>
    </form>
  );
};

export default MessageComposer;
