// src/App.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './app/store';
import { checkSession, login } from './auth/authSlice';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import Home from './pages/Home';

const FIRST_LAUNCH_KEY = 'smd.hasCompletedWelcome';

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
    return <div style={{ padding: 24 }}>Loading…</div>;
  }

  // Unauthenticated: show Login
  return <Login isLoading={false} error={authError} onSubmit={handleLogin} />;

};

export default App;