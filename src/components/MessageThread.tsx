// src/components/MessageThread.tsx
import React, { useState, useEffect, useRef, useCallback, CSSProperties } from 'react';
import { List, useDynamicRowHeight } from 'react-window';
import { Search, MoreVertical, Phone, Video, Edit2, Trash2, Smile, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import type { MessageAttachmentPayload, MessageItem, MessageSearchResult } from '../domains/messages/messages.types';
import MessageComposer from './MessageComposer';
import EmptyState from './EmptyState';
import { syncIpcClient } from '../services/syncIpcClient';

const toFileUrl = (filePath: string): string => {
  if (!filePath) return '';
  if (filePath.startsWith('file://')) return filePath;
  const normalized = filePath.replace(/\\/g, '/');
  const isWindowsPath = /^[a-zA-Z]:\//.test(normalized);
  const prefix = isWindowsPath ? 'file:///' : 'file://';
  return encodeURI(`${prefix}${normalized}`);
};

export interface MessageThreadProps {
  chatId?: string | null;
  chatName?: string;
  messages?: MessageItem[];
  isLoading?: boolean;
  onSendMessage?: (chatId: string, content: string, attachment?: MessageAttachmentPayload) => void;
}

const DEFAULT_ROW_HEIGHT = 80;

type VirtualListRef = {
  readonly element: HTMLDivElement | null;
  scrollToRow: (options: {
    index: number;
    align?: 'auto' | 'start' | 'center' | 'end' | 'smart';
    behavior?: ScrollBehavior | 'instant';
  }) => void;
};

// Row props interface
interface MessageRowProps {
  messages: MessageItem[];
  currentUser: string;
  editingMessage: string | null;
  editContent: string;
  setEditContent: (content: string) => void;
  handleSaveEdit: () => void;
  setEditingMessage: (id: string | null) => void;
  handleEditMessage: (id: string) => void;
  handleDeleteMessage: (id: string) => void;
  handleToggleReaction: (messageId: string, emoji: string) => void;
  activeReactionMessageId: string | null;
  setActiveReactionMessageId: (id: string | null) => void;
  uploadProgressById: Record<string, number>;
  reactionOptions: string[];
}

// Message row component
const MessageRow = ({
  index,
  style,
  messages,
  currentUser,
  editingMessage,
  editContent,
  setEditContent,
  handleSaveEdit,
  setEditingMessage,
  handleEditMessage,
  handleDeleteMessage,
  handleToggleReaction,
  activeReactionMessageId,
  setActiveReactionMessageId,
  uploadProgressById,
  reactionOptions,
}: {
  index: number;
  style: CSSProperties;
  ariaAttributes: { 'aria-posinset': number; 'aria-setsize': number; role: 'listitem' };
} & MessageRowProps) => {
  const message = messages[index];
  if (!message) return null;

  const isOwn = message.sender === currentUser;

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderAttachment = () => {
    if (!message.type || message.type === 'text') return null;
    const progress = uploadProgressById[message.id];
    const filePath = message.file_path ?? '';

    if (!filePath) {
      return (
        <div className="mt-2 p-2 bg-white/10 rounded-lg">
          <p className="text-xs text-gray-500">Attachment unavailable</p>
          {message.file_name && (
            <p className="text-xs opacity-75">{message.file_name}</p>
          )}
        </div>
      );
    }

    return (
      <div className="mt-2 p-2 bg-white/10 rounded-lg">
        {message.type === 'image' ? (
          <div className="space-y-2">
            <img
              src={toFileUrl(filePath)}
              alt={message.file_name ?? 'Image'}
              className="max-w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity"
              style={{ maxHeight: 200 }}
              onClick={() => window.open(toFileUrl(filePath), '_blank')}
            />
            {message.file_name && (
              <p className="text-xs opacity-75">{message.file_name}</p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.file_name ?? 'Attachment'}</p>
              {message.file_size && (
                <p className="text-xs opacity-75">{formatFileSize(message.file_size)}</p>
              )}
            </div>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = toFileUrl(filePath);
                link.download = message.file_name || 'download';
                link.click();
              }}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="Download file"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        )}
        {progress !== undefined && progress < 100 && (
          <progress
            className="mt-2 h-1 w-full overflow-hidden rounded bg-white/20 accent-white"
            max={100}
            value={progress}
          />
        )}
      </div>
    );
  };

  const renderReactions = () => {
    const reactions = message.reactions ?? [];
    return (
      <div className="mt-2 flex flex-wrap items-center gap-1">
        {reactions.map((reaction) => (
          <button
            key={reaction.emoji}
            type="button"
            onClick={() => handleToggleReaction(message.id, reaction.emoji)}
            className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors ${reaction.reactedByCurrentUser
              ? 'border-primary/60 bg-primary/10 text-primary'
              : 'border-gray-200 bg-white/60 text-gray-600'
              }`}
          >
            <span>{reaction.emoji}</span>
            <span>{reaction.count}</span>
          </button>
        ))}
        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setActiveReactionMessageId(activeReactionMessageId === message.id ? null : message.id)
            }
            className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white/70 text-gray-500 hover:text-gray-700"
            title="Add reaction"
          >
            <Smile size={12} />
          </button>
          {activeReactionMessageId === message.id && (
            <div
              className={`absolute top-7 z-10 flex gap-1 rounded-lg border border-gray-200 bg-white p-1 shadow-sm ${isOwn ? 'right-0' : 'left-0'
                }`}
            >
              {reactionOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleToggleReaction(message.id, emoji)}
                  className="h-7 w-7 rounded hover:bg-gray-100"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={style} className="px-6">
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group py-2`}>
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative ${isOwn ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'
            }`}
        >
          {editingMessage === message.id ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingMessage(null)}
                  className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm">{message.content}</p>
              {renderAttachment()}
              {renderReactions()}
              <div className="flex items-center justify-between mt-1">
                <p className={`text-xs ${isOwn ? 'text-orange-100' : 'text-gray-500'}`}>
                  {formatTimestamp(message.timestamp)}
                  {message.is_edited && ' (edited)'}
                </p>

                {isOwn && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditMessage(message.id)}
                      className="p-1 hover:bg-white/20 rounded"
                      title="Edit message"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="p-1 hover:bg-white/20 rounded"
                      title="Delete message"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Message thread panel with Teams-style header, virtualized message list, and composer.
 */
const MessageThread: React.FC<MessageThreadProps> = ({
  chatId,
  chatName,
  messages = [],
  isLoading = false,
  onSendMessage,
}) => {
  const [localMessages, setLocalMessages] = useState<MessageItem[]>([]);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | null>(null);
  const [uploadProgressById, setUploadProgressById] = useState<Record<string, number>>({});
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MessageItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const currentUser = useSelector((s: RootState) => s.auth.user?.username || 'You');
  const reactionOptions = ['👍', '❤️', '😂', '😮', '🎉', '😢'];
  const activeChatIdRef = useRef<string | null | undefined>(chatId);
  const listRef = useRef<VirtualListRef | null>(null);
  const lastScrollChatIdRef = useRef<string | null | undefined>(chatId);
  const lastMessageCountRef = useRef(0);

  // Use dynamic row height for variable message sizes
  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: DEFAULT_ROW_HEIGHT,
    key: chatId || 'default',
  });

  useEffect(() => {
    activeChatIdRef.current = chatId;
  }, [chatId]);

  // Load messages from SQLite when chat changes
  useEffect(() => {
    if (chatId) {
      const loadMessages = async () => {
        try {
          const response = await syncIpcClient.getMessages(chatId, 50, 0, currentUser);
          if (response.success && response.data) {
            const transformedMessages: MessageItem[] = response.data.map((msg: any) => {
              const readAt = msg.read_at ?? (msg.is_read ? msg.timestamp : null);
              const isRead = readAt !== null && readAt !== undefined;

              return {
                id: msg.id,
                chatId: msg.chat_id,
                sender: msg.sender,
                recipient: msg.recipient,
                content: msg.content,
                timestamp: msg.timestamp,
                read_at: readAt,
                is_read: isRead,
                is_edited: Boolean(msg.is_edited),
                type: msg.type,
                file_path: msg.file_path ?? null,
                file_name: msg.file_name ?? null,
                file_size: msg.file_size ?? null,
                mime_type: msg.mime_type ?? null,
                reactions: msg.reactions ?? [],
              };
            });

            const sortedMessages = [...transformedMessages].sort(
              (a, b) => a.timestamp - b.timestamp,
            );

            setLocalMessages(sortedMessages);

            const unreadMessages = transformedMessages.filter(
              (msg) => msg.recipient === currentUser && !msg.is_read,
            );
            if (unreadMessages.length > 0) {
              await syncIpcClient.markMessagesRead(chatId, currentUser);
            }
          }
        } catch (error) {
          console.error('Failed to load messages:', error);
          setLocalMessages(messages);
        }
      };

      loadMessages();
    } else {
      setLocalMessages([]);
    }
  }, [chatId, messages, currentUser]);

  // Listen for new messages via IPC events
  useEffect(() => {
    const handleMessageInserted = (message: any) => {
      if (message.chat_id === activeChatIdRef.current) {
        const readAt = message.read_at ?? (message.is_read ? message.timestamp : null);
        const newMessage: MessageItem = {
          id: message.id,
          chatId: message.chat_id,
          sender: message.sender,
          recipient: message.recipient,
          content: message.content,
          timestamp: message.timestamp,
          read_at: readAt,
          is_read: readAt !== null && readAt !== undefined,
          is_edited: Boolean(message.is_edited),
          type: message.type,
          file_path: message.file_path ?? null,
          file_name: message.file_name ?? null,
          file_size: message.file_size ?? null,
          mime_type: message.mime_type ?? null,
          reactions: message.reactions ?? [],
        };

        setLocalMessages((prev) => {
          const exists = prev.some((msg) => msg.id === newMessage.id);
          if (!exists) {
            return [...prev, newMessage].sort((a, b) => a.timestamp - b.timestamp);
          }
          return prev;
        });
      }
    };

    syncIpcClient.onMessageInserted(handleMessageInserted);
  }, []);

  useEffect(() => {
    const handleReactionsUpdated = (payload: { messageId: string; reactions: MessageItem['reactions'] }) => {
      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg.id === payload.messageId ? { ...msg, reactions: payload.reactions ?? [] } : msg
        )
      );
    };

    syncIpcClient.onMessageReactionsUpdated(handleReactionsUpdated);
  }, []);

  useEffect(() => {
    const handleProgress = (payload: { messageId: string; progress: number }) => {
      setUploadProgressById((prev) => ({ ...prev, [payload.messageId]: payload.progress }));
    };

    syncIpcClient.onAttachmentUploadProgress(handleProgress);
  }, []);

  useEffect(() => {
    if (!chatId) return;
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    let isActive = true;
    setSearchLoading(true);

    const timer = window.setTimeout(() => {
      syncIpcClient
        .searchMessages(trimmed, currentUser, 50, 0)
        .then((results) => {
          if (!isActive) return;
          const filtered = results.filter((message) => message.chat_id === chatId);
          const mapped: MessageItem[] = filtered.map((message: MessageSearchResult) => {
            const readAt = message.read_at ?? null;
            return {
              id: message.id,
              chatId: message.chat_id,
              sender: message.sender,
              recipient: message.recipient,
              content: message.content,
              timestamp: message.timestamp,
              read_at: readAt,
              is_read: readAt !== null && readAt !== undefined,
              is_edited: Boolean(message.is_edited),
              type: message.type,
              file_path: message.file_path ?? null,
              file_name: message.file_name ?? null,
              file_size: message.file_size ?? null,
              mime_type: message.mime_type ?? null,
              reactions: message.reactions ?? [],
            };
          });

          setSearchResults(mapped.sort((a, b) => a.timestamp - b.timestamp));
        })
        .catch((error) => {
          console.error('Message search failed:', error);
          if (!isActive) return;
          setSearchResults([]);
        })
        .finally(() => {
          if (!isActive) return;
          setSearchLoading(false);
        });
    }, 250);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, [chatId, currentUser, searchQuery]);

  const handleSendMessage = async (content: string, attachment?: MessageAttachmentPayload) => {
    if (!chatId) return;
    try {
      if (onSendMessage) {
        await onSendMessage(chatId, content, attachment);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleEditMessage = useCallback((messageId: string) => {
    const message = localMessages.find(m => m.id === messageId);
    if (message) {
      setEditingMessage(messageId);
      setEditContent(message.content);
    }
  }, [localMessages]);

  const handleSaveEdit = useCallback(async () => {
    if (!editingMessage) return;
    const trimmed = editContent.trim();
    if (!trimmed) return;

    try {
      const response = await syncIpcClient.updateMessage(editingMessage, trimmed);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update message');
      }
      setEditingMessage(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to update message:', error);
    }
  }, [editingMessage, editContent]);

  const handleDeleteMessage = useCallback(async (messageId: string) => {
    try {
      const response = await syncIpcClient.deleteMessage(messageId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  }, []);

  const handleToggleReaction = useCallback(async (messageId: string, emoji: string) => {
    try {
      const reactions = await syncIpcClient.toggleReaction(messageId, currentUser, emoji);
      setLocalMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, reactions } : msg))
      );
    } catch (error) {
      console.error('Failed to toggle reaction:', error);
    } finally {
      setActiveReactionMessageId(null);
    }
  }, [currentUser]);

  const displayedMessages = searchQuery.trim() ? searchResults : localMessages;

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = 'auto') => {
      if (!listRef.current) return;
      const lastIndex = displayedMessages.length - 1;
      if (lastIndex < 0) return;
      listRef.current.scrollToRow({ index: lastIndex, align: 'end', behavior });
    },
    [displayedMessages.length],
  );

  useEffect(() => {
    const handleMessageUpdated = (payload: { messageId: string; content: string }) => {
      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg.id === payload.messageId
            ? { ...msg, content: payload.content, is_edited: true }
            : msg,
        ),
      );
      setSearchResults((prev) =>
        prev.map((msg) =>
          msg.id === payload.messageId
            ? { ...msg, content: payload.content, is_edited: true }
            : msg,
        ),
      );
    };

    const handleMessageDeleted = (payload: { messageId: string }) => {
      setLocalMessages((prev) => prev.filter((msg) => msg.id !== payload.messageId));
      setSearchResults((prev) => prev.filter((msg) => msg.id !== payload.messageId));
    };

    syncIpcClient.onMessageUpdated(handleMessageUpdated);
    syncIpcClient.onMessageDeleted(handleMessageDeleted);
  }, []);

  useEffect(() => {
    if (!chatId || searchQuery.trim()) {
      lastScrollChatIdRef.current = chatId;
      lastMessageCountRef.current = displayedMessages.length;
      return;
    }

    if (displayedMessages.length === 0) {
      lastScrollChatIdRef.current = chatId;
      lastMessageCountRef.current = 0;
      return;
    }

    if (displayedMessages.some((message) => message.chatId !== chatId)) {
      return;
    }

    const isNewChat = chatId !== lastScrollChatIdRef.current;
    const hasNewMessages = displayedMessages.length > lastMessageCountRef.current;

    if (isNewChat || hasNewMessages) {
      scrollToBottom(isNewChat ? 'auto' : 'smooth');
    }

    lastScrollChatIdRef.current = chatId;
    lastMessageCountRef.current = displayedMessages.length;
  }, [chatId, displayedMessages, scrollToBottom, searchQuery]);

  if (!chatId) {
    return <EmptyState />;
  }

  return (
    <main className="flex flex-col h-full min-h-0 bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-semibold">
              {chatName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-secondary">{chatName || 'Chat'}</h2>
              <p className="text-xs text-gray-500">Active now</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Voice call"
              title="Voice call"
            >
              <Phone size={18} />
            </button>
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Video call"
              title="Video call"
            >
              <Video size={18} />
            </button>
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Search"
              title="Search"
              onClick={() => setShowSearch((prev) => !prev)}
            >
              <Search size={18} />
            </button>
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="More options"
              title="More options"
            >
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {(showSearch || searchQuery.trim()) && (
          <div className="mt-3 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search messages in this chat"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {searchLoading ? 'Searching…' : `${displayedMessages.length} results`}
            </span>
          </div>
        )}
      </header>

      {/* Virtualized Message List */}
      <div className="flex-1 min-h-0">
        {displayedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-sm">
                {searchQuery.trim() ? 'No messages match your search' : 'No messages yet'}
              </p>
              <p className="text-xs mt-1">
                {searchQuery.trim() ? 'Try another keyword' : 'Start the conversation'}
              </p>
            </div>
          </div>
        ) : (
          <List
            rowComponent={MessageRow}
            listRef={listRef}
            rowProps={{
              messages: displayedMessages,
              currentUser,
              editingMessage,
              editContent,
              setEditContent,
              handleSaveEdit,
              setEditingMessage,
              handleEditMessage,
              handleDeleteMessage,
              handleToggleReaction,
              activeReactionMessageId,
              setActiveReactionMessageId,
              uploadProgressById,
              reactionOptions,
            }}
            rowCount={displayedMessages.length}
            rowHeight={dynamicRowHeight}
            overscanCount={5}
            style={{ height: '100%', width: '100%' }}
          />
        )}
      </div>

      {/* Message Composer */}
      <MessageComposer
        onSendMessage={handleSendMessage}
        disabled={isLoading}
      />
    </main>
  );
};

export default MessageThread;
