// src/domains/auth/auth.ipc.ts
import type { IpcMain } from 'electron';
import { AUTH_IPC_CHANNELS } from './auth.types';
import {
  GetSessionResponseSchema,
  StartSessionInputSchema,
  StartSessionResponseSchema,
} from './auth.schema';
import { loadSession, startNewSession } from './auth.service';

export function registerAuthIpcHandlers(ipcMain: IpcMain): void {
  ipcMain.handle(AUTH_IPC_CHANNELS.getSession, async () => {
    const session = await loadSession();
    return GetSessionResponseSchema.parse({ session });
  });

  ipcMain.handle(
    AUTH_IPC_CHANNELS.startSession,
    async (_event, rawPayload: unknown) => {
      const payload = StartSessionInputSchema.parse(rawPayload);
      const session = await startNewSession(payload.displayName);
      return StartSessionResponseSchema.parse({ session });
    },
  );
}