// src/components/MessageComposer.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

export interface MessageComposerProps {
  onSendMessage: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Message composer with Teams-style layout.
 * Features auto-resize textarea, file attachment, emoji picker, and keyboard shortcuts.
 */
const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  placeholder = 'Type a message...',
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter for new line
        return;
      } else {
        // Enter to send
        e.preventDefault();
        handleSend();
      }
    }
  };

  const handleFileSelect = () => {
    // TODO: Implement file selection
    console.log('File selection not implemented yet');
  };

  const handleEmojiPicker = () => {
    // TODO: Implement emoji picker
    console.log('Emoji picker not implemented yet');
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-end gap-2">
        {/* Left side buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleFileSelect}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Attach file"
            disabled={disabled}
          >
            <Paperclip size={20} />
          </button>
          <button
            onClick={handleEmojiPicker}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Add emoji"
            disabled={disabled}
          >
            <Smile size={20} />
          </button>
        </div>

        {/* Message input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-2 bg-gray-light border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{
              minHeight: '40px',
              maxHeight: '100px',
            }}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="p-2 bg-primary text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Send message"
          title="Send message (Enter)"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageComposer;
