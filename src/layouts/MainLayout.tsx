// src/layouts/MainLayout.tsx
import React from 'react';
import { MessageSquare, Settings, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ChatList from '../components/ChatList';
import MessageThread from '../components/MessageThread';
import ConnectionStatusBar from '../components/ConnectionStatusBar';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { selectChat, removeChat } from '../app/slices/chatsSlice';
import { sendMessage } from '../app/slices/messagesSlice';
import type { MessageAttachmentPayload } from '../domains/messages/messages.types';
import { syncIpcClient } from '../services/syncIpcClient';
import Profile from '../pages/Profile';
import AppSettings from '../pages/Settings';

/**
 * Main 3-pane Teams-style layout:
 * - Left: App navigation sidebar
 * - Center: Virtualized chat list
 * - Right: Message thread + composer
 */
type ActiveView = 'chat' | 'profile' | 'settings';

const MainLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedChatId = useSelector((s: RootState) => s.chats.selectedChatId);
  const chats = useSelector((s: RootState) => s.chats.items);
  const messagesByChat = useSelector((s: RootState) => s.messages.byChatId);
  const user = useSelector((s: RootState) => s.auth.user);
  const [activeView, setActiveView] = React.useState<ActiveView>('chat');

  const handleSelectChat = React.useCallback(
    (chatId: string) => {
      dispatch(selectChat(chatId));
      setActiveView('chat');
      
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

  const handleDeleteChat = React.useCallback(
    async (chatId: string) => {
      try {
        const result = await syncIpcClient.deleteChat(chatId);
        if (result.success) {
          // Remove chat from Redux state
          dispatch(removeChat(chatId));
        }
      } catch (error) {
        console.error('Failed to delete chat:', error);
      }
    },
    [dispatch],
  );

  const handleChatSettings = React.useCallback(() => {
    // Navigate to settings with chat context
    setActiveView('settings');
  }, []);

  const sidebarItems = React.useMemo(
    () => [
      {
        id: 'chat',
        icon: <MessageSquare size={20} />,
        label: 'Chat',
        active: activeView === 'chat',
        onClick: () => setActiveView('chat'),
      },
      {
        id: 'profile',
        icon: <User size={20} />,
        label: 'Profile',
        active: activeView === 'profile',
        onClick: () => setActiveView('profile'),
      },
      {
        id: 'settings',
        icon: <Settings size={20} />,
        label: 'Settings',
        active: activeView === 'settings',
        onClick: () => setActiveView('settings'),
      },
    ],
    [activeView],
  );

  const renderMainPanel = () => {
    if (activeView === 'profile') {
      return <Profile />;
    }

    if (activeView === 'settings') {
      return <AppSettings />;
    }

    return (
      <MessageThread
        chatId={selectedChatId}
        chatName={selectedChat?.name}
        messages={selectedMessages}
        onSendMessage={handleSendMessage}
        onDeleteChat={handleDeleteChat}
        onChatSettings={handleChatSettings}
      />
    );
  };

  return (
    <div className="flex flex-1 min-h-0 bg-gray-light">
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar - Fixed narrow column */}
        <Sidebar items={sidebarItems} onProfileClick={() => setActiveView('profile')} />

        {activeView === 'chat' && (
          <aside className="w-80 bg-white border-r border-gray-200 flex flex-col min-h-0">
            <ChatList
              selectedChatId={selectedChatId}
              onSelectChat={handleSelectChat}
              onCreateChat={handleCreateChat}
              currentUserId={user?.id || 'current_user'}
            />
          </aside>
        )}

        <section className="flex-1 flex flex-col bg-white min-h-0">
          {renderMainPanel()}
        </section>
      </div>

      {/* Connection Status Notifications */}
      <ConnectionStatusBar />
    </div>
  );
};

export default MainLayout;
