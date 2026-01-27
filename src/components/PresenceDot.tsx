// src/components/PresenceDot.tsx
import React from 'react';
import type { ConnectionStatus } from './ConnectionStatusBar';

export interface PresenceDotProps {
  status: ConnectionStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

const PresenceDot: React.FC<PresenceDotProps> = ({
  status,
  size = 'md',
  showLabel = false,
  label,
}) => {
  const sizeClass = `presence-dot-${size}`;
  const statusClass = `presence-${status}`;
  const displayLabel = label ?? status;

  return (
    <div className={`presence-dot ${sizeClass} ${statusClass}`}>
      <span className="presence-dot-indicator" aria-hidden />
      {showLabel && (
        <span className="presence-dot-label">{displayLabel}</span>
      )}
    </div>
  );
};

export default PresenceDot;
