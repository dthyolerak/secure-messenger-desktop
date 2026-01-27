// electron/preload.ts
import { contextBridge, ipcRenderer } from 'electron';
import {
  AUTH_IPC_CHANNELS,
  type AuthSession,
  type StartSessionPayload,
} from '../src/domains/auth/auth.types';
import {
  GetSessionResponseSchema,
  StartSessionInputSchema,
  StartSessionResponseSchema,
} from '../src/domains/auth/auth.schema';

const authApi = {
  async getSession(): Promise<AuthSession | null> {
    const raw = await ipcRenderer.invoke(AUTH_IPC_CHANNELS.getSession);
    const parsed = GetSessionResponseSchema.parse(raw);
    return parsed.session;
  },

  async startSession(payload: StartSessionPayload): Promise<AuthSession> {
    const input = StartSessionInputSchema.parse(payload);
    const raw = await ipcRenderer.invoke(
      AUTH_IPC_CHANNELS.startSession,
      input,
    );
    const parsed = StartSessionResponseSchema.parse(raw);
    return parsed.session;
  },
};

export type AuthApi = typeof authApi;

export interface SecureMessengerApi {
  auth: AuthApi;
}

declare global {
  interface Window {
    secureMessenger: SecureMessengerApi;
  }
}

contextBridge.exposeInMainWorld('secureMessenger', {
  auth: authApi,
} satisfies SecureMessengerApi);