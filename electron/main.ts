// electron/main.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { registerAuthIpcHandlers } from '../src/domains/auth/auth.ipc';
import { registerMessageIpc } from '../src/domains/messages/messages.ipc';
import { registerSyncIpc } from '../src/domains/sync/sync.ipc';
import { registerChatsIpc } from '../src/domains/chats/chats.ipc';

// Initialize SQLite database
let db: any = null;

function initializeDatabase(): void {
  try {
    // Use dynamic import to avoid bundling issues
    const Database = eval('require')('better-sqlite3');
    db = new Database('chats.db');
    
    // Create tables if they don't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        last_message TEXT,
        updated_at INTEGER NOT NULL,
        unread_count INTEGER DEFAULT 0
      );
      
      CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at DESC);
    `);
    
    // Insert demo data
    const chatCount = db.prepare('SELECT COUNT(*) as count FROM chats').get() as { count: number };
    if (chatCount.count === 0) {
      const insertChat = db.prepare(`
        INSERT INTO chats (id, name, last_message, updated_at, unread_count)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      const demoChats = [
        ['1', 'Alice Johnson', 'Hey, are you free later?', Date.now() - 1000 * 60, 2],
        ['2', 'Bob Smith', 'Thanks for the help!', Date.now() - 1000 * 60 * 5, 0],
        ['3', 'Team Chat', 'Meeting at 3pm', Date.now() - 1000 * 60 * 15, 5],
        ['4', 'Carol White', 'Can you review this?', Date.now() - 1000 * 60 * 30, 1],
        ['5', 'David Brown', 'Great work on the project', Date.now() - 1000 * 60 * 60, 0],
      ];
      
      demoChats.forEach(chat => insertChat.run(...chat));
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    // Don't set db to null here, keep it as is
  }
}

function createMainWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Point to your React entry HTML once bundled
  mainWindow.loadFile(path.join(__dirname, '..', 'src', 'index.html'));

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  // Initialize database first
  initializeDatabase();
  
  // Register IPC handlers
  registerAuthIpcHandlers(ipcMain);
  registerMessageIpc();
  registerSyncIpc();
  registerChatsIpc(db);

  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});