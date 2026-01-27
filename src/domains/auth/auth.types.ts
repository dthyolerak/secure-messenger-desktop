// src/domains/auth/auth.types.ts
export type AuthStatus = 'unauthenticated' | 'authenticated';

export interface AuthSession {
  id: string;
  createdAt: number;
  displayName?: string;
}

export const AUTH_IPC_CHANNELS = {
  getSession: 'auth:getSession',
  startSession: 'auth:startSession',
} as const;

export type AuthIpcChannel =
  (typeof AUTH_IPC_CHANNELS)[keyof typeof AUTH_IPC_CHANNELS];

export interface StartSessionPayload {
  displayName?: string;
}