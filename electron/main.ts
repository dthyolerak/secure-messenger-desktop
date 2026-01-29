// electron/main.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { registerAuthIpcHandlers } from '../src/domains/auth/auth.ipc.js';
import { registerMessageIpc } from '../src/domains/messages/messages.ipc.js';
import { registerSyncIpc } from '../src/domains/sync/sync.ipc.js';
import { registerChatsIpc } from '../src/domains/chats/chats.ipc.js';
import { WebSocketClient } from './wsClient';
import { SyncQueries } from './db/queries';
import { SyncIPCEmitter, registerSyncIPCHandlers } from './ipc/events';

// Initialize SQLite database
let db: any = null;
let wsClient: WebSocketClient | null = null;
let syncQueries: SyncQueries | null = null;
let currentUserId: string | null = null;

function initializeDatabase(): void {
  try {
    // Use dynamic import to avoid bundling issues
    const Database = eval('require')('better-sqlite3');
    db = new Database('chats.db');
    
    // Check if messages table exists and has the correct schema for multi-user support
    const tableInfo = db.prepare(`
      SELECT sql FROM sqlite_master 
      WHERE type='table' AND name='messages'
    `).get() as { sql: string } | undefined;
    
    if (tableInfo && (!tableInfo.sql.includes('sender_id TEXT') || !tableInfo.sql.includes('chat_participants'))) {
      console.log('[DB] Messages table missing multi-user schema, migrating...');
      // Create new tables with proper schema
      db.exec('DROP TABLE IF EXISTS messages');
      db.exec('DROP TABLE IF EXISTS chats');
      db.exec('DROP TABLE IF EXISTS chat_participants');
      db.exec('DROP TABLE IF EXISTS message_reads');
      console.log('[DB] Dropped old tables for migration');
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
        type TEXT NOT NULL DEFAULT 'direct', 
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS chat_participants (
        id TEXT PRIMARY KEY,
        chat_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        joined_at INTEGER NOT NULL,
        last_read_at INTEGER DEFAULT 0,
        FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE(chat_id, user_id)
      );
      
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        chat_id TEXT NOT NULL,
        sender_id TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        is_edited INTEGER DEFAULT 0,
        deleted_at INTEGER DEFAULT 0,
        FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE
      );
      
      CREATE TABLE IF NOT EXISTS message_reads (
        id TEXT PRIMARY KEY,
        message_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        read_at INTEGER NOT NULL,
        FOREIGN KEY (message_id) REFERENCES messages (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE(message_id, user_id)
      );
      
      CREATE TABLE IF NOT EXISTS message_attachments (
        id TEXT PRIMARY KEY,
        message_id TEXT NOT NULL,
        filename TEXT NOT NULL,
        file_url TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        uploaded_at INTEGER NOT NULL,
        FOREIGN KEY (message_id) REFERENCES messages (id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at DESC);
      CREATE INDEX IF NOT EXISTS idx_messages_chat_timestamp ON messages(chat_id, timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_chat_participants_chat_id ON chat_participants(chat_id);
      CREATE INDEX IF NOT EXISTS idx_chat_participants_user_id ON chat_participants(user_id);
      CREATE INDEX IF NOT EXISTS idx_message_reads_message_id ON message_reads(message_id);
      CREATE INDEX IF NOT EXISTS idx_message_reads_user_id ON message_reads(user_id);
      CREATE INDEX IF NOT EXISTS idx_message_attachments_message_id ON message_attachments(message_id);
    `);
    
    // Insert demo data
    const chatCount = db.prepare('SELECT COUNT(*) as count FROM chats').get() as { count: number };
    console.log(`[DB] Current chat count: ${chatCount.count}`);
    
    if (chatCount.count === 0) {
      console.log('[DB] Inserting demo data...');
      // Insert demo users first
      const insertUser = db.prepare(`
        INSERT INTO users (id, email, display_name, password_hash, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      const demoUsers = [
        ['user1', 'alice@example.com', 'Alice Johnson', 'hash1', Date.now() - 86400000, Date.now() - 86400000],
        ['user2', 'bob@example.com', 'Bob Smith', 'hash2', Date.now() - 86400000, Date.now() - 86400000],
        ['user3', 'carol@example.com', 'Carol White', 'hash3', Date.now() - 86400000, Date.now() - 86400000],
        ['user4', 'david@example.com', 'David Brown', 'hash4', Date.now() - 86400000, Date.now() - 86400000],
        ['user5', 'emma@example.com', 'Emma Davis', 'hash5', Date.now() - 86400000, Date.now() - 86400000],
        ['user6', 'frank@example.com', 'Frank Miller', 'hash6', Date.now() - 86400000, Date.now() - 86400000],
        ['user7', 'grace@example.com', 'Grace Wilson', 'hash7', Date.now() - 86400000, Date.now() - 86400000],
        ['user8', 'henry@example.com', 'Henry Moore', 'hash8', Date.now() - 86400000, Date.now() - 86400000],
        ['user9', 'ivy@example.com', 'Ivy Chen', 'hash9', Date.now() - 86400000, Date.now() - 86400000],
        ['user10', 'jack@example.com', 'Jack Taylor', 'hash10', Date.now() - 86400000, Date.now() - 86400000],
        ['user11', 'kate@example.com', 'Kate Anderson', 'hash11', Date.now() - 86400000, Date.now() - 86400000],
        ['user12', 'liam@example.com', 'Liam Thomas', 'hash12', Date.now() - 86400000, Date.now() - 86400000],
        ['user13', 'mia@example.com', 'Mia Jackson', 'hash13', Date.now() - 86400000, Date.now() - 86400000],
        ['user14', 'noah@example.com', 'Noah White', 'hash14', Date.now() - 86400000, Date.now() - 86400000],
        ['user15', 'olivia@example.com', 'Olivia Harris', 'hash15', Date.now() - 86400000, Date.now() - 86400000],
        ['user16', 'peter@example.com', 'Peter Martin', 'hash16', Date.now() - 86400000, Date.now() - 86400000],
        ['user17', 'quinn@example.com', 'Quinn Lee', 'hash17', Date.now() - 86400000, Date.now() - 86400000],
        ['user18', 'rachel@example.com', 'Rachel Clark', 'hash18', Date.now() - 86400000, Date.now() - 86400000],
        ['user19', 'sam@example.com', 'Sam Lewis', 'hash19', Date.now() - 86400000, Date.now() - 86400000],
        ['user20', 'tina@example.com', 'Tina Walker', 'hash20', Date.now() - 86400000, Date.now() - 86400000],
        ['current_user', 'user@example.com', 'You', 'hash_current', Date.now() - 86400000, Date.now() - 86400000],
      ];
      
      demoUsers.forEach(user => {
        console.log(`[DB] Inserting user: ${user[1]}`);
        insertUser.run(...user);
      });
      
      // Insert demo chats
      const insertChat = db.prepare(`
        INSERT INTO chats (id, name, type, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      const demoChats = [
        ['chat1', 'Alice Johnson', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60],
        ['chat2', 'Bob Smith', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 5],
        ['chat3', 'Team Chat', 'group', Date.now() - 86400000, Date.now() - 1000 * 60 * 15],
        ['chat4', 'Carol White', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 30],
        ['chat5', 'David Brown', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 60],
        ['chat6', 'Emma Davis', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 120],
        ['chat7', 'Frank Miller', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 180],
        ['chat8', 'Grace Wilson', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 240],
        ['chat9', 'Henry Moore', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 300],
        ['chat10', 'Ivy Chen', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 360],
        ['chat11', 'Jack Taylor', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 420],
        ['chat12', 'Kate Anderson', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 480],
        ['chat13', 'Liam Thomas', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 540],
        ['chat14', 'Mia Jackson', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 600],
        ['chat15', 'Noah White', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 660],
        ['chat16', 'Olivia Harris', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 720],
        ['chat17', 'Peter Martin', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 780],
        ['chat18', 'Quinn Lee', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 840],
        ['chat19', 'Rachel Clark', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 900],
        ['chat20', 'Sam Lewis', 'direct', Date.now() - 86400000, Date.now() - 1000 * 60 * 960],
      ];
      
      demoChats.forEach(chat => {
        console.log(`[DB] Inserting chat: ${chat[1]}`);
        insertChat.run(...chat);
      });
      
      // Insert chat participants
      const insertParticipant = db.prepare(`
        INSERT INTO chat_participants (id, chat_id, user_id, joined_at, last_read_at)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      const participantId = 1;
      demoChats.forEach((chat, index) => {
        // Add current user to all chats
        insertParticipant.run(`p${participantId + index * 10}`, chat[0], 'current_user', Date.now() - 86400000, 0);
        
        // Add other participants for direct chats
        if (chat[2] === 'direct') {
          const otherUserId = `user${index + 1}`;
          insertParticipant.run(`p${participantId + index * 10 + 1}`, chat[0], otherUserId, Date.now() - 86400000, 0);
        } else {
          // Add all users to group chat
          for (let i = 1; i <= 4; i++) {
            insertParticipant.run(`p${participantId + index * 10 + i}`, chat[0], `user${i}`, Date.now() - 86400000, 0);
          }
        }
      });
      
      // Insert demo messages
      const insertMessage = db.prepare(`
        INSERT INTO messages (id, chat_id, sender_id, content, timestamp, is_edited, deleted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      // Generate messages for each chat
      const demoMessages: any[][] = [];
      const messageTemplates = [
        "Hey, how are you doing?",
        "Did you see the latest updates?",
        "Want to grab lunch later?",
        "Thanks for your help yesterday!",
        "Can you review this document?",
        "Meeting at 3pm today",
        "Great work on the project!",
        "Let's catch up soon",
        "Did you get my email?",
        "Happy Friday! ",
        "Quick question about the report",
        "See you tomorrow!",
        "That sounds perfect",
        "I'll send you the files",
        "Can we reschedule?",
        "Looking forward to it!",
        "Thanks for the quick response",
        "How's the new project going?",
        "Coffee break? ",
        "Have a great weekend!"
      ];
      
      demoChats.forEach((chat, chatIndex) => {
        const messageCount = Math.floor(Math.random() * 5) + 2; // 2-6 messages per chat
        for (let i = 0; i < messageCount; i++) {
          const isFromCurrentUser = Math.random() > 0.7; // 30% chance message is from current user
          const senderId = isFromCurrentUser ? 'current_user' : `user${chatIndex + 1}`;
          const timestamp = Date.now() - (1000 * 60 * (messageCount - i) * 30); // Spread messages over time
          
          demoMessages.push([
            `m${chatIndex}_${i}`,
            chat[0],
            senderId,
            messageTemplates[Math.floor(Math.random() * messageTemplates.length)],
            timestamp,
            0,
            0
          ]);
        }
      });
      
      demoMessages.forEach(msg => {
        insertMessage.run(...msg);
      });
      
      // Insert some message reads for demo
      const insertMessageRead = db.prepare(`
        INSERT INTO message_reads (id, message_id, user_id, read_at)
        VALUES (?, ?, ?, ?)
      `);
      
      // Mark some messages as read by current user
      demoMessages.forEach((msg, index) => {
        if (msg[2] !== 'current_user' && Math.random() > 0.5) { // 50% chance of reading other's messages
          insertMessageRead.run(
            `mr_${msg[0]}_current_user`,
            msg[0],
            'current_user',
            msg[4] + 1000 * 60 // Read 1 minute after message
          );
        }
      });
      
      console.log('[DB] Demo data insertion completed');
    } else {
      console.log('[DB] Demo data already exists');
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
          // Get the full message data with sender info
          const messages = await syncQueries.getMessagesForChat(event.payload.chat_id, currentUserId || 'current_user', 1, 0);
          const fullMessage = messages.find((m: any) => m.id === event.payload.id);
          
          if (fullMessage) {
            // Get chat info for notification
            const chats = await syncQueries.getUserChats(currentUserId || 'current_user');
            const chatInfo = chats.find((c: any) => c.id === event.payload.chat_id);
            
            // Show desktop notification if message is from another user and user is not in the chat
            if (fullMessage.sender_id !== currentUserId && chatInfo) {
              SyncIPCEmitter.showDesktopNotification(
                chatInfo.name,
                fullMessage.sender_name,
                fullMessage.content,
                event.payload.chat_id
              );
            }
            
            // Emit to renderer with sender info
            const messageWithSender = {
              ...fullMessage,
              sender_name: fullMessage.sender_name,
              is_read: fullMessage.is_read === 1,
            };
            SyncIPCEmitter.emitMessageInserted(messageWithSender);
          }
          
          // Get updated chat data and emit chat update to trigger reordering
          const updatedChats = await syncQueries.getUserChats(currentUserId || 'current_user');
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
          const chats = await syncQueries.getUserChats(currentUserId || 'current_user');
          const fullChat = chats.find((c: any) => c.id === event.payload.chat_id);
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

// Set current user ID (for demo purposes)
currentUserId = 'current_user';

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

// Add handler to get current user ID
ipcMain.handle('sync:get-current-user-id', () => {
return currentUserId;
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