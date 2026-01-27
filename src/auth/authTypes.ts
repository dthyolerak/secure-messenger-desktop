// src/auth/authTypes.ts
export interface AuthUser {
  id?: string;
  username: string;
  displayName?: string;
  email?: string;
  loggedInAt: number; // epoch ms
  expiresAt?: number; // optional expiry epoch ms
  createdAt?: number;
}

export interface AuthState {
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  error: string | null;
}

export interface LoginPayload {
  username: string;
}

export interface StoredSession {
  user: AuthUser;
  // Can add more fields later (e.g., multi-user, preferences)
}
