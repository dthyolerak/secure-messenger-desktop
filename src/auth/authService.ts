// src/auth/authService.ts
import type { AuthUser, StoredSession, LoginPayload } from './authTypes';

const SESSION_KEY = 'smd.authSession';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function validateUsername(username: string): string | null {
  const trimmed = username.trim();
  if (!trimmed) return 'Username is required';
  if (trimmed.length < 2) return 'Username must be at least 2 characters';
  if (trimmed.length > 32) return 'Username must be 32 characters or fewer';
  // Allow letters, numbers, underscores, hyphens, spaces
  if (!/^[a-zA-Z0-9_\-\s]+$/.test(trimmed)) {
    return 'Username can only contain letters, numbers, underscores, hyphens, and spaces';
  }
  return null;
}

export function createSession(payload: LoginPayload): AuthUser {
  const now = Date.now();
  return {
    username: payload.username.trim(),
    loggedInAt: now,
    expiresAt: now + SESSION_DURATION_MS,
  };
}

export function storeSession(user: AuthUser): void {
  try {
    const session: StoredSession = { user };
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage errors (e.g., quota)
  }
}

export function loadStoredSession(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: StoredSession = JSON.parse(raw);
    // Basic shape validation
    if (
      !session.user ||
      typeof session.user.username !== 'string' ||
      typeof session.user.loggedInAt !== 'number' ||
      (session.user.expiresAt !== undefined && typeof session.user.expiresAt !== 'number')
    ) {
      clearSession();
      return null;
    }
    // Check expiry
    if (session.user.expiresAt && Date.now() > session.user.expiresAt) {
      clearSession();
      return null;
    }
    return session.user;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore
  }
}
