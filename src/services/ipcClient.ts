// src/services/ipcClient.ts
import type { AuthSession, StartSessionPayload } from '../domains/auth/auth.types';

interface AuthClient {
  getSession(): Promise<AuthSession | null>;
  startSession(payload: StartSessionPayload): Promise<AuthSession>;
}

interface IpcClient {
  auth: AuthClient;
}

function requireApi(): IpcClient {
  if (!window.secureMessenger) {
    throw new Error('secureMessenger API is not available');
  }
  return window.secureMessenger;
}

const api = requireApi();

export const ipcClient: IpcClient = {
  auth: {
    getSession: () => api.auth.getSession(),
    startSession: (payload) => api.auth.startSession(payload),
  },
};