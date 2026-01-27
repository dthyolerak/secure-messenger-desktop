// src/pages/Home.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { logout } from '../auth/authSlice';
import MainLayout from '../layouts/MainLayout';
import { selectChat } from '../app/slices/chatsSlice';
import type { ChatItem } from '../components/ChatList';
import type { MessageItem } from '../components/MessageList';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.auth.user);

  const handleLogout = () => {
    void dispatch(logout());
  };

  // Demo data (replace with real data later)
  const demoChats: ChatItem[] = [
    { id: '1', name: 'Alice', lastMessage: 'See you tomorrow!', updatedAt: Date.now() - 1000 * 60, unreadCount: 2 },
    { id: '2', name: 'Bob', lastMessage: 'Thanks for the help', updatedAt: Date.now() - 1000 * 60 * 5 },
    { id: '3', name: 'Team Chat', lastMessage: 'Meeting at 3pm', updatedAt: Date.now() - 1000 * 60 * 15, unreadCount: 5 },
  ];

  const demoMessagesByChat: Record<string, MessageItem[]> = {
    '1': [
      { id: 'm1', chatId: '1', sender: 'Alice', content: 'Hey, are you free later?', timestamp: Date.now() - 1000 * 60 * 10 },
      { id: 'm2', chatId: '1', sender: 'You', content: 'Sure, what’s up?', timestamp: Date.now() - 1000 * 60 * 8 },
      { id: 'm3', chatId: '1', sender: 'Alice', content: 'See you tomorrow!', timestamp: Date.now() - 1000 * 60 },
    ],
    '2': [
      { id: 'm4', chatId: '2', sender: 'Bob', content: 'Thanks for the help', timestamp: Date.now() - 1000 * 60 * 5 },
    ],
    '3': [
      { id: 'm5', chatId: '3', sender: 'Carol', content: 'Meeting at 3pm', timestamp: Date.now() - 1000 * 60 * 15 },
    ],
  };

  // Populate Redux with demo data on mount (temporary)
  React.useEffect(() => {
    // In a real app, this would be fetched from the backend
    // For demo, we’ll dispatch actions to populate state
    const { setChats } = require('../app/slices/chatsSlice');
    const { setMessagesForChat } = require('../app/slices/messagesSlice');
    dispatch(setChats(demoChats));
    Object.entries(demoMessagesByChat).forEach(([chatId, messages]) => {
      dispatch(setMessagesForChat({ chatId, messages }));
    });
  }, [dispatch]);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Secure Messenger Desktop</h1>
        {user && <span className="home-user">Signed in as: {user.username}</span>}
        <button onClick={handleLogout} className="home-logout">Logout</button>
      </header>
      <MainLayout />
    </div>
  );
};

export default Home;