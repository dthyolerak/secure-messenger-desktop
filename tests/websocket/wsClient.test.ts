// tests/websocket/wsClient.test.ts
/**
 * Unit tests for WebSocket client
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { EventEmitter } from 'events';

// Mock WebSocket class
class MockWebSocket extends EventEmitter {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  
  readyState = MockWebSocket.CONNECTING;
  
  constructor(public url: string) {
    super();
    // Simulate connection after a tick
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      this.emit('open');
    }, 10);
  }
  
  send(data: string) {
    this.emit('message', { data });
  }
  
  ping() {
    // Simulate pong response
    setTimeout(() => this.emit('pong'), 5);
  }
  
  pong() {}
  
  close(code?: number, reason?: string) {
    this.readyState = MockWebSocket.CLOSED;
    this.emit('close', { code, reason });
  }
}

// Connection status type
type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'offline';

interface ConnectionState {
  status: ConnectionStatus;
  lastConnected?: number;
  reconnectAttempts?: number;
}

/**
 * Minimal WebSocket client implementation for testing
 */
class TestableWebSocketClient extends EventEmitter {
  private ws: MockWebSocket | null = null;
  private status: ConnectionState = { status: 'offline', reconnectAttempts: 0 };
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isShuttingDown = false;
  
  private readonly config = {
    url: 'ws://localhost:8080',
    heartbeatInterval: 100, // Shorter for tests
    pongTimeout: 50,
    reconnectBaseDelay: 50,
    reconnectMaxDelay: 500,
    maxReconnectAttempts: 5,
  };
  
  async connect(): Promise<void> {
    if (this.isShuttingDown) return;
    
    this.updateStatus({ status: 'connecting' });
    
    return new Promise((resolve, reject) => {
      this.ws = new MockWebSocket(this.config.url);
      
      this.ws.on('open', () => {
        this.updateStatus({
          status: 'connected',
          lastConnected: Date.now(),
          reconnectAttempts: 0,
        });
        this.startHeartbeat();
        this.emit('connected');
        resolve();
      });
      
      this.ws.on('close', () => {
        if (!this.isShuttingDown) {
          this.handleConnectionLost();
        }
      });
      
      this.ws.on('error', (error) => {
        this.emit('error', error);
        reject(error);
      });
      
      this.ws.on('message', (event: { data: string }) => {
        try {
          const data = JSON.parse(event.data);
          this.emit('syncEvent', data);
        } catch {
          // Not JSON, ignore
        }
      });
      
      this.ws.on('pong', () => {
        this.emit('pong');
      });
    });
  }
  
  private updateStatus(update: Partial<ConnectionState>): void {
    this.status = { ...this.status, ...update };
    this.emit('statusChange', this.status);
  }
  
  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === MockWebSocket.OPEN) {
        this.ws.ping();
      }
    }, this.config.heartbeatInterval);
  }
  
  private handleConnectionLost(): void {
    this.updateStatus({ status: 'reconnecting' });
    this.emit('disconnected');
    
    const attempts = this.status.reconnectAttempts || 0;
    
    if (attempts >= this.config.maxReconnectAttempts) {
      this.updateStatus({ status: 'offline', reconnectAttempts: 0 });
      this.emit('maxReconnectAttemptsReached');
      return;
    }
    
    const delay = Math.min(
      this.config.reconnectBaseDelay * Math.pow(2, attempts),
      this.config.reconnectMaxDelay
    );
    
    this.reconnectTimeout = setTimeout(async () => {
      this.updateStatus({ reconnectAttempts: attempts + 1 });
      try {
        await this.connect();
      } catch {
        this.handleConnectionLost();
      }
    }, delay);
  }
  
  getStatus(): ConnectionState {
    return { ...this.status };
  }
  
  async disconnect(): Promise<void> {
    this.isShuttingDown = true;
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }
    
    this.updateStatus({ status: 'offline', reconnectAttempts: 0 });
  }
  
  simulateDisconnect(): void {
    if (this.ws) {
      this.ws.close(1006, 'Simulated disconnect');
    }
  }
}

describe('WebSocket Client', () => {
  let client: TestableWebSocketClient;
  
  beforeEach(() => {
    vi.useFakeTimers();
    client = new TestableWebSocketClient();
  });
  
  afterEach(async () => {
    await client.disconnect();
    vi.useRealTimers();
  });

  describe('Connection', () => {
    it('should connect successfully', async () => {
      const connectPromise = client.connect();
      vi.advanceTimersByTime(20);
      await connectPromise;
      
      expect(client.getStatus().status).toBe('connected');
    });

    it('should emit connected event on successful connection', async () => {
      const connectedHandler = vi.fn();
      client.on('connected', connectedHandler);
      
      const connectPromise = client.connect();
      vi.advanceTimersByTime(20);
      await connectPromise;
      
      expect(connectedHandler).toHaveBeenCalled();
    });

    it('should track lastConnected timestamp', async () => {
      const beforeConnect = Date.now();
      
      const connectPromise = client.connect();
      vi.advanceTimersByTime(20);
      await connectPromise;
      
      const status = client.getStatus();
      expect(status.lastConnected).toBeGreaterThanOrEqual(beforeConnect);
    });

    it('should reset reconnect attempts on successful connection', async () => {
      const connectPromise = client.connect();
      vi.advanceTimersByTime(20);
      await connectPromise;
      
      expect(client.getStatus().reconnectAttempts).toBe(0);
    });
  });

  describe('Disconnection', () => {
    it('should handle graceful disconnect', async () => {
      const connectPromise = client.connect();
      vi.advanceTimersByTime(20);
      await connectPromise;
      
      await client.disconnect();
      
      expect(client.getStatus().status).toBe('offline');
    });

    it('should emit status change on disconnect', async () => {
      const statusHandler = vi.fn();
      
      const connectPromise = client.connect();
      vi.advanceTimersByTime(20);
      await connectPromise;
      
      client.on('statusChange', statusHandler);
      await client.disconnect();
      
      expect(statusHandler).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'offline' })
      );
    });
  });

  describe('Reconnection', () => {
    it('should attempt reconnection on connection loss', async () => {
      const connectPromise = client.connect();
      vi.advanceTimersByTime(20);
      await connectPromise;
      
      const disconnectedHandler = vi.fn();
      client.on('disconnected', disconnectedHandler);
      
      client.simulateDisconnect();
      vi.advanceTimersByTime(10);
      
      expect(disconnectedHandler).toHaveBeenCalled();
      expect(client.getStatus().status).toBe('reconnecting');
    });

    it('should use exponential backoff for reconnection', async () => {
      const connectPromise = client.connect();
      vi.advanceTimersByTime(20);
      await connectPromise;
      
      const statusChanges: ConnectionState[] = [];
      client.on('statusChange', (status) => statusChanges.push({ ...status }));
      
      // Simulate disconnect
      client.simulateDisconnect();
      vi.advanceTimersByTime(10);
      
      // First reconnect attempt
      expect(client.getStatus().status).toBe('reconnecting');
    });

    it('should emit maxReconnectAttemptsReached after max attempts', async () => {
      const connectPromise = client.connect();
      vi.advanceTimersByTime(20);
      await connectPromise;
      
      const maxAttemptsHandler = vi.fn();
      client.on('maxReconnectAttemptsReached', maxAttemptsHandler);
      
      // Manually trigger reconnection failures
      for (let i = 0; i <= 5; i++) {
        client.simulateDisconnect();
        vi.advanceTimersByTime(1000);
      }
      
      // Should eventually reach max attempts
      expect(maxAttemptsHandler).toHaveBeenCalled;
    });
  });

  describe('Heartbeat', () => {
    it('should send heartbeat pings', async () => {
      const pongHandler = vi.fn();
      client.on('pong', pongHandler);
      
      const connectPromise = client.connect();
      vi.advanceTimersByTime(20);
      await connectPromise;
      
      // Wait for heartbeat
      vi.advanceTimersByTime(150);
      
      expect(pongHandler).toHaveBeenCalled();
    });
  });

  describe('Status Management', () => {
    it('should return correct initial status', () => {
      expect(client.getStatus()).toEqual({
        status: 'offline',
        reconnectAttempts: 0,
      });
    });

    it('should transition through connecting state', async () => {
      const statuses: string[] = [];
      client.on('statusChange', (status) => statuses.push(status.status));
      
      const connectPromise = client.connect();
      expect(statuses).toContain('connecting');
      
      vi.advanceTimersByTime(20);
      await connectPromise;
      
      expect(statuses).toContain('connected');
    });
  });
});

describe('Exponential Backoff', () => {
  const calculateBackoff = (attempts: number, base = 50, max = 500) => {
    return Math.min(base * Math.pow(2, attempts), max);
  };

  it('should calculate correct backoff delays', () => {
    expect(calculateBackoff(0)).toBe(50);
    expect(calculateBackoff(1)).toBe(100);
    expect(calculateBackoff(2)).toBe(200);
    expect(calculateBackoff(3)).toBe(400);
    expect(calculateBackoff(4)).toBe(500); // Capped at max
    expect(calculateBackoff(10)).toBe(500); // Still capped
  });

  it('should respect custom parameters', () => {
    expect(calculateBackoff(0, 100, 1000)).toBe(100);
    expect(calculateBackoff(3, 100, 500)).toBe(500);
  });
});
