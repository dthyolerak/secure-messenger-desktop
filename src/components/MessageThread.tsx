// src/components/MessageThread.tsx
import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Phone, Video, Edit2, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import type { MessageItem } from '../domains/messages/messages.types';
import MessageComposer from './MessageComposer';
import EmptyState from './EmptyState';
import { syncIpcClient } from '../services/syncIpcClient';

export interface MessageThreadProps {
  chatId?: string | null;
  chatName?: string;
  messages?: MessageItem[];
  isLoading?: boolean;
  onSendMessage?: (chatId: string, content: string) => void;
}

/**
 * Message thread panel with Teams-style header, message list, and composer.
 * Features proper message alignment and editing capabilities.
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
  const currentUser = useSelector((s: RootState) => s.auth.user?.username || 'You');

  // Load messages from SQLite when chat changes
  useEffect(() => {
    if (chatId) {
      const loadMessages = async () => {
        try {
          const response = await syncIpcClient.getMessages(chatId, 50, 0, currentUser);
          if (response.success && response.data) {
            // Transform to MessageItem format
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
              };
            });

            const allMessages = [...transformedMessages, ...messages];
            const dedupedMessages = Array.from(
              new Map(allMessages.map((msg) => [msg.id, msg])).values(),
            );

            setLocalMessages(dedupedMessages.sort((a, b) => a.timestamp - b.timestamp));

            // Mark messages as read when chat is opened
            const unreadMessages = transformedMessages.filter(
              (msg) => msg.recipient === currentUser && !msg.is_read,
            );
            if (unreadMessages.length > 0) {
              console.log(`Marking ${unreadMessages.length} messages as read`);
              await syncIpcClient.markMessagesRead(chatId, currentUser);
            }
          }
        } catch (error) {
          console.error('Failed to load messages:', error);
          setLocalMessages(messages); // Fallback to props
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
      if (message.chat_id === chatId) {
        // Transform to MessageItem format
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
        };
        
        // Add message if it doesn't already exist
        setLocalMessages(prev => {
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (!exists) {
            return [...prev, newMessage].sort((a, b) => a.timestamp - b.timestamp);
          }
          return prev;
        });
      }
    };

    // Subscribe to message events
    if (window.secureMessenger && window.secureMessenger.sync) {
      window.secureMessenger.sync.onMessageInserted(handleMessageInserted);
    }

    // Cleanup
    return () => {
      // Note: We can't easily remove listeners with current API design
      // But this is fine since the component will unmount
    };
  }, [chatId, currentUser]);

  const handleSendMessage = async (content: string) => {
    if (!chatId) return;

    // Create immediate message for UI display
    const now = Date.now();
    const immediateMessage: MessageItem = {
      id: `msg_${now}_${Math.random().toString(36).substr(2, 9)}`,
      chatId,
      sender: currentUser,
      recipient: chatName || 'Unknown',
      content,
      timestamp: now,
      read_at: now,
      is_read: true,
      is_edited: false,
    };

    // Add message to local state immediately for instant feedback
    setLocalMessages(prev => [...prev, immediateMessage]);

    try {
      // Send message via IPC (will be persisted and synced)
      const recipient = chatName || 'Unknown';
      await syncIpcClient.sendMessage(chatId, content, currentUser, recipient);
      
      // The IPC will emit events that update Redux state and trigger chat reordering
      // But we can also trigger immediate chat update for better UX
      if (onSendMessage) {
        onSendMessage(chatId, content);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove the message from local state if sending failed
      setLocalMessages(prev => prev.filter(msg => msg.id !== immediateMessage.id));
    }
  };

  const handleEditMessage = (messageId: string) => {
    const message = localMessages.find(m => m.id === messageId);
    if (message) {
      setEditingMessage(messageId);
      setEditContent(message.content);
    }
  };

  const handleSaveEdit = () => {
    if (!editingMessage) return;

    setLocalMessages(prev => 
      prev.map(msg => 
        msg.id === editingMessage 
          ? { ...msg, content: editContent, is_edited: true }
          : msg
      )
    );
    setEditingMessage(null);
    setEditContent('');
  };

  const handleDeleteMessage = (messageId: string) => {
    setLocalMessages(prev => prev.filter(msg => msg.id !== messageId));
    // TODO: Implement actual deletion via IPC
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderAttachment = (message: MessageItem) => {
    if (!message.type || message.type === 'text') return null;

    return (
      <div className="mt-2 p-2 bg-white/10 rounded-lg">
        {message.type === 'image' ? (
          <div className="space-y-2">
            <img 
              src={`file://${message.file_path}`} 
              alt={message.file_name}
              className="max-w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => {
                // Open image in default viewer
                window.open(`file://${message.file_path}`, '_blank');
              }}
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
              <p className="text-sm font-medium truncate">{message.file_name}</p>
              {message.file_size && (
                <p className="text-xs opacity-75">{formatFileSize(message.file_size)}</p>
              )}
            </div>
            <button
              onClick={() => {
                // Download file
                const link = document.createElement('a');
                link.href = `file://${message.file_path}`;
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
      </div>
    );
  };

  if (!chatId) {
    return <EmptyState />;
  }

  return (
    <main className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
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
      </header>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {localMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">Start the conversation</p>
            </div>
          </div>
        ) : (
          localMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === currentUser ? 'justify-end' : 'justify-start'
              } group`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative ${
                  message.sender === currentUser
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {/* Message content */}
                {editingMessage === message.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
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
                    {renderAttachment(message)}
                    <div className="flex items-center justify-between mt-1">
                      <p
                        className={`text-xs ${
                          message.sender === currentUser ? 'text-orange-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTimestamp(message.timestamp)}
                        {message.is_edited && ' (edited)'}
                      </p>
                      
                      {/* Action buttons for own messages */}
                      {message.sender === currentUser && (
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
          ))
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
