// electron/wsClient.ts
import { EventEmitter } from 'events';

// Use Node.js built-in WebSocket for Electron main process
const WebSocket = eval('require')('ws');

export interface ConnectionStatus {
  status: 'connected' | 'reconnecting' | 'offline';
  lastConnected?: number;
  reconnectAttempts?: number;
}

export interface MessageEvent {
  id: string;
  chat_id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: number;
  read_at?: number | null;
  is_edited?: boolean;
}

export interface ChatUpdateEvent {
  chat_id: string;
  name?: string;
  unread_count?: number;
  last_message?: string;
  updated_at: number;
}

export interface SyncEvent {
  type: 'new_message' | 'chat_update';
  payload: MessageEvent | ChatUpdateEvent;
}

export class WebSocketClient extends EventEmitter {
  private ws: any = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pongTimeout: NodeJS.Timeout | null = null;
  
  private readonly config = {
    url: process.env.WS_URL || 'ws://localhost:8080',
    heartbeatInterval: 30000, // 30 seconds
    pongTimeout: 5000, // 5 seconds
    reconnectBaseDelay: 1000, // 1 second
    reconnectMaxDelay: 30000, // 30 seconds
    maxReconnectAttempts: 10,
  };

  private status: ConnectionStatus = {
    status: 'offline',
    reconnectAttempts: 0,
  };

  private isShuttingDown = false;

  constructor() {
    super();
  }

  /**
   * Start WebSocket connection with automatic reconnect
   */
  async connect(): Promise<void> {
    if (this.isShuttingDown) return;

    console.log(`[WS] Connecting to ${this.config.url}`);
    
    try {
      this.ws = new WebSocket(this.config.url);
      this.setupEventHandlers();
      
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);

        this.ws!.on('open', () => {
          clearTimeout(timeout);
          resolve();
        });

        this.ws!.on('error', (error: any) => {
          clearTimeout(timeout);
          reject(error);
        });
      });
    } catch (error) {
      console.error('[WS] Connection failed:', error);
      this.handleConnectionLost();
      throw error;
    }
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.on('open', () => {
      console.log('[WS] Connected successfully');
      this.updateStatus({ status: 'connected', lastConnected: Date.now(), reconnectAttempts: 0 });
      this.startHeartbeat();
      this.emit('connected');
    });

    this.ws.on('message', (data: any) => {
      try {
        const event: SyncEvent = JSON.parse(data.toString());
        this.handleIncomingEvent(event);
      } catch (error) {
        console.error('[WS] Failed to parse message:', error);
      }
    });

    this.ws.on('close', (code: number, reason: Buffer) => {
      console.log(`[WS] Connection closed: ${code} - ${reason.toString()}`);
      this.cleanup();
      if (!this.isShuttingDown) {
        this.handleConnectionLost();
      }
    });

    this.ws.on('error', (error: Error) => {
      console.error('[WS] WebSocket error:', error);
      this.emit('error', error);
    });

    this.ws.on('pong', () => {
      console.log('[WS] Received pong');
      if (this.pongTimeout) {
        clearTimeout(this.pongTimeout);
        this.pongTimeout = null;
      }
    });
  }

  /**
   * Handle incoming sync events and emit for processing
   */
  private handleIncomingEvent(event: SyncEvent): void {
    console.log(`[WS] Received ${event.type} event:`, event.payload);
    
    // Emit for main process to handle persistence and IPC
    this.emit('syncEvent', event);
  }

  /**
   * Start heartbeat mechanism
   */
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === this.ws.OPEN) {
        console.log('[WS] Sending ping');
        this.ws.ping();
        
        // Set pong timeout
        this.pongTimeout = setTimeout(() => {
          console.error('[WS] Pong timeout - connection unhealthy');
          this.ws?.close();
        }, this.config.pongTimeout);
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Handle connection loss with exponential backoff
   */
  private handleConnectionLost(): void {
    this.updateStatus({ status: 'reconnecting' });
    this.emit('disconnected');

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    const delay = Math.min(
      this.config.reconnectBaseDelay * Math.pow(2, this.status.reconnectAttempts || 0),
      this.config.reconnectMaxDelay
    );

    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${(this.status.reconnectAttempts || 0) + 1})`);

    this.reconnectTimeout = setTimeout(async () => {
      if ((this.status.reconnectAttempts || 0) >= this.config.maxReconnectAttempts) {
        console.error('[WS] Max reconnect attempts reached');
        this.updateStatus({ status: 'offline', reconnectAttempts: 0 });
        this.emit('maxReconnectAttemptsReached');
        return;
      }

      this.updateStatus({ reconnectAttempts: (this.status.reconnectAttempts || 0) + 1 });
      
      try {
        await this.connect();
      } catch (error) {
        console.error('[WS] Reconnect failed:', error);
        this.handleConnectionLost();
      }
    }, delay);
  }

  /**
   * Update connection status and emit change
   */
  private updateStatus(updates: Partial<ConnectionStatus>): void {
    this.status = { ...this.status, ...updates };
    console.log('[WS] Status updated:', this.status);
    this.emit('statusChange', this.status);
  }

  /**
   * Get current connection status
   */
  getStatus(): ConnectionStatus {
    return { ...this.status };
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  /**
   * Graceful shutdown
   */
  async disconnect(): Promise<void> {
    this.isShuttingDown = true;
    this.cleanup();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }

    this.updateStatus({ status: 'offline', reconnectAttempts: 0 });
    console.log('[WS] Disconnected gracefully');
  }
}
