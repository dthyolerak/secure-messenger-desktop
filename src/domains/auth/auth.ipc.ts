// src/domains/auth/auth.ipc.ts
import type { IpcMain } from 'electron';
import { AUTH_IPC_CHANNELS } from './auth.types';
import {
  GetSessionResponseSchema,
  StartSessionInputSchema,
  StartSessionResponseSchema,
} from './auth.schema';
import { loadSession, startNewSession, upsertUserGlobal } from './auth.service';

export function registerAuthIpcHandlers(ipcMain: IpcMain, db?: any): void {
  ipcMain.handle(AUTH_IPC_CHANNELS.getSession, async () => {
    const session = await loadSession();
    return GetSessionResponseSchema.parse({ session });
  });

  ipcMain.handle(
    AUTH_IPC_CHANNELS.startSession,
    async (_event, rawPayload: unknown) => {
      const payload = StartSessionInputSchema.parse(rawPayload);
      const session = await startNewSession(payload.displayName);
      
      // Upsert user globally if database is available and email is provided
      if (db && payload.email && payload.displayName) {
        try {
          const username = payload.username || payload.email?.split('@')[0] || 'user'; // Use provided username or extract from email with fallback
          await upsertUserGlobal(db, payload.email, payload.displayName, username);
        } catch (error) {
          console.error('Failed to upsert user globally:', error);
          // Don't fail the session creation if upsert fails
        }
      }
      
      return StartSessionResponseSchema.parse({ session });
    },
  );

  // Add handler for user upsert
  ipcMain.handle('auth:upsertUser', async (_event, { email, displayName, username }: { email: string; displayName: string; username: string }) => {
    if (!db) {
      return { success: false, error: 'Database not available' };
    }
    
    return await upsertUserGlobal(db, email, displayName, username);
  });
}