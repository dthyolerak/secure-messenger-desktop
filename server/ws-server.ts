// server/ws-server.ts
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';

console.log('[MOCK-SERVER] Starting server initialization...');

// Mock WebSocket server for sync simulation
export class MockSyncServer {
  private wss: WebSocketServer;
  private port: number;
  private messageInterval: NodeJS.Timeout | null = null;

  constructor(port: number = 8080) {
    this.port = port;
    
    // Create HTTP server for WebSocket upgrade
    const server = createServer();
    this.wss = new WebSocketServer({ server });
    
    this.setupEventHandlers();
    server.listen(port, () => {
      console.log(`[MOCK-SERVER] WebSocket server running on ws://localhost:${port}`);
    });
  }

  /**
   * Setup WebSocket server event handlers
   */
  private setupEventHandlers(): void {
    this.wss.on('connection', (ws: WebSocket, req) => {
      console.log(`[MOCK-SERVER] Client connected from ${req.socket.remoteAddress}`);
      
      // Send initial connection confirmation
      this.sendEvent(ws, {
        type: 'chat_update',
        payload: {
          chat_id: 'system',
          name: 'System',
          updated_at: Date.now(),
        }
      });

      // Handle client messages
      ws.on('message', (data: WebSocket.Data) => {
        try {
          const message = JSON.parse(data.toString());
          console.log(`[MOCK-SERVER] Received from client:`, message);
          this.handleClientMessage(ws, message);
        } catch (error) {
          console.error('[MOCK-SERVER] Failed to parse client message:', error);
        }
      });

      // Handle client disconnect
      ws.on('close', (code: number, reason: string) => {
        console.log(`[MOCK-SERVER] Client disconnected: ${code} - ${reason}`);
      });

      // Handle errors
      ws.on('error', (error: Error) => {
        console.error('[MOCK-SERVER] WebSocket error:', error);
      });

      // Respond to ping with pong
      ws.on('ping', () => {
        ws.pong();
      });
    });
  }

  /**
   * Handle incoming messages from clients
   */
  private handleClientMessage(ws: WebSocket, message: any): void {
    // Echo back client messages for testing
    if (message.type === 'client_message') {
      console.log(`[MOCK-SERVER] Echoing client message:`, message.payload);
      this.sendEvent(ws, {
        type: 'new_message',
        payload: {
          ...message.payload,
          timestamp: Date.now(),
        }
      });
    }
  }

  /**
   * Send event to specific client
   */
  private sendEvent(ws: WebSocket, event: any): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(event));
    }
  }

  /**
   * Broadcast event to all connected clients
   */
  private broadcastEvent(event: any): void {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(event));
      }
    });
  }

  /**
   * Start sending mock messages for testing
   */
  startMockMessages(): void {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
    }

    let messageCounter = 1;
    
    this.messageInterval = setInterval(() => {
      const mockEvents = [
        {
          type: 'new_message',
          payload: {
            id: `mock_msg_${Date.now()}_${messageCounter++}`,
            chat_id: '1',
            sender: 'Alice Johnson',
            content: [
              'How are you doing?',
              'Did you see the latest updates?',
              'Let me know when you\'re free',
              'Great to hear from you!',
              'Looking forward to our chat'
            ][Math.floor(Math.random() * 5)],
            timestamp: Date.now(),
          }
        },
        {
          type: 'new_message',
          payload: {
            id: `mock_msg_${Date.now()}_${messageCounter++}`,
            chat_id: '3',
            sender: 'Carol',
            content: [
              'Team meeting reminder',
              'Don\'t forget the deadline',
              'Great work everyone!',
              'Updated project status',
              'New requirements added'
            ][Math.floor(Math.random() * 5)],
            timestamp: Date.now(),
          }
        },
        {
          type: 'chat_update',
          payload: {
            chat_id: '2',
            name: 'Bob Smith',
            unread_count: Math.floor(Math.random() * 3) + 1,
            updated_at: Date.now(),
          }
        }
      ];

      const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
      this.broadcastEvent(randomEvent);
      
      console.log(`[MOCK-SERVER] Sent mock event:`, randomEvent.type);
    }, 15000); // Every 15 seconds
  }

  /**
   * Stop mock messages
   */
  stopMockMessages(): void {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
      this.messageInterval = null;
      console.log('[MOCK-SERVER] Stopped mock messages');
    }
  }

  /**
   * Send a specific message immediately
   */
  sendMessage(chatId: string, sender: string, content: string): void {
    const event = {
      type: 'new_message',
      payload: {
        id: `manual_msg_${Date.now()}`,
        chat_id: chatId,
        sender,
        content,
        timestamp: Date.now(),
      }
    };
    
    this.broadcastEvent(event);
    console.log(`[MOCK-SERVER] Sent manual message:`, event);
  }

  /**
   * Update chat information
   */
  updateChat(chatId: string, updates: Partial<{name: string, unread_count: number}>): void {
    const event = {
      type: 'chat_update',
      payload: {
        chat_id: chatId,
        updated_at: Date.now(),
        ...updates,
      }
    };
    
    this.broadcastEvent(event);
    console.log(`[MOCK-SERVER] Sent chat update:`, event);
  }

  /**
   * Get server statistics
   */
  getStats(): { connectedClients: number; port: number } {
    return {
      connectedClients: this.wss.clients.size,
      port: this.port,
    };
  }

  /**
   * Graceful shutdown
   */
  shutdown(): void {
    this.stopMockMessages();
    
    this.wss.clients.forEach((client) => {
      client.close(1000, 'Server shutting down');
    });
    
    this.wss.close(() => {
      console.log('[MOCK-SERVER] Server shutdown complete');
    });
  }
}

// Start server if this file is run directly
console.log('[MOCK-SERVER] File loaded, checking if main module...');
console.log('[MOCK-SERVER] import.meta.url:', import.meta.url);
console.log('[MOCK-SERVER] process.argv[1]:', process.argv[1]);

try {
  // Try multiple ways to detect if this is the main module
  const isMain = import.meta.url === `file://${process.argv[1]}` ||
                 import.meta.url.endsWith('/ws-server.ts') ||
                 process.argv[1].endsWith('ws-server.ts') ||
                 process.argv[1].includes('ws-server.ts');
  
  console.log('[MOCK-SERVER] isMain:', isMain);
  
  if (isMain) {
    console.log('[MOCK-SERVER] Starting server as main module...');
    const server = new MockSyncServer(8080);
    
    // Start mock messages after 5 seconds
    setTimeout(() => {
      server.startMockMessages();
      console.log('[MOCK-SERVER] Started automatic mock messages');
    }, 5000);

    // Example manual messages (uncomment to test)
    setTimeout(() => {
      server.sendMessage('1', 'Alice Johnson', 'This is a test message from the server!');
    }, 10000);

    setTimeout(() => {
      server.updateChat('4', { unread_count: 3 });
    }, 12000);

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n[MOCK-SERVER] Shutting down...');
      server.shutdown();
      process.exit(0);
    });

    console.log('[MOCK-SERVER] Server setup complete');
  } else {
    console.log('[MOCK-SERVER] File imported as module, not starting server');
  }
} catch (error) {
  console.error('[MOCK-SERVER] Error during initialization:', error);
}
