// electron/ipc/events.ts
import { ipcMain, webContents, Notification, BrowserWindow } from 'electron';
import { z } from 'zod';

// IPC event names for sync operations
export const IPC_EVENTS = {
  // Connection status
  GET_CONNECTION_STATUS: 'sync:get-connection-status',
  
  // Messages
  GET_MESSAGES: 'sync:get-messages',
  SEND_MESSAGE: 'sync:send-message',
  MARK_MESSAGES_READ: 'sync:mark-messages-read',
  
  // Chats
  GET_CHATS: 'sync:get-chats',
  GET_USER_CHATS: 'sync:get-user-chats',
  
  // Users
  GET_OR_CREATE_USER: 'sync:get-or-create-user',
  GET_OR_CREATE_DIRECT_CHAT: 'sync:get-or-create-direct-chat',
  
  // File attachments
  ADD_MESSAGE_ATTACHMENT: 'sync:add-message-attachment',
  GET_MESSAGE_ATTACHMENTS: 'sync:get-message-attachments',
  
  // Events (emitted from main to renderer)
  CONNECTION_STATUS: 'sync:connection-status',
  CONNECTION_CONNECTED: 'sync:connection-connected',
  CONNECTION_DISCONNECTED: 'sync:connection-disconnected',
  MESSAGE_INSERTED: 'sync:message-inserted',
  MESSAGE_UPDATED: 'sync:message-updated',
  MESSAGE_DELETED: 'sync:message-deleted',
  CHAT_UPDATED: 'sync:chat-updated',
  CHAT_LIST_UPDATED: 'sync:chat-list-updated',
} as const;

// Event payload schemas for validation
export const MessageInsertedPayloadSchema = z.object({
  id: z.string(),
  chat_id: z.string(),
  sender_id: z.string(),
  sender_name: z.string(),
  content: z.string(),
  timestamp: z.number(),
  is_read: z.boolean(),
  is_edited: z.boolean(),
});

export const ChatUpdatedPayloadSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  last_message: z.string().optional(),
  updated_at: z.number(),
  unread_count: z.number(),
});

export const ConnectionStatusPayloadSchema = z.object({
  status: z.enum(['connected', 'reconnecting', 'offline']),
  lastConnected: z.number().optional(),
  reconnectAttempts: z.number().optional(),
});

/**
 * Secure IPC event emitter - only emits validated data
 */
export class SyncIPCEmitter {
  /**
   * Show desktop notification for new message
   */
  static showDesktopNotification(chatName: string, senderName: string, content: string, chatId: string): void {
    try {
      if (!Notification.isSupported()) {
        console.log('[IPC] Desktop notifications not supported');
        return;
      }

      const notification = new Notification({
        title: `New message from ${senderName}`,
        body: `${chatName}: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`,
        silent: false,
        icon: undefined, // Could add app icon here
      });

      // Handle notification click
      notification.on('click', () => {
        // Focus the main window and emit event to open chat
        const windows = BrowserWindow.getAllWindows();
        if (windows.length > 0) {
          const mainWindow = windows[0];
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
            // Send event to renderer to open the specific chat
            mainWindow.webContents.send('sync:open-chat', { chatId });
          }
        }
        notification.close();
      });

      notification.show();
      console.log(`[IPC] Desktop notification shown for chat ${chatId}`);
    } catch (error) {
      console.error('[IPC] Failed to show desktop notification:', error);
    }
  }

  /**
   * Emit message inserted event to all renderer windows
   */
  static emitMessageInserted(message: unknown): void {
    try {
      const validated = MessageInsertedPayloadSchema.parse(message);
      
      // Send to all renderer windows
      webContents.getAllWebContents().forEach(contents => {
        contents.send(IPC_EVENTS.MESSAGE_INSERTED, validated);
      });
      
      console.log(`[IPC] Message inserted event sent: ${validated.id}`);
    } catch (error) {
      console.error('[IPC] Failed to emit message inserted:', error);
    }
  }

  /**
   * Emit chat updated event to all renderer windows
   */
  static emitChatUpdated(chat: unknown): void {
    try {
      const validated = ChatUpdatedPayloadSchema.parse(chat);
      
      webContents.getAllWebContents().forEach(contents => {
        contents.send(IPC_EVENTS.CHAT_UPDATED, validated);
      });
      
      console.log(`[IPC] Chat updated event sent: ${validated.id}`);
    } catch (error) {
      console.error('[IPC] Failed to emit chat updated:', error);
    }
  }

  /**
   * Emit connection status change to all renderer windows
   */
  static emitConnectionStatus(status: unknown): void {
    try {
      const validated = ConnectionStatusPayloadSchema.parse(status);
      
      webContents.getAllWebContents().forEach(contents => {
        contents.send(IPC_EVENTS.CONNECTION_STATUS, validated);
      });
      
      console.log(`[IPC] Connection status event sent: ${validated.status}`);
    } catch (error) {
      console.error('[IPC] Failed to emit connection status:', error);
    }
  }

  /**
   * Emit connection established event
   */
  static emitConnectionConnected(): void {
    webContents.getAllWebContents().forEach(contents => {
      contents.send(IPC_EVENTS.CONNECTION_CONNECTED);
    });
    
    console.log('[IPC] Connection connected event sent');
  }

  /**
   * Emit connection lost event
   */
  static emitConnectionDisconnected(): void {
    webContents.getAllWebContents().forEach(contents => {
      contents.send(IPC_EVENTS.CONNECTION_DISCONNECTED);
    });
    
    console.log('[IPC] Connection disconnected event sent');
  }

  /**
   * Emit chat list updated event (when multiple chats change)
   */
  static emitChatListUpdated(): void {
    webContents.getAllWebContents().forEach(contents => {
      contents.send(IPC_EVENTS.CHAT_LIST_UPDATED);
    });
    
    console.log('[IPC] Chat list updated event sent');
  }

  /**
   * Emit message updated event
   */
  static emitMessageUpdated(messageId: string, content: string): void {
    const payload = { messageId, content };
    
    webContents.getAllWebContents().forEach(contents => {
      contents.send(IPC_EVENTS.MESSAGE_UPDATED, payload);
    });
    
    console.log(`[IPC] Message updated event sent: ${messageId}`);
  }

  /**
   * Emit message deleted event
   */
  static emitMessageDeleted(messageId: string): void {
    webContents.getAllWebContents().forEach(contents => {
      contents.send(IPC_EVENTS.MESSAGE_DELETED, { messageId });
    });
    
    console.log(`[IPC] Message deleted event sent: ${messageId}`);
  }
}

/**
 * Register IPC handlers for renderer requests
 */
export function registerSyncIPCHandlers(syncQueries: any): void {
  // Get messages for a chat
  ipcMain.handle(IPC_EVENTS.GET_MESSAGES, async (event, { chatId, userId, limit, offset }) => {
    try {
      if (!chatId || !userId) {
        throw new Error('chatId and userId are required');
      }
      
      const messages = await syncQueries.getMessagesForChat(
        chatId, 
        userId,
        limit || 50, 
        offset || 0
      );
      
      return { success: true, data: messages };
    } catch (error) {
      console.error('[IPC] Get messages failed:', error);
      return { success: false, error: 'Failed to get messages' };
    }
  });

  // Get all chats
  ipcMain.handle(IPC_EVENTS.GET_CHATS, async () => {
    try {
      console.log('[IPC] Getting all chats...');
      console.log('[IPC] SyncQueries available:', !!syncQueries);
      
      if (!syncQueries) {
        console.error('[IPC] SyncQueries not initialized');
        return { success: false, error: 'Database not initialized' };
      }
      
      const chats = await syncQueries.getAllChats();
      console.log(`[IPC] Retrieved ${chats.length} chats from database`);
      
      // If no chats, return empty response with proper structure
      if (chats.length === 0) {
        console.log('[IPC] No chats found, returning empty response');
        return { 
          success: true, 
          data: {
            chats: [],
            total: 0,
            hasMore: false
          }
        };
      }
      
      const response = { 
        success: true, 
        data: {
          chats: chats.map((chat: any) => ({
            id: chat.id,
            name: chat.name,
            last_message: chat.last_message,
            updated_at: chat.updated_at,
            unread_count: chat.unread_count || 0,
          })),
          total: chats.length,
          hasMore: false
        }
      };
      
      console.log('[IPC] Sending response:', JSON.stringify(response, null, 2));
      return response;
    } catch (error) {
      console.error('[IPC] Get chats failed:', error);
      console.error('[IPC] Error details:', error instanceof Error ? error.stack : String(error));
      return { success: false, error: 'Failed to get chats' };
    }
  });

  // Get user chats
  ipcMain.handle(IPC_EVENTS.GET_USER_CHATS, async (event, { userId }) => {
    try {
      if (!userId) {
        throw new Error('userId is required');
      }
      
      const chats = await syncQueries.getUserChats(userId);
      return { success: true, data: chats };
    } catch (error) {
      console.error('[IPC] Get user chats failed:', error);
      return { success: false, error: 'Failed to get user chats' };
    }
  });

  // Add message attachment
  ipcMain.handle(IPC_EVENTS.ADD_MESSAGE_ATTACHMENT, async (event, { messageId, filename, fileUrl, fileType, fileSize }) => {
    try {
      if (!messageId || !filename || !fileUrl || !fileType) {
        throw new Error('messageId, filename, fileUrl, and fileType are required');
      }
      
      const success = await syncQueries.addMessageAttachment(messageId, filename, fileUrl, fileType, fileSize);
      return { success, error: success ? null : 'Failed to add attachment' };
    } catch (error) {
      console.error('[IPC] Add message attachment failed:', error);
      return { success: false, error: 'Failed to add message attachment' };
    }
  });

  // Get message attachments
  ipcMain.handle(IPC_EVENTS.GET_MESSAGE_ATTACHMENTS, async (event, { messageId }) => {
    try {
      if (!messageId) {
        throw new Error('messageId is required');
      }
      
      const attachments = await syncQueries.getMessageAttachments(messageId);
      return { success: true, data: attachments };
    } catch (error) {
      console.error('[IPC] Get message attachments failed:', error);
      return { success: false, error: 'Failed to get message attachments' };
    }
  });

  // Get or create user
  ipcMain.handle(IPC_EVENTS.GET_OR_CREATE_USER, async (event, { email, displayName }) => {
    try {
      if (!email || !displayName) {
        throw new Error('email and displayName are required');
      }
      
      const user = await syncQueries.getOrCreateUser(email, displayName);
      return { success: true, data: user };
    } catch (error) {
      console.error('[IPC] Get or create user failed:', error);
      return { success: false, error: 'Failed to get or create user' };
    }
  });

  // Get or create direct chat
  ipcMain.handle(IPC_EVENTS.GET_OR_CREATE_DIRECT_CHAT, async (event, { userId1, userId2 }) => {
    try {
      if (!userId1 || !userId2) {
        throw new Error('userId1 and userId2 are required');
      }
      
      const chat = await syncQueries.getOrCreateDirectChat(userId1, userId2);
      return { success: true, data: chat };
    } catch (error) {
      console.error('[IPC] Get or create direct chat failed:', error);
      return { success: false, error: 'Failed to get or create direct chat' };
    }
  });

  // Mark messages as read
  ipcMain.handle(IPC_EVENTS.MARK_MESSAGES_READ, async (event, { chatId, userId }) => {
    try {
      if (!chatId || !userId) {
        throw new Error('chatId and userId are required');
      }
      
      const count = await syncQueries.markMessagesAsRead(chatId, userId);
      
      // After marking messages as read, emit chat update to refresh UI
      const chats = await syncQueries.getUserChats(userId);
      const updatedChat = chats.find((c: any) => c.id === chatId);
      if (updatedChat) {
        SyncIPCEmitter.emitChatUpdated(updatedChat);
      }
      
      return { success: true, data: { markedCount: count } };
    } catch (error) {
      console.error('[IPC] Mark messages read failed:', error);
      return { success: false, error: 'Failed to mark messages as read' };
    }
  });

  // Send message (outgoing)
  ipcMain.handle(IPC_EVENTS.SEND_MESSAGE, async (event, { chatId, senderId, content }) => {
    try {
      if (!chatId || !senderId || !content) {
        throw new Error('chatId, senderId, and content are required');
      }
      
      // Send message and persist to database
      const message = await syncQueries.sendMessage(chatId, senderId, content);
      
      if (message) {
        // Get sender info for the message
        const sender = await syncQueries.getUserById(senderId);
        const messageWithSender = {
          ...message,
          sender_name: sender?.display_name || 'Unknown',
          is_read: true, // Sender's messages are always read by them
        };
        
        // Emit to renderer
        SyncIPCEmitter.emitMessageInserted(messageWithSender);
        return { success: true, data: messageWithSender };
      } else {
        return { success: false, error: 'Failed to send message' };
      }
    } catch (error) {
      console.error('[IPC] Send message failed:', error);
      return { success: false, error: 'Failed to send message' };
    }
  });

  console.log('[IPC] Sync IPC handlers registered');
}
