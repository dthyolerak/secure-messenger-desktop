// electron/main.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { registerAuthIpcHandlers } from '../src/domains/auth/auth.ipc';
import { registerMessageIpc } from '../src/domains/messages/messages.ipc';
import { registerSyncIpc } from '../src/domains/sync/sync.ipc';
import { registerChatsIpc } from '../src/domains/chats/chats.ipc';
import { WebSocketClient } from './wsClient';
import { SyncQueries } from './db/queries';
import { SyncIPCEmitter, registerSyncIPCHandlers } from './ipc/events';

// Initialize SQLite database
let db: any = null;
let wsClient: WebSocketClient | null = null;
let syncQueries: SyncQueries | null = null;

function initializeDatabase(): void {
  try {
    // Use dynamic import to avoid bundling issues
    const Database = eval('require')('better-sqlite3');
    db = new Database('chats.db');
    
    // Check if messages table exists and has the correct schema
    const tableInfo = db.prepare(`
      SELECT sql FROM sqlite_master 
      WHERE type='table' AND name='messages'
    `).get() as { sql: string } | undefined;
    
    if (tableInfo && !tableInfo.sql.includes('sender TEXT')) {
      console.log('[DB] Messages table has old schema, dropping and recreating...');
      db.exec('DROP TABLE IF EXISTS messages');
      db.exec('DROP TABLE IF EXISTS chats'); // Also drop chats to recreate with correct schema
    }
    
    // Create tables if they don't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        display_name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        last_message TEXT,
        updated_at INTEGER NOT NULL,
        unread_count INTEGER DEFAULT 0
      );
      
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        chat_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        is_read INTEGER DEFAULT 0,
        is_edited INTEGER DEFAULT 0,
        FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at DESC);
      CREATE INDEX IF NOT EXISTS idx_messages_chat_timestamp ON messages(chat_id, timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
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
      
      // Insert demo messages
      const insertMessage = db.prepare(`
        INSERT INTO messages (id, chat_id, sender, content, timestamp, is_read, is_edited)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      const demoMessages = [
        // Chat 1 messages
        ['m1', '1', 'Alice Johnson', 'Hey, are you free later?', Date.now() - 1000 * 60 * 10, 0, 0],
        ['m2', '1', 'You', 'Sure, what\'s up?', Date.now() - 1000 * 60 * 8, 1, 0],
        ['m3', '1', 'Alice Johnson', 'Want to grab coffee?', Date.now() - 1000 * 60 * 5, 0, 0],
        ['m4', '1', 'Alice Johnson', 'Hey, are you free later?', Date.now() - 1000 * 60, 0, 0],
        // Chat 2 messages
        ['m5', '2', 'Bob Smith', 'Thanks for the help!', Date.now() - 1000 * 60 * 5, 1, 0],
        // Chat 3 messages
        ['m6', '3', 'Carol', 'Meeting at 3pm', Date.now() - 1000 * 60 * 15, 0, 0],
        ['m7', '3', 'David', 'I\'ll be there', Date.now() - 1000 * 60 * 12, 0, 0],
        ['m8', '3', 'You', 'Sounds good!', Date.now() - 1000 * 60 * 10, 0, 0],
      ];
      
      demoMessages.forEach(msg => insertMessage.run(...msg));
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    // Don't set db to null here, keep it as is
  }
}

/**
 * Initialize WebSocket sync client
 */
async function initializeWebSocketSync(): Promise<void> {
  if (!db) {
    console.error('[SYNC] Database not initialized, cannot start sync');
    return;
  }

  try {
    // Initialize sync queries
    syncQueries = new SyncQueries(db);
    
    // Create WebSocket client
    wsClient = new WebSocketClient();
    
    // Setup event handlers
    wsClient.on('connected', () => {
      console.log('[SYNC] WebSocket connected');
      SyncIPCEmitter.emitConnectionConnected();
      SyncIPCEmitter.emitConnectionStatus(wsClient!.getStatus());
    });

    wsClient.on('disconnected', () => {
      console.log('[SYNC] WebSocket disconnected');
      SyncIPCEmitter.emitConnectionDisconnected();
      SyncIPCEmitter.emitConnectionStatus(wsClient!.getStatus());
    });

    wsClient.on('statusChange', (status) => {
      console.log('[SYNC] Status changed:', status);
      SyncIPCEmitter.emitConnectionStatus(status);
    });

    wsClient.on('syncEvent', async (event) => {
      console.log('[SYNC] Processing sync event:', event);
      await handleSyncEvent(event);
    });

    wsClient.on('error', (error) => {
      console.error('[SYNC] WebSocket error:', error);
    });

    wsClient.on('maxReconnectAttemptsReached', () => {
      console.error('[SYNC] Max reconnect attempts reached - going offline');
      SyncIPCEmitter.emitConnectionStatus(wsClient!.getStatus());
    });

    // Connect to WebSocket server
    await wsClient.connect();
    console.log('[SYNC] WebSocket sync initialized');
    
  } catch (error) {
    console.error('[SYNC] Failed to initialize WebSocket sync:', error);
    // Continue without WebSocket - app will work in offline mode
  }
}

/**
 * Handle incoming sync events from WebSocket
 */
async function handleSyncEvent(event: any): Promise<void> {
  if (!syncQueries) {
    console.error('[SYNC] Sync queries not initialized');
    return;
  }

  try {
    switch (event.type) {
      case 'new_message':
        const messageInserted = await syncQueries.insertMessage(event.payload);
        if (messageInserted) {
          // Get the full message data for IPC
          const messages = await syncQueries.getMessagesForChat(event.payload.chat_id, 1, 0);
          const fullMessage = messages.find(m => m.id === event.payload.id);
          if (fullMessage) {
            SyncIPCEmitter.emitMessageInserted(fullMessage);
          }
        }
        break;

      case 'chat_update':
        const chatUpdated = await syncQueries.upsertChat(event.payload);
        if (chatUpdated) {
          // Get full chat data for IPC
          const chats = await syncQueries.getAllChats();
          const fullChat = chats.find(c => c.id === event.payload.chat_id);
          if (fullChat) {
            SyncIPCEmitter.emitChatUpdated(fullChat);
          }
          SyncIPCEmitter.emitChatListUpdated();
        }
        break;

      default:
        console.warn('[SYNC] Unknown sync event type:', event.type);
    }
  } catch (error) {
    console.error('[SYNC] Failed to handle sync event:', error);
  }
}

/**
 * Get current WebSocket connection status
 */
function getConnectionStatus() {
  return wsClient?.getStatus() || { status: 'offline' as const };
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

app.whenReady().then(async () => {
  // Initialize database first
  initializeDatabase();
  
  // Initialize WebSocket sync
  await initializeWebSocketSync();
  
  // Register IPC handlers
  registerAuthIpcHandlers(ipcMain);
  registerMessageIpc();
  registerSyncIpc();
  registerChatsIpc(db);
  
  // Register sync IPC handlers
  if (syncQueries) {
    registerSyncIPCHandlers(syncQueries);
  }

  // Override connection status handler to provide real-time status
  ipcMain.handle('sync:get-connection-status', () => {
    return getConnectionStatus();
  });

  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', async () => {
  // Cleanup WebSocket connection
  if (wsClient) {
    await wsClient.disconnect();
    wsClient = null;
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async () => {
  // Ensure graceful shutdown
  if (wsClient) {
    await wsClient.disconnect();
  }
});