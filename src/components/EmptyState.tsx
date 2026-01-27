// src/components/EmptyState.tsx
import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden>
        💬
      </div>
      <h2 className="empty-state-title">Select a chat to start messaging</h2>
      <p className="empty-state-subtitle">
        Choose a conversation from the list to view and send messages.
      </p>
    </div>
  );
};

export default EmptyState;
