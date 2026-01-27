// electron/main.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { registerAuthIpcHandlers } from '../src/domains/auth/auth.ipc';
import { registerMessageIpc } from '../src/domains/messages/messages.ipc';
import { registerSyncIpc } from '../src/domains/sync/sync.ipc';

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
  registerAuthIpcHandlers(ipcMain);
  registerMessageIpc();
  registerSyncIpc();

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