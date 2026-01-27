// src/pages/Home.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { logout } from '../auth/authSlice';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.auth.user);

  const handleLogout = () => {
    void dispatch(logout());
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Home</h1>
      {user && <p>Signed in as: <strong>{user.username}</strong></p>}
      <p>Welcome to Secure Messenger Desktop.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;