// src/layouts/MainLayout.tsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import ChatList from '../components/ChatList';
import MessageThread from '../components/MessageThread';
import ConnectionStatusBar from '../components/ConnectionStatusBar';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { selectChat } from '../app/slices/chatsSlice';
import { sendMessage } from '../app/slices/messagesSlice';
import type { MessageAttachmentPayload } from '../domains/messages/messages.types';
import { selectUser } from '../app/slices/authSlice';
import { syncIpcClient } from '../services/syncIpcClient';

/**
 * Main 3-pane Teams-style layout:
 * - Left: App navigation sidebar
 * - Center: Virtualized chat list
 * - Right: Message thread + composer
 */
const MainLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedChatId = useSelector((s: RootState) => s.chats.selectedChatId);
  const chats = useSelector((s: RootState) => s.chats.items);
  const messagesByChat = useSelector((s: RootState) => s.messages.byChatId);
  const user = useSelector(selectUser);

  const handleSelectChat = React.useCallback(
    (chatId: string) => {
      dispatch(selectChat(chatId));
      
      // Mark messages as read when chat is opened
      const selectedChat = chats.find((c) => c.id === chatId);
      if (selectedChat && selectedChat.unreadCount > 0) {
        syncIpcClient.markMessagesRead(chatId, user?.username || 'You').catch(error => {
          console.error('Failed to mark messages as read:', error);
        });
      }
    },
    [dispatch, chats, user?.username],
  );

  const selectedChat = chats.find((c) => c.id === selectedChatId);
  const selectedMessages = selectedChatId ? messagesByChat[selectedChatId] ?? [] : [];

  const handleSendMessage = React.useCallback(
    async (chatId: string, content: string, attachment?: MessageAttachmentPayload) => {
      if (!user?.username) return;
      const sender = user.username;
      const recipient = selectedChat?.userId || selectedChat?.name || 'Unknown';
      await dispatch(sendMessage({ chatId, content, sender, recipient, attachment }));
    },
    [dispatch, user?.username, selectedChat?.userId, selectedChat?.name],
  );

  const handleCreateChat = React.useCallback(
    async (userId: string) => {
      try {
        // Create or get direct chat with the selected user
        const currentUserId = user?.id || 'current_user';
        const chat = await syncIpcClient.getOrCreateDirectChat(currentUserId, userId);
        if (chat && chat.success) {
          dispatch(selectChat(chat.data.id));
        }
      } catch (error) {
        console.error('Failed to create chat:', error);
      }
    },
    [dispatch, user?.id],
  );

  return (
    <div className="flex h-screen bg-gray-light">
      <div className="flex flex-1">
        {/* Left Sidebar - Fixed narrow column */}
        <Sidebar />

        {/* Chat List Panel - Scrollable, virtualized */}
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <ChatList
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
            onCreateChat={handleCreateChat}
            currentUserId={user?.id || 'current_user'}
          />
        </aside>

        {/* Message Thread Panel - Main content area */}
        <section className="flex-1 flex flex-col bg-white">
          <MessageThread
            chatId={selectedChatId}
            chatName={selectedChat?.name}
            messages={selectedMessages}
            onSendMessage={handleSendMessage}
          />
        </section>
      </div>

      {/* Connection Status Notifications */}
      <ConnectionStatusBar />
    </div>
  );
};

export default MainLayout;
