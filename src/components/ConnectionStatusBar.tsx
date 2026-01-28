// src/components/ConnectionStatusBar.tsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { hideNotification } from '../app/slices/connectionSlice';
import { Wifi, WifiOff, RefreshCw, X } from 'lucide-react';

export type ConnectionStatus = 'connected' | 'reconnecting' | 'offline';

const ConnectionStatusBar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, showNotification, notificationMessage } = useSelector(
    (state: RootState) => state.connection
  );

  useEffect(() => {
    // Auto-hide reconnecting notification after 5 seconds
    if (status === 'reconnecting' && showNotification) {
      const timeout = setTimeout(() => {
        dispatch(hideNotification());
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [status, showNotification, dispatch]);

  if (!showNotification) {
    return null;
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <Wifi size={16} className="text-green-500" />;
      case 'reconnecting':
        return <RefreshCw size={16} className="text-yellow-500 animate-spin" />;
      case 'offline':
        return <WifiOff size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'reconnecting':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'offline':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className={`flex items-center justify-between p-3 rounded-lg border shadow-sm ${getStatusColor()}`}>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">
            {notificationMessage || 'Connection status changed'}
          </span>
        </div>
        
        <button
          onClick={() => dispatch(hideNotification())}
          className="ml-2 p-1 rounded hover:bg-black/10 transition-colors"
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default ConnectionStatusBar;
