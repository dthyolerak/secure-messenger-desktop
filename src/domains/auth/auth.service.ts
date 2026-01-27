// src/domains/auth/auth.service.ts
import { app } from 'electron';
import { promises as fs } from 'fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { AuthSession } from './auth.types';
import { AuthSessionSchema } from './auth.schema';

const SESSION_FILE_NAME = 'auth-session.json';

function getSessionFilePath(): string {
  const userData = app.getPath('userData');
  return path.join(userData, SESSION_FILE_NAME);
}

export async function loadSession(): Promise<AuthSession | null> {
  const filePath = getSessionFilePath();

  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(raw);
    return AuthSessionSchema.parse(json);
  } catch (error: any) {
    if (error && error.code === 'ENOENT') {
      return null;
    }
    // No sensitive data in logs; bubble up for higher-level handling
    throw error;
  }
}

export async function startNewSession(
  displayName?: string,
): Promise<AuthSession> {
  const session: AuthSession = {
    id: randomUUID(),
    createdAt: Date.now(),
    displayName,
  };

  const filePath = getSessionFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(session), { encoding: 'utf-8' });

  return session;
}