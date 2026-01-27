// src/components/MessageThread.tsx
import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Phone, Video, Edit2, Trash2 } from 'lucide-react';
import MessageComposer from './MessageComposer';
import EmptyState from './EmptyState';
import { mockMessages } from '../domains/chats/chats.mock';

export interface MessageItem {
  id: string;
  chatId: string;
  sender: string;
  content: string;
  timestamp: number;
  is_read?: boolean;
  is_edited?: boolean;
}

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

  // Load messages from mock data or props
  useEffect(() => {
    if (chatId) {
      const mockData = mockMessages[chatId] || [];
      // Transform mock data to match MessageItem interface
      const transformedMockData = mockData.map(msg => ({
        ...msg,
        chatId: msg.chat_id, // Convert chat_id to chatId
      }));
      const allMessages = [...transformedMockData, ...messages];
      setLocalMessages(allMessages.sort((a, b) => a.timestamp - b.timestamp));
      
      // Mark messages as read when chat is opened
      const unreadMessages = transformedMockData.filter(msg => !msg.is_read && msg.sender !== 'You');
      if (unreadMessages.length > 0) {
        console.log(`Marking ${unreadMessages.length} messages as read`);
        // TODO: Implement actual read status update via IPC
      }
    } else {
      setLocalMessages([]);
    }
  }, [chatId, messages]);

  const handleSendMessage = (content: string) => {
    if (!chatId || !onSendMessage) return;

    const newMessage: MessageItem = {
      id: `msg_${Date.now()}`,
      chatId,
      sender: 'You',
      content,
      timestamp: Date.now(),
      is_read: true,
      is_edited: false,
    };

    setLocalMessages(prev => [...prev, newMessage]);
    // Don't call onSendMessage since we're just updating local state for now
    // onSendMessage(chatId, content);
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

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
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
                message.sender === 'You' ? 'justify-end' : 'justify-start'
              } group`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative ${
                  message.sender === 'You'
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
                    <div className="flex items-center justify-between mt-1">
                      <p
                        className={`text-xs ${
                          message.sender === 'You' ? 'text-orange-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTimestamp(message.timestamp)}
                        {message.is_edited && ' (edited)'}
                      </p>
                      
                      {/* Action buttons for own messages */}
                      {message.sender === 'You' && (
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
