// src/components/ConnectionStatusBar.tsx
import React from 'react';

export type ConnectionStatus = 'online' | 'offline' | 'reconnecting';

export interface ConnectionStatusBarProps {
  status?: ConnectionStatus;
}

const ConnectionStatusBar: React.FC<ConnectionStatusBarProps> = ({
  status = 'offline',
}) => {
  const statusInfo = {
    online: { text: 'Connected', className: 'online' },
    offline: { text: 'Offline', className: 'offline' },
    reconnecting: { text: 'Reconnecting…', className: 'reconnecting' },
  }[status];

  return (
    <div className="connection-status-bar">
      <div className={`connection-status ${statusInfo.className}`}>
        <span className="connection-status-dot" aria-hidden />
        <span className="connection-status-text">{statusInfo.text}</span>
      </div>
    </div>
  );
};

export default ConnectionStatusBar;
