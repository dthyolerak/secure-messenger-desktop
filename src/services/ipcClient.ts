// src/services/ipcClient.ts
import type { AuthSession, StartSessionPayload } from '../domains/auth/auth.types';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  createdAt: number;
}

interface AuthClient {
  getSession(): Promise<AuthSession | null>;
  startSession(payload: StartSessionPayload): Promise<AuthSession>;
}

interface UsersClient {
  searchUsers(query: string, currentUserId: string): Promise<{ success: boolean; users: User[]; error?: string }>;
  upsertUser(email: string, displayName: string, username: string): Promise<{ success: boolean; user?: User; error?: string }>;
  getAllUsers(currentUserId: string): Promise<{ success: boolean; users: User[]; error?: string }>;
}

interface IpcClient {
  auth: AuthClient;
  users: UsersClient;
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
  users: {
    searchUsers: (query: string, currentUserId: string) => api.users.searchUsers(query, currentUserId),
    upsertUser: (email: string, displayName: string, username: string) => api.users.upsertUser(email, displayName, username),
    getAllUsers: (currentUserId: string) => api.users.getAllUsers(currentUserId),
  },
};