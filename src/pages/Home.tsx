// src/pages/Home.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { logout } from '../auth/authSlice';
import MainLayout from '../layouts/MainLayout';
import TopNavbar from '../components/TopNavbar';
import { selectChat } from '../app/slices/chatsSlice';
import { useKeyboardShortcuts, createAppShortcuts } from '../hooks/useKeyboardShortcuts';
import type { ChatItem } from '../app/slices/chatsSlice';
import type { MessageItem } from '../components/MessageThread';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.auth.user);

  const handleLogout = () => {
    void dispatch(logout());
  };

  // Keyboard shortcuts
  useKeyboardShortcuts(createAppShortcuts(dispatch));

  return (
    <div className="home-container">
      <TopNavbar />
      <MainLayout />
    </div>
  );
};

export default Home;