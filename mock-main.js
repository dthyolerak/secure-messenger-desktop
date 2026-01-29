// Mock main process for testing UI components
const { app, BrowserWindow, ipcMain } = eval('require')('electron');
const path = require('path');

// Mock database data
const mockChats = [
  { id: 'chat1', name: 'Alice Johnson', type: 'direct', last_message: 'Hey, how are you?', updated_at: Date.now() - 1000 * 60, unread_count: 2 },
  { id: 'chat2', name: 'Bob Smith', type: 'direct', last_message: 'Meeting at 3pm today', updated_at: Date.now() - 1000 * 60 * 5, unread_count: 0 },
  { id: 'chat3', name: 'Team Chat', type: 'group', last_message: 'Great work on the project!', updated_at: Date.now() - 1000 * 60 * 15, unread_count: 5 },
  { id: 'chat4', name: 'Carol White', type: 'direct', last_message: 'Thanks for your help', updated_at: Date.now() - 1000 * 60 * 30, unread_count: 1 },
  { id: 'chat5', name: 'David Brown', type: 'direct', last_message: 'Can you review this?', updated_at: Date.now() - 1000 * 60 * 60, unread_count: 0 },
];

const mockMessages = {
  chat1: [
    { id: 'msg1', chat_id: 'chat1', sender: 'Alice Johnson', content: 'Hey, how are you?', timestamp: Date.now() - 1000 * 60 * 2 },
    { id: 'msg2', chat_id: 'chat1', sender: 'You', content: 'I\'m doing great, thanks!', timestamp: Date.now() - 1000 * 60 },
  ],
  chat2: [
    { id: 'msg3', chat_id: 'chat2', sender: 'Bob Smith', content: 'Meeting at 3pm today', timestamp: Date.now() - 1000 * 60 * 5 },
  ],
};

// Mock IPC handlers
ipcMain.handle('sync:get-chats', async () => {
  console.log('Mock: Getting chats');
  return { success: true, data: { chats: mockChats, total: mockChats.length, hasMore: false } };
});

ipcMain.handle('sync:get-messages', async (event, { chatId }) => {
  console.log('Mock: Getting messages for chat:', chatId);
  const messages = mockMessages[chatId] || [];
  return { success: true, data: messages };
});

ipcMain.handle('sync:send-message', async (event, { chatId, senderId, content }) => {
  console.log('Mock: Sending message to chat:', chatId, content);
  const newMessage = {
    id: `msg_${Date.now()}`,
    chat_id: chatId,
    sender: 'You',
    content,
    timestamp: Date.now(),
  };
  
  if (!mockMessages[chatId]) {
    mockMessages[chatId] = [];
  }
  mockMessages[chatId].push(newMessage);
  
  return { success: true, data: newMessage };
});

ipcMain.handle('sync:get-current-user-id', async () => {
  return 'current_user';
});

ipcMain.handle('sync:add-message-attachment', async (event, { messageId, filename, fileUrl, fileType, fileSize }) => {
  console.log('Mock: Adding attachment:', filename);
  return { success: true, data: { id: `att_${Date.now()}`, filename, fileUrl } };
});

ipcMain.handle('sync:get-message-attachments', async (event, { messageId }) => {
  console.log('Mock: Getting attachments for message:', messageId);
  return { success: true, data: [] };
});

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'dist', 'electron', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the built HTML file
  mainWindow.loadFile(path.join(__dirname, 'dist', 'src', 'index.html'));

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  console.log('Mock main window created');
}

app.whenReady().then(() => {
  console.log('Mock app ready');
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

console.log('Mock main process started');
