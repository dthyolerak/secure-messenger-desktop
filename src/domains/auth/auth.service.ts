// src/domains/auth/auth.service.ts
import { app } from 'electron';
import { promises as fs } from 'fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import type { 
  AuthSession, 
  User, 
  RegisterRequest, 
  LoginRequest, 
  RegisterResponse, 
  LoginResponse 
} from './auth.types';
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
    const session = AuthSessionSchema.parse(json);
    
    // Check if session is expired (24 hours)
    if (Date.now() > session.expiresAt) {
      await clearSession();
      return null;
    }
    
    return session;
  } catch (error: any) {
    if (error && error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

export async function startNewSession(
  displayName?: string,
  email?: string,
  username?: string,
): Promise<AuthSession> {
  const session: AuthSession = {
    user: {
      id: randomUUID(),
      email: email || '',
      displayName: displayName || 'Guest User',
      passwordHash: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    token: randomUUID(),
    createdAt: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
  };

  const filePath = getSessionFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(session), { encoding: 'utf-8' });

  return session;
}

export async function clearSession(): Promise<void> {
  const filePath = getSessionFilePath();
  try {
    await fs.unlink(filePath);
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}

// SQLite-based user management
export async function upsertUserGlobal(db: any, email: string, displayName: string, username: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Check if user already exists
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (existingUser) {
      // Update existing user
      db.prepare(`
        UPDATE users 
        SET display_name = ?, username = ?, updated_at = ?
        WHERE email = ?
      `).run(displayName, username, Date.now(), email);
      
      const updatedUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      
      const user: User = {
        id: updatedUser.id,
        email: updatedUser.email,
        displayName: updatedUser.display_name,
        passwordHash: updatedUser.password_hash,
        createdAt: updatedUser.created_at,
        updatedAt: updatedUser.updated_at,
      };
      
      return {
        success: true,
        user,
      };
    } else {
      // Create new user
      const user: User = {
        id: randomUUID(),
        email,
        displayName,
        passwordHash: 'demo_hash', // Default hash for demo users
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      db.prepare(`
        INSERT INTO users (id, email, display_name, username, password_hash, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        user.id,
        user.email,
        user.displayName,
        username,
        user.passwordHash,
        user.createdAt,
        user.updatedAt
      );

      return {
        success: true,
        user,
      };
    }
  } catch (error) {
    console.error('Upsert user error:', error);
    return {
      success: false,
      error: 'Failed to upsert user',
    };
  }
}

export async function registerUser(db: any, request: RegisterRequest): Promise<RegisterResponse> {
  try {
    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(request.email);
    if (existingUser) {
      return {
        success: false,
        error: 'User with this email already exists',
      };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(request.password, 10);

    // Create user
    const user: User = {
      id: randomUUID(),
      email: request.email,
      displayName: request.displayName,
      passwordHash,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    db.prepare(`
      INSERT INTO users (id, email, display_name, password_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      user.id,
      user.email,
      user.displayName,
      user.passwordHash,
      user.createdAt,
      user.updatedAt
    );

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Registration failed',
    };
  }
}

export async function loginUser(db: any, request: LoginRequest): Promise<LoginResponse> {
  try {
    // Find user by email
    const userRow = db.prepare('SELECT * FROM users WHERE email = ?').get(request.email);
    if (!userRow) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(request.password, userRow.password_hash);
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    const user: User = {
      id: userRow.id,
      email: userRow.email,
      displayName: userRow.display_name,
      passwordHash: userRow.password_hash,
      createdAt: userRow.created_at,
      updatedAt: userRow.updated_at,
    };

    // Create session
    const session: AuthSession = {
      user,
      token: randomUUID(),
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    };

    // Save session
    const filePath = getSessionFilePath();
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(session), { encoding: 'utf-8' });

    return {
      success: true,
      session,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Login failed',
    };
  }
}