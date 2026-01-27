// src/pages/Welcome.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { startSession } from '../app/slices/authSlice';

const Welcome: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((state: RootState) => state.auth.status);
  const isLoading = status === 'loading';

  const handleGetStarted = () => {
    if (isLoading) return;
    void dispatch(startSession({}));
  };

  return (
    <div className="welcome-root">
      <div className="welcome-card">
        <div className="welcome-logo">🔒</div>
        <h1 className="welcome-title">Secure Messenger Desktop</h1>
        <p className="welcome-subtitle">
          A secure, local-first messenger simulation with real-world architecture.
        </p>
        <button
          type="button"
          className="welcome-primary-button"
          onClick={handleGetStarted}
          disabled={isLoading}
        >
          {isLoading ? 'Preparing your workspace…' : 'Get Started'}
        </button>
      </div>
    </div>
  );
};

export default Welcome;