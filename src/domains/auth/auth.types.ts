// src/domains/auth/auth.types.ts
export type AuthStatus = 'unauthenticated' | 'authenticated';

export interface User {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  createdAt: number;
  updatedAt: number;
}

export interface AuthSession {
  user: User;
  token: string;
  createdAt: number;
  expiresAt: number;
}

export interface RegisterRequest {
  email: string;
  displayName: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface LoginResponse {
  success: boolean;
  session?: AuthSession;
  error?: string;
}

export const AUTH_IPC_CHANNELS = {
  getSession: 'auth:getSession',
  startSession: 'auth:startSession',
  register: 'auth:register',
  login: 'auth:login',
  logout: 'auth:logout',
} as const;

export type AuthIpcChannel =
  (typeof AUTH_IPC_CHANNELS)[keyof typeof AUTH_IPC_CHANNELS];

// Legacy compatibility
export interface StartSessionPayload {
  displayName?: string;
}