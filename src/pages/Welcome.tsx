// src/pages/Welcome.tsx
import React from 'react';

export interface WelcomeProps {
  isLoading?: boolean;
  onContinue: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ isLoading = false, onContinue }) => {
  return (
    <main className="welcome-root app-bg" role="main">
      <section className="welcome-card fade-in" aria-labelledby="welcome-title">
        <div className="welcome-logo" aria-hidden>
          🔒
        </div>
        <h1 id="welcome-title" className="welcome-title accent">
          Secure Messenger Desktop
        </h1>
        <p className="welcome-subtitle">
          A secure, high-performance desktop messaging client.
        </p>
        <ul className="welcome-points" aria-label="Key features">
          <li>Local encrypted storage (simulated)</li>
          <li>Real-time sync (WebSocket)</li>
          <li>Built for performance & reliability</li>
        </ul>
        <div className="welcome-actions">
          <button
            type="button"
            className="welcome-primary-button"
            onClick={onContinue}
            disabled={isLoading}
            aria-busy={isLoading}
            autoFocus
          >
            {isLoading ? 'Preparing your workspace…' : 'Get Started'}
          </button>
        </div>
      </section>
    </main>
  );
};

export default Welcome;