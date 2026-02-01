// src/components/MessageComposer.tsx
import React, { useState, useEffect } from 'react';
import { Send, Paperclip, Smile, X, FileText } from 'lucide-react';
import { useSelector } from 'react-redux';
import { syncIpcClient } from '../services/syncIpcClient';
import type { MessageAttachmentPayload } from '../domains/messages/messages.types';
import type { RootState } from '../app/store';

export interface MessageComposerProps {
  onSendMessage: (content: string, attachment?: MessageAttachmentPayload) => void;
  placeholder?: string;
  disabled?: boolean;
}

const toFileUrl = (filePath: string): string => {
  if (!filePath) return '';
  if (filePath.startsWith('file://')) return filePath;
  const normalized = filePath.replace(/\\/g, '/');
  const isWindowsPath = /^[a-zA-Z]:\//.test(normalized);
  const prefix = isWindowsPath ? 'file:///' : 'file://';
  return encodeURI(`${prefix}${normalized}`);
};

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
  const [attachment, setAttachment] = useState<MessageAttachmentPayload | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [rows, setRows] = useState(1);
  const emojiOptions = ['😀', '😂', '😍', '👍', '🎉', '🔥', '😢', '😮', '🤔', '🙏'];
  const currentUser = useSelector((s: RootState) => s.auth.user?.username || 'You');

  // Auto-resize textarea based on content (row-based to avoid inline styles)
  useEffect(() => {
    const maxRows = 4;
    const lineBreaks = message.split('\n');
    const estimatedRows = lineBreaks.reduce((count, line) => {
      const lineRows = Math.max(1, Math.ceil(line.length / 48));
      return count + lineRows;
    }, 0);

    setRows(Math.min(maxRows, Math.max(1, estimatedRows)));
  }, [message]);

  const handleSend = () => {
    if (disabled) return;
    const trimmed = message.trim();
    if (!trimmed && !attachment) return;

    onSendMessage(trimmed, attachment ?? undefined);
    setMessage('');
    setAttachment(null);
    setShowEmojiPicker(false);
    setRows(1);
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

  const handleFileSelect = async () => {
    if (disabled) return;
    try {
      const result = await syncIpcClient.selectAttachment(currentUser);
      if (result.success && result.data) {
        setAttachment(result.data);
      }
    } catch (error) {
      console.error('Failed to select attachment:', error);
    }
  };

  const handleEmojiPicker = () => {
    if (disabled) return;
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => `${prev}${emoji}`);
    setShowEmojiPicker(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
      {attachment && (
        <div className="mb-2 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          {attachment.type === 'image' ? (
            <img
              src={toFileUrl(attachment.filePath)}
              alt={attachment.fileName}
              className="h-12 w-12 rounded object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded bg-white text-gray-500">
              <FileText size={20} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-gray-800">{attachment.fileName}</p>
            <p className="text-xs text-gray-500">{formatFileSize(attachment.fileSize)}</p>
          </div>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            className="rounded p-1 text-gray-500 hover:bg-white hover:text-gray-700"
            aria-label="Remove attachment"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {showEmojiPicker && (
        <div className="mb-2 flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
          {emojiOptions.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleEmojiSelect(emoji)}
              className="h-8 w-8 rounded hover:bg-gray-100"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className="w-full min-h-[40px] max-h-[100px] px-4 py-2 bg-gray-light border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && !attachment)}
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
