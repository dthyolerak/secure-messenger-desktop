// src/pages/Login.tsx
import React, { useState, FormEvent } from 'react';

export interface LoginProps {
  isLoading?: boolean;
  error?: string | null;
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ isLoading = false, error, onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onLogin(username);
  };

  return (
    <main className="login-root app-bg" role="main">
      <section className="login-card fade-in" aria-labelledby="login-title">
        <div className="login-logo" aria-hidden>
          🔒
        </div>
        <h1 id="login-title" className="login-title accent">
          Secure Messenger Desktop
        </h1>
        <p className="login-subtitle">
          Enter your username to continue.
        </p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
              autoFocus
              required
            />
          </div>
          {error && <div className="login-error" role="alert">{error}</div>}
          <div className="login-actions">
            <button
              type="submit"
              className="login-primary-button"
              disabled={isLoading || !username.trim()}
              aria-busy={isLoading}
            >
              {isLoading ? 'Signing in…' : 'Continue'}
            </button>
          </div>
        </form>
        <p className="login-helper">
          This is a simulated local login.
        </p>
      </section>
    </main>
  );
};

export default Login;
