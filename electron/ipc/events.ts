// electron/ipc/events.ts
import { ipcMain, webContents } from 'electron';
import { z } from 'zod';

// IPC Event Names - typed and secure
export const IPC_EVENTS = {
  // Connection status events
  CONNECTION_STATUS: 'sync:connection-status',
  CONNECTION_CONNECTED: 'sync:connection-connected',
  CONNECTION_DISCONNECTED: 'sync:connection-disconnected',
  
  // Message events
  MESSAGE_INSERTED: 'sync:message-inserted',
  MESSAGE_UPDATED: 'sync:message-updated',
  MESSAGE_DELETED: 'sync:message-deleted',
  
  // Chat events
  CHAT_UPDATED: 'sync:chat-updated',
  CHAT_LIST_UPDATED: 'sync:chat-list-updated',
  
  // Request/response channels (for renderer to main)
  GET_CONNECTION_STATUS: 'sync:get-connection-status',
  GET_MESSAGES: 'sync:get-messages',
  GET_CHATS: 'sync:get-chats',
  MARK_MESSAGES_READ: 'sync:mark-messages-read',
  SEND_MESSAGE: 'sync:send-message',
} as const;

// Event payload schemas for validation
export const MessageInsertedPayloadSchema = z.object({
  id: z.string(),
  chat_id: z.string(),
  sender: z.string(),
  content: z.string(),
  timestamp: z.number(),
  is_read: z.boolean(),
  is_edited: z.boolean(),
});

export const ChatUpdatedPayloadSchema = z.object({
  id: z.string(),
  name: z.string(),
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
  // Get connection status - Note: This is handled by main.ts, so we skip registration here
  // ipcMain.handle(IPC_EVENTS.GET_CONNECTION_STATUS, () => {
  //   // This will be handled by the main sync service
  //   return { status: 'offline' }; // Default fallback
  // });

  // Get messages for a chat
  ipcMain.handle(IPC_EVENTS.GET_MESSAGES, async (event, { chatId, limit, offset }) => {
    try {
      if (!chatId) {
        throw new Error('chatId is required');
      }
      
      const messages = await syncQueries.getMessagesForChat(
        chatId, 
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
      const chats = await syncQueries.getAllChats();
      return { success: true, data: chats };
    } catch (error) {
      console.error('[IPC] Get chats failed:', error);
      return { success: false, error: 'Failed to get chats' };
    }
  });

  // Mark messages as read
  ipcMain.handle(IPC_EVENTS.MARK_MESSAGES_READ, async (event, { chatId }) => {
    try {
      if (!chatId) {
        throw new Error('chatId is required');
      }
      
      const count = await syncQueries.markMessagesAsRead(chatId);
      return { success: true, data: { markedCount: count } };
    } catch (error) {
      console.error('[IPC] Mark messages read failed:', error);
      return { success: false, error: 'Failed to mark messages as read' };
    }
  });

  // Send message (outgoing)
  ipcMain.handle(IPC_EVENTS.SEND_MESSAGE, async (event, { chatId, content }) => {
    try {
      if (!chatId || !content) {
        throw new Error('chatId and content are required');
      }
      
      // Create message object
      const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        chat_id: chatId,
        sender: 'You',
        content,
        timestamp: Date.now(),
        is_read: true,
        is_edited: false,
      };
      
      // Insert into database
      const inserted = await syncQueries.insertMessage(message);
      
      if (inserted) {
        // Emit to renderer
        SyncIPCEmitter.emitMessageInserted(message);
        return { success: true, data: message };
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
