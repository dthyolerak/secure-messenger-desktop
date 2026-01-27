// src/components/TypingIndicator.tsx
import React from 'react';

export interface TypingUser {
  username: string;
  since: number;
}

export interface TypingIndicatorProps {
  users?: TypingUser[];
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  users = [],
  className = '',
}) => {
  if (users.length === 0) return null;

  const names = users.map((u) => u.username);
  let text: string;
  if (names.length === 1) {
    text = `${names[0]} is typing…`;
  } else if (names.length === 2) {
    text = `${names[0]} and ${names[1]} are typing…`;
  } else {
    text = `${names[0]} and ${names.length - 1} others are typing…`;
  }

  return (
    <div className={`typing-indicator ${className}`} aria-live="polite" aria-atomic>
      <span className="typing-indicator-text">{text}</span>
      <div className="typing-indicator-dots" aria-hidden>
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
};

export default TypingIndicator;
