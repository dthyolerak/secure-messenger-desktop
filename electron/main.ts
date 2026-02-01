// electron/main.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { registerAuthIpcHandlers } from '../src/domains/auth/auth.ipc';
import { registerMessageIpc } from '../src/domains/messages/messages.ipc';
import { registerSyncIpc } from '../src/domains/sync/sync.ipc';
import { registerChatsIpc } from '../src/domains/chats/chats.ipc';
import { WebSocketClient } from './wsClient';
import { SyncQueries } from './db/yqueries';
import { ensureMessageSchema } from './db/migrations';
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
    `);

    // Safe migration to ensure messages schema includes sender/recipient/read_at
    // (prior bug: recipient column missing in existing data).
    ensureMessageSchema(db, 'You');

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at DESC);
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
        INSERT INTO messages (id, chat_id, sender, recipient, content, timestamp, read_at, is_edited)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const now = Date.now();
      const demoMessages = [
        // Chat 1 messages (Alice Johnson)
        ['m1', '1', 'Alice Johnson', 'You', 'Hey, are you free later?', now - 1000 * 60 * 10, null, 0],
        ['m2', '1', 'You', 'Alice Johnson', 'Sure, what\'s up?', now - 1000 * 60 * 8, null, 0],
        ['m3', '1', 'Alice Johnson', 'You', 'Want to grab coffee?', now - 1000 * 60 * 5, null, 0],
        ['m4', '1', 'Alice Johnson', 'You', 'Hey, are you free later?', now - 1000 * 60, null, 0],
        // Chat 2 messages (Bob Smith)
        ['m5', '2', 'Bob Smith', 'You', 'Thanks for the help!', now - 1000 * 60 * 5, null, 0],
        // Chat 3 messages (Team Chat)
        ['m6', '3', 'Carol', 'Team Chat', 'Meeting at 3pm', now - 1000 * 60 * 15, null, 0],
        ['m7', '3', 'David', 'Team Chat', 'I\'ll be there', now - 1000 * 60 * 12, null, 0],
        ['m8', '3', 'You', 'Team Chat', 'Sounds good!', now - 1000 * 60 * 10, null, 0],
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
        if (!event.payload?.sender || !event.payload?.recipient) {
          console.error('[SYNC] new_message missing sender/recipient:', event.payload);
          return;
        }

        const currentUser = event.payload.recipient || 'You';
        const messageInserted = await syncQueries.insertMessage(event.payload, currentUser);
        
        if (messageInserted) {
          // Get the full message data for IPC
          const messages = await syncQueries.getMessagesForChat(event.payload.chat_id, 50, 0, currentUser);
          const fullMessage = messages.find((m: any) => m.id === event.payload.id);
          if (fullMessage) {
            SyncIPCEmitter.emitMessageInserted(fullMessage);
            
            // Show desktop notification for incoming messages
            const chats = await syncQueries.getAllChats();
            const chat = chats.find((c: any) => c.id === event.payload.chat_id);
            if (chat) {
              SyncIPCEmitter.showDesktopNotification(fullMessage, chat.name, currentUser);
            }
          }
          
          // Get updated chat data and emit chat update to trigger reordering
          const updatedChats = await syncQueries.getAllChats();
          const updatedChat = updatedChats.find((c: any) => c.id === event.payload.chat_id);
          if (updatedChat) {
            SyncIPCEmitter.emitChatUpdated(updatedChat);
          }
          SyncIPCEmitter.emitChatListUpdated();
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
      sandbox: true,
      webSecurity: true,
    },
  });

  // Point to your React entry HTML once bundled
  mainWindow.loadFile(path.join(__dirname, '..', 'src', 'index.html'));

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(async () => {
  if (process.platform === 'win32') {
    app.setAppUserModelId(app.getName());
  }
  // Initialize database first
  initializeDatabase();
  
  // Initialize WebSocket sync
  await initializeWebSocketSync();
  
  // Register IPC handlers
  registerAuthIpcHandlers(ipcMain);
  registerMessageIpc();
  registerSyncIpc();
  registerChatsIpc(db);
  
  // Register sync IPC handlers with fallback
  if (syncQueries) {
    console.log('[Main] Registering sync IPC handlers...');
    registerSyncIPCHandlers(syncQueries);
    console.log('[Main] Sync IPC handlers registered successfully');
  } else {
    console.warn('[Main] syncQueries is null, creating fallback...');
    // Create fallback syncQueries for basic functionality
    if (db) {
      syncQueries = new SyncQueries(db);
      console.log('[Main] Created fallback syncQueries, registering handlers...');
      registerSyncIPCHandlers(syncQueries);
      console.log('[Main] Fallback sync IPC handlers registered successfully');
    } else {
      console.error('[Main] Database is null - cannot create fallback syncQueries');
    }
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