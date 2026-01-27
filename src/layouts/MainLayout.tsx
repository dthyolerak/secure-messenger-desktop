// src/layouts/MainLayout.tsx
import React from 'react';
import ChatList from '../components/ChatList';
import MessageList from '../components/MessageList';
import EmptyState from '../components/EmptyState';
import MessageComposer from '../components/MessageComposer';
import ConnectionStatusBar from '../components/ConnectionStatusBar';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { selectChat } from '../app/slices/chatsSlice';

const MainLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedChatId = useSelector((s: RootState) => s.chats.selectedChatId);
  const chats = useSelector((s: RootState) => s.chats.items);
  const messagesByChat = useSelector((s: RootState) => s.messages.byChatId);

  const handleSelectChat = (chatId: string) => {
    dispatch(selectChat(chatId));
  };

  const selectedMessages = selectedChatId ? messagesByChat[selectedChatId] ?? [] : [];

  return (
    <div className="main-layout">
      <div className="main-layout-panes">
        {/* Left Pane: Chat List */}
        <aside className="chat-list-pane">
          <ChatList
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
          />
        </aside>

        {/* Right Pane: Message Thread or Empty State */}
        <main className="message-thread-pane">
          {selectedChatId ? (
            <>
              <MessageList chatId={selectedChatId} messages={selectedMessages} />
              <MessageComposer chatId={selectedChatId} />
            </>
          ) : (
            <EmptyState />
          )}
        </main>
      </div>

      {/* Bottom: Connection Status */}
      <footer className="connection-status-bar">
        <ConnectionStatusBar />
      </footer>
    </div>
  );
};

export default MainLayout;
