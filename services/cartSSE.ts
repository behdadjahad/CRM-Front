/**
 * Cart SSE Service
 * Handles Server-Sent Events for real-time cart updates
 */

export interface CartSSEConfig {
  chadcoCustomerId: number;
  baseUrl?: string;
  autoReconnect?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  heartbeatTimeout?: number;
}

export interface CartSSEEvent {
  type: 'cart_update' | 'heartbeat' | 'connection_established';
  itemCount?: number;
  message?: string;
  timestamp?: number;
}

export type CartSSECallback = (event: CartSSEEvent) => void;
export type ConnectionStatusCallback = (status: 'connecting' | 'connected' | 'disconnected' | 'error', message: string) => void;

export class CartSSEService {
  private config: CartSSEConfig;
  private eventSource: EventSource | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatTimeout: NodeJS.Timeout | null = null;
  private retryCount = 0;
  private maxRetries: number;
  private retryDelay: number;
  private heartbeatTimeoutMs: number;

  // Event callbacks
  private onCartUpdateCallback?: CartSSECallback;
  private onConnectionStatusCallback?: ConnectionStatusCallback;
  private onErrorCallback?: (error: Event) => void;

  constructor(config: CartSSEConfig) {
    this.config = {
      baseUrl: 'http://185.126.203.246:3001',
      autoReconnect: true,
      maxRetries: 5,
      retryDelay: 1000,
      heartbeatTimeout: 30000,
      ...config,
    };

    this.maxRetries = this.config.maxRetries!;
    this.retryDelay = this.config.retryDelay!;
    this.heartbeatTimeoutMs = this.config.heartbeatTimeout!;
  }

  // Set event callbacks
  onCartUpdate(callback: CartSSECallback) {
    this.onCartUpdateCallback = callback;
  }

  onConnectionStatus(callback: ConnectionStatusCallback) {
    this.onConnectionStatusCallback = callback;
  }

  onError(callback: (error: Event) => void) {
    this.onErrorCallback = callback;
  }

  // Connect to SSE
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.eventSource?.readyState === EventSource.OPEN) {
        resolve();
        return;
      }

      this.cleanup();

      const url = `${this.config.baseUrl}/v1/cart/updates?chadcoCustomerId=${this.config.chadcoCustomerId}`;
      console.log('[SSE] Connecting to URL:', url);
      this.onConnectionStatusCallback?.('connecting', 'Connecting to cart updates...');

      // TEMPORARY: Mock SSE for testing (remove when backend is ready)
      if (process.env.NODE_ENV === 'development') {
        console.log('[SSE] Using MOCK SSE endpoint for testing');
        this.simulateSSE();
        resolve();
        return;
      }

      try {
        this.eventSource = new EventSource(url);

        this.eventSource.onopen = () => {
          this.retryCount = 0;
          this.onConnectionStatusCallback?.('connected', 'Connected to real-time cart updates');
          this.startHeartbeatTimeout();
          resolve();
        };

        this.eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // Handle heartbeat
            if (data.type === 'heartbeat') {
              this.handleHeartbeat();
              return;
            }

            // Handle cart updates
            if (data.type === 'cart_update' || data.type === 'connection_established') {
              this.onCartUpdateCallback?.(data);
            }

          } catch (error) {
            console.error('Error parsing SSE message:', error);
            this.onErrorCallback?.(event);
          }
        };

        this.eventSource.onerror = (error) => {
          console.error('SSE Error:', error);
          this.onErrorCallback?.(error);

          if (this.eventSource && this.eventSource.readyState === EventSource.CLOSED) {
            this.onConnectionStatusCallback?.('disconnected', 'Connection closed');
            this.eventSource = null;
          } else {
            this.onConnectionStatusCallback?.('error', 'Connection error - attempting to reconnect');
          }

          // Attempt reconnection if enabled
          if (this.config.autoReconnect) {
            this.handleReconnect();
          }

          reject(error);
        };

      } catch (error) {
        console.error('Failed to create SSE connection:', error);
        this.onConnectionStatusCallback?.('error', 'Failed to create connection');
        this.eventSource = null;
        reject(error);
      }
    });
  }

  // Disconnect from SSE
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.cleanup();
    this.onConnectionStatusCallback?.('disconnected', 'Disconnected from cart updates');
  }

  // Handle heartbeat events
  private handleHeartbeat(): void {
    this.startHeartbeatTimeout();
  }

  // Start heartbeat timeout
  private startHeartbeatTimeout(): void {
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
    }

    this.heartbeatTimeout = setTimeout(() => {
      this.onConnectionStatusCallback?.('error', 'Heartbeat timeout - connection may be lost');
      this.handleReconnect();
    }, this.heartbeatTimeoutMs);
  }

  // Handle reconnection with exponential backoff
  private handleReconnect(): void {
    if (!this.config.autoReconnect || this.retryCount >= this.maxRetries) {
      this.onConnectionStatusCallback?.('disconnected', 'Max retries reached - using fallback');
      return;
    }

    this.retryCount++;
    const delay = this.retryDelay * Math.pow(2, this.retryCount - 1);

    this.onConnectionStatusCallback?.('connecting', `Reconnecting in ${delay}ms (attempt ${this.retryCount}/${this.maxRetries})`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch(() => {
        // Reconnection failed, will be handled by onerror
      });
    }, delay);
  }

  // Cleanup resources
  private cleanup(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  // TEMPORARY: Mock SSE simulation for testing
  private simulateSSE(): void {
    console.log('[SSE] Starting mock SSE simulation...');

    // Simulate connection established
    setTimeout(() => {
      this.onConnectionStatusCallback?.('connected', 'Connected to mock SSE (testing mode)');

      // Send initial cart count
      this.onCartUpdateCallback?.({
        type: 'connection_established',
        itemCount: 2, // Mock initial count
        timestamp: Date.now(),
        message: 'Mock SSE connected'
      });
    }, 500);

    // Simulate periodic updates
    setInterval(() => {
      if (this.isConnected()) {
        // Send heartbeat
        this.onCartUpdateCallback?.({
          type: 'heartbeat',
          timestamp: Date.now(),
          message: 'Mock heartbeat'
        });
      }
    }, 15000);

    // Simulate cart updates every 30 seconds for testing
    setInterval(() => {
      if (this.isConnected()) {
        const randomCount = Math.floor(Math.random() * 5) + 1;
        this.onCartUpdateCallback?.({
          type: 'cart_update',
          itemCount: randomCount,
          timestamp: Date.now(),
          message: `Mock cart update: ${randomCount} items`
        });
      }
    }, 30000);
  }

  // Get connection status
  getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' | 'error' {
    if (!this.eventSource) return 'disconnected';

    switch (this.eventSource.readyState) {
      case EventSource.CONNECTING:
        return 'connecting';
      case EventSource.OPEN:
        return 'connected';
      case EventSource.CLOSED:
        return 'disconnected';
      default:
        return 'error';
    }
  }

  // Check if connected
  isConnected(): boolean {
    // For mock mode, always return true if we're in development
    if (process.env.NODE_ENV === 'development' && !this.eventSource) {
      return true;
    }
    return this.eventSource?.readyState === EventSource.OPEN;
  }

  // Update configuration
  updateConfig(newConfig: Partial<CartSSEConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Reconnect if customer ID changed
    if (newConfig.chadcoCustomerId && newConfig.chadcoCustomerId !== this.config.chadcoCustomerId) {
      this.disconnect();
      setTimeout(() => this.connect(), 100);
    }
  }
}
