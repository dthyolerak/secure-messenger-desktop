// electron/ipc/events.ts
import { ipcMain, webContents, Notification, BrowserWindow, dialog } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
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
  MESSAGE_REACTIONS_UPDATED: 'sync:message-reactions-updated',
  ATTACHMENT_UPLOAD_PROGRESS: 'sync:attachment-upload-progress',
  
  // Chat events
  CHAT_UPDATED: 'sync:chat-updated',
  CHAT_LIST_UPDATED: 'sync:chat-list-updated',
  
  // Request/response channels (for renderer to main)
  GET_CONNECTION_STATUS: 'sync:get-connection-status',
  GET_MESSAGES: 'sync:get-messages',
  GET_CHATS: 'sync:get-chats',
  MARK_MESSAGES_READ: 'sync:mark-messages-read',
  SEND_MESSAGE: 'sync:send-message',
  SEARCH_MESSAGES: 'sync:search-messages',
  SEARCH_CHATS: 'sync:search-chats',
  TOGGLE_REACTION: 'sync:toggle-reaction',
  SELECT_ATTACHMENT: 'sync:select-attachment',
} as const;

// Event payload schemas for validation
export const MessageInsertedPayloadSchema = z.object({
  id: z.string(),
  chat_id: z.string(),
  sender: z.string(),
  recipient: z.string(),
  content: z.string(),
  timestamp: z.number(),
  read_at: z.number().nullable().optional(),
  is_read: z.boolean().optional(),
  is_edited: z.boolean().optional(),
  type: z.enum(['text', 'image', 'file']).optional(),
  file_path: z.string().nullable().optional(),
  file_name: z.string().nullable().optional(),
  file_size: z.number().nullable().optional(),
  mime_type: z.string().nullable().optional(),
  reactions: z.array(z.object({
    emoji: z.string(),
    count: z.number(),
    reactedByCurrentUser: z.boolean(),
  })).optional(),
});

export const MessageReactionsUpdatedSchema = z.object({
  messageId: z.string(),
  reactions: z.array(z.object({
    emoji: z.string(),
    count: z.number(),
    reactedByCurrentUser: z.boolean(),
  })),
});

export const AttachmentUploadProgressSchema = z.object({
  messageId: z.string(),
  progress: z.number().min(0).max(100),
});

const SendMessageSchema = z.object({
  chatId: z.string(),
  content: z.string().optional(),
  sender: z.string(),
  recipient: z.string(),
  attachment: z
    .object({
      filePath: z.string(),
      fileName: z.string(),
      fileSize: z.number(),
      mimeType: z.string(),
      type: z.enum(['image', 'file']),
    })
    .optional(),
});

const SearchMessagesSchema = z.object({
  query: z.string(),
  currentUser: z.string().optional(),
  limit: z.number().int().min(1).max(200).optional(),
  offset: z.number().int().min(0).optional(),
});

const SearchChatsSchema = z.object({
  query: z.string(),
  limit: z.number().int().min(1).max(200).optional(),
  offset: z.number().int().min(0).optional(),
});

const ToggleReactionSchema = z.object({
  messageId: z.string(),
  userId: z.string(),
  emoji: z.string().min(1),
});

const MIME_TYPE_OVERRIDES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

function inferMimeType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  return MIME_TYPE_OVERRIDES[extension] ?? 'application/octet-stream';
}

function inferAttachmentType(mimeType: string): 'image' | 'file' {
  return mimeType.startsWith('image/') ? 'image' : 'file';
}

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
   * Emit message reactions updated event
   */
  static emitMessageReactionsUpdated(payload: unknown): void {
    try {
      const validated = MessageReactionsUpdatedSchema.parse(payload);

      webContents.getAllWebContents().forEach(contents => {
        contents.send(IPC_EVENTS.MESSAGE_REACTIONS_UPDATED, validated);
      });

      console.log(`[IPC] Message reactions updated event sent: ${validated.messageId}`);
    } catch (error) {
      console.error('[IPC] Failed to emit message reactions updated:', error);
    }
  }

  /**
   * Emit attachment upload progress
   */
  static emitAttachmentUploadProgress(payload: unknown): void {
    try {
      const validated = AttachmentUploadProgressSchema.parse(payload);

      webContents.getAllWebContents().forEach(contents => {
        contents.send(IPC_EVENTS.ATTACHMENT_UPLOAD_PROGRESS, validated);
      });
    } catch (error) {
      console.error('[IPC] Failed to emit attachment upload progress:', error);
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
    const payload = { messageId };
    
    webContents.getAllWebContents().forEach(contents => {
      contents.send(IPC_EVENTS.MESSAGE_DELETED, { messageId });
    });
    
    console.log(`[IPC] Message deleted event sent: ${messageId}`);
  }

  /**
   * Show desktop notification for new message
   */
  static showDesktopNotification(message: unknown, chatName: string): void {
    try {
      const validated = MessageInsertedPayloadSchema.parse(message);
      const previewText =
        validated.content?.trim() ||
        (validated.type === 'image'
          ? `📷 ${validated.file_name ?? 'Image'}`
          : validated.type === 'file'
            ? `📎 ${validated.file_name ?? 'Attachment'}`
            : '');
      
      // Only show notification for messages from other users to current user
      if (validated.recipient === 'You' && validated.sender !== 'You') {
        const notification = new Notification({
          title: validated.sender,
          body: previewText,
          subtitle: chatName,
          silent: false,
        });

        notification.on('click', () => {
          // Focus the main window and emit event to open the chat
          const windows = BrowserWindow.getAllWindows();
          if (windows.length > 0) {
            const mainWindow = windows[0];
            if (mainWindow) {
              mainWindow.show();
              mainWindow.focus();
              // Send IPC event to renderer to open the specific chat
              if (mainWindow.webContents) {
                mainWindow.webContents.send('sync:open-chat', validated.chat_id);
              }
            }
          }
        });

        notification.show();
        console.log(`[Notification] Desktop notification sent for message: ${validated.id}`);
      }
    } catch (error) {
      console.error('[Notification] Failed to show desktop notification:', error);
    }
  }
}

/**
 * Register IPC handlers for renderer requests
 */
export function registerSyncIPCHandlers(syncQueries: any): void {
  console.log('[IPC] Starting registration of sync IPC handlers...');
  
  if (!syncQueries) {
    console.error('[IPC] syncQueries parameter is null/undefined');
    return;
  }
  
  console.log('[IPC] syncQueries parameter is valid, registering handlers...');
  // Get connection status - Note: This is handled by main.ts, so we skip registration here
  // ipcMain.handle(IPC_EVENTS.GET_CONNECTION_STATUS, () => {
  //   // This will be handled by the main sync service
  //   return { status: 'offline' }; // Default fallback
  // });

  // Get messages for a chat
  ipcMain.handle(IPC_EVENTS.GET_MESSAGES, async (event, { chatId, limit, offset, currentUser }) => {
    console.log('[IPC] GET_MESSAGES handler called for chatId:', chatId);
    try {
      if (!chatId) {
        throw new Error('chatId is required');
      }
      
      const messages = await syncQueries.getMessagesForChat(
        chatId,
        limit || 50,
        offset || 0,
        currentUser
      );
      
      console.log('[IPC] GET_MESSAGES retrieved', messages.length, 'messages');
      return { success: true, data: messages };
    } catch (error) {
      console.error('[IPC] Get messages failed:', error);
      return { success: false, error: 'Failed to get messages' };
    }
  });
  console.log('[IPC] GET_MESSAGES handler registered');

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
  ipcMain.handle(IPC_EVENTS.MARK_MESSAGES_READ, async (event, { chatId, currentUser }) => {
    console.log('[IPC] MARK_MESSAGES_READ handler called for chatId:', chatId);
    try {
      if (!chatId) {
        throw new Error('chatId is required');
      }
      
      const count = await syncQueries.markMessagesAsRead(chatId, currentUser);
      console.log('[IPC] MARK_MESSAGES_READ marked', count, 'messages as read');
      
      // After marking messages as read, emit chat update to refresh UI
      const chats = await syncQueries.getAllChats();
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
  ipcMain.handle(IPC_EVENTS.SEND_MESSAGE, async (event, rawPayload) => {
    try {
      const parsed = SendMessageSchema.safeParse(rawPayload);
      if (!parsed.success) {
        throw new Error('Invalid send message payload');
      }

      const { chatId, content, sender, recipient, attachment } = parsed.data;
      if (!content?.trim() && !attachment) {
        throw new Error('Message content or attachment is required');
      }
      
      // Create message object
      const timestamp = Date.now();
      const messageType = attachment?.type ?? 'text';
      const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        chat_id: chatId,
        sender,
        recipient,
        content: content ?? '',
        timestamp,
        read_at: timestamp,
        is_edited: false,
        type: messageType,
        file_path: attachment?.filePath ?? null,
        file_name: attachment?.fileName ?? null,
        file_size: attachment?.fileSize ?? null,
        mime_type: attachment?.mimeType ?? null,
      };
      
      console.log('[IPC] Attempting to insert message:', message);

      if (attachment) {
        SyncIPCEmitter.emitAttachmentUploadProgress({ messageId: message.id, progress: 0 });
      }
      
      // Insert into database
      const inserted = await syncQueries.insertMessage(message, sender);
      
      console.log('[IPC] Message insert result:', inserted);
      
      if (inserted) {
        // Emit to renderer
        SyncIPCEmitter.emitMessageInserted(message);

        if (attachment) {
          SyncIPCEmitter.emitAttachmentUploadProgress({ messageId: message.id, progress: 100 });
        }
        
        // Get updated chat data and emit chat update to trigger reordering
        const chats = await syncQueries.getAllChats();
        const updatedChat = chats.find((c: any) => c.id === chatId);
        if (updatedChat) {
          SyncIPCEmitter.emitChatUpdated(updatedChat);
        }
        SyncIPCEmitter.emitChatListUpdated();
        
        console.log('[IPC] Message sent successfully:', message.id);
        return { success: true, data: message };
      } else {
        console.log('[IPC] Message insertion returned false - likely duplicate or validation failed');
        return { success: false, error: 'Failed to send message' };
      }
    } catch (error) {
      console.error('[IPC] Send message failed:', error);
      return { success: false, error: 'Failed to send message' };
    }
  });

  ipcMain.handle(IPC_EVENTS.SEARCH_MESSAGES, async (_event, rawPayload) => {
    try {
      const parsed = SearchMessagesSchema.safeParse(rawPayload);
      if (!parsed.success) {
        throw new Error('Invalid search messages payload');
      }

      const { query, currentUser, limit, offset } = parsed.data;
      const results = await syncQueries.searchMessages(
        query,
        currentUser || 'You',
        limit ?? 50,
        offset ?? 0
      );

      return { success: true, data: results };
    } catch (error) {
      console.error('[IPC] Search messages failed:', error);
      return { success: false, error: 'Failed to search messages' };
    }
  });

  ipcMain.handle(IPC_EVENTS.SEARCH_CHATS, async (_event, rawPayload) => {
    try {
      const parsed = SearchChatsSchema.safeParse(rawPayload);
      if (!parsed.success) {
        throw new Error('Invalid search chats payload');
      }

      const { query, limit, offset } = parsed.data;
      const results = await syncQueries.searchChats(query, limit ?? 50, offset ?? 0);
      return { success: true, data: results };
    } catch (error) {
      console.error('[IPC] Search chats failed:', error);
      return { success: false, error: 'Failed to search chats' };
    }
  });

  ipcMain.handle(IPC_EVENTS.TOGGLE_REACTION, async (_event, rawPayload) => {
    try {
      const parsed = ToggleReactionSchema.safeParse(rawPayload);
      if (!parsed.success) {
        throw new Error('Invalid toggle reaction payload');
      }

      const { messageId, userId, emoji } = parsed.data;
      const reactions = await syncQueries.toggleReaction(messageId, userId, emoji);
      SyncIPCEmitter.emitMessageReactionsUpdated({ messageId, reactions });
      return { success: true, data: { messageId, reactions } };
    } catch (error) {
      console.error('[IPC] Toggle reaction failed:', error);
      return { success: false, error: 'Failed to toggle reaction' };
    }
  });

  ipcMain.handle(IPC_EVENTS.SELECT_ATTACHMENT, async () => {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'] },
          { name: 'Documents', extensions: ['pdf', 'txt', 'doc', 'docx', 'xls', 'xlsx'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return { success: false, error: 'No file selected' };
      }

      const [filePath] = result.filePaths;
      if (!filePath) {
        return { success: false, error: 'No file selected' };
      }
      const fileName = path.basename(filePath);
      const stats = fs.statSync(filePath);
      const mimeType = inferMimeType(filePath);
      const type = inferAttachmentType(mimeType);

      return {
        success: true,
        data: {
          filePath,
          fileName,
          fileSize: stats.size,
          mimeType,
          type,
        },
      };
    } catch (error) {
      console.error('[IPC] Select attachment failed:', error);
      return { success: false, error: 'Failed to select attachment' };
    }
  });

  console.log('[IPC] Sync IPC handlers registered');
}
