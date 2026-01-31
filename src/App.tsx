// src/App.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './app/store';
import { checkSession, login, register } from './auth/authSlice';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
// Import sync client to initialize event listeners
import './services/syncIpcClient';

const FIRST_LAUNCH_KEY = 'smd.hasCompletedWelcome';

type AuthView = 'login' | 'register' | 'forgot';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authStatus = useSelector((s: RootState) => s.auth.status);
  const authError = useSelector((s: RootState) => s.auth.error);

  const initialFlag = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.localStorage.getItem(FIRST_LAUNCH_KEY) === 'true',
    [],
  );
  const [hasCompletedWelcome, setHasCompletedWelcome] =
    useState<boolean>(initialFlag);
  const [authView, setAuthView] = useState<AuthView>('login');

  useEffect(() => {
    void dispatch(checkSession());
  }, [dispatch]);

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      // For demo: ignore password, use username only
      void dispatch(login({ username }));
    },
    [dispatch],
  );

  const handleRegister = useCallback(
    async (email: string, displayName: string, password: string) => {
      void dispatch(register({ email, displayName, password }));
    },
    [dispatch],
  );

  const handleForgotPassword = useCallback(
    async (email: string) => {
      // For demo: just show success message
      console.log('Password reset requested for:', email);
    },
    [],
  );

  const handleWelcomeContinue = useCallback(() => {
    try {
      window.localStorage.setItem(FIRST_LAUNCH_KEY, 'true');
      setHasCompletedWelcome(true);
    } catch {
      // ignore storage errors
    }
  }, []);

  // Auto-login: if authenticated, skip Login
  if (authStatus === 'authenticated') {
    if (!hasCompletedWelcome) {
      return <Welcome isLoading={false} onContinue={handleWelcomeContinue} />;
    }
    return <Home />;
  }

  // Show loading while checking session
  if (authStatus === 'idle') {
    return <div className="p-6 text-sm text-gray-500">Loading…</div>;
  }

  // Unauthenticated: show auth views
  switch (authView) {
    case 'register':
      return (
        <Register
          isLoading={false}
          error={authError}
          onSubmit={handleRegister}
          onBackToLogin={() => setAuthView('login')}
        />
      );
    
    case 'forgot':
      return (
        <ForgotPassword
          isLoading={false}
          error={authError}
          onSubmit={handleForgotPassword}
          onBackToLogin={() => setAuthView('login')}
        />
      );
    
    case 'login':
    default:
      return (
        <Login
          isLoading={false}
          error={authError}
          onSubmit={handleLogin}
          onCreateAccount={() => setAuthView('register')}
          onForgotPassword={() => setAuthView('forgot')}
        />
      );
  }
};

export default App;