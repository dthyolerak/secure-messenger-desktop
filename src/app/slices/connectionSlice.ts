// src/app/slices/connectionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ConnectionStatus = 'connected' | 'reconnecting' | 'offline';

interface ConnectionState {
  status: ConnectionStatus;
  lastConnected?: number;
  reconnectAttempts: number;
  showNotification: boolean;
  notificationMessage?: string;
}

const initialState: ConnectionState = {
  status: 'offline',
  reconnectAttempts: 0,
  showNotification: false,
};

const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setConnectionStatus(state, action: PayloadAction<{
      status: ConnectionStatus;
      lastConnected?: number;
      reconnectAttempts?: number;
    }>) {
      const { status, lastConnected, reconnectAttempts } = action.payload;
      const previousStatus = state.status;
      
      state.status = status;
      if (lastConnected !== undefined) {
        state.lastConnected = lastConnected;
      }
      if (reconnectAttempts !== undefined) {
        state.reconnectAttempts = reconnectAttempts;
      }

      // Show notification for status changes
      if (previousStatus !== status) {
        state.showNotification = true;
        
        switch (status) {
          case 'connected':
            state.notificationMessage = 'Connected to server';
            break;
          case 'reconnecting':
            state.notificationMessage = `Connection lost... Reconnecting (${reconnectAttempts || 0})`;
            break;
          case 'offline':
            state.notificationMessage = 'Offline - Working in offline mode';
            break;
        }
      }
    },

    hideNotification(state) {
      state.showNotification = false;
      state.notificationMessage = undefined;
    },

    resetConnection(state) {
      return { ...initialState };
    },
  },
});

export const { setConnectionStatus, hideNotification, resetConnection } = connectionSlice.actions;
export default connectionSlice.reducer;
