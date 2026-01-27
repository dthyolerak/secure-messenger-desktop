// src/layouts/MainLayout.tsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import ChatList from '../components/ChatList';
import MessageThread from '../components/MessageThread';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { selectChat } from '../app/slices/chatsSlice';
import { sendMessage } from '../app/slices/messagesSlice';

const MainLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedChatId = useSelector((s: RootState) => s.chats.selectedChatId);
  const chats = useSelector((s: RootState) => s.chats.items);
  const messagesByChat = useSelector((s: RootState) => s.messages.byChatId);
  const user = useSelector((s: RootState) => s.auth.user);

  const handleSelectChat = (chatId: string) => {
    dispatch(selectChat(chatId));
  };

  const selectedChat = chats.find((c) => c.id === selectedChatId);
  const selectedMessages = selectedChatId ? messagesByChat[selectedChatId] ?? [] : [];

  const handleSendMessage = React.useCallback(
    (chatId: string, content: string) => {
      if (!user?.username) return;
      dispatch(sendMessage({ chatId, content, sender: user.username }));
    },
    [dispatch, user?.username],
  );

  return (
    <div className="main-layout">
      <div className="main-layout-panes">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Chat List Panel */}
        <aside className="chat-list-panel">
          <ChatList
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
          />
        </aside>

        {/* Message Thread Panel */}
        <section className="message-thread-panel">
          <MessageThread
            chatId={selectedChatId}
            chatName={selectedChat?.name}
            messages={selectedMessages}
            onSendMessage={handleSendMessage}
          />
        </section>
      </div>
    </div>
  );
};

export default MainLayout;
