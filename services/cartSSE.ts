import { CartSSEConfig, CartSSEUpdate } from '@/types/cart-sse';
import { SSEMessage, CartSSEEvent } from '@/types/sse';

export class CartSSEService {
    private config: CartSSEConfig;
    private eventSource: EventSource | null = null;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private heartbeatTimeout: NodeJS.Timeout | null = null;
    private retryCount = 0;
    private maxRetries: number;
    private retryDelay: number;
    private heartbeatTimeoutMs: number;

    // Event callbacks - simplified to only track count
    private onCartCountUpdateCallback?: (count: number) => void;
    private onConnectionStatusCallback?: (status: string, message: string) => void;
    private onErrorCallback?: (error: Event) => void;

    constructor(config: CartSSEConfig) {
        this.config = {
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

    // Set event callbacks - simplified to only track count
    onCartCountUpdate(callback: (count: number) => void) {
        this.onCartCountUpdateCallback = callback;
    }

    onConnectionStatus(callback: (status: string, message: string) => void) {
        this.onConnectionStatusCallback = callback;
    }

    onError(callback: (error: Event) => void) {
        this.onErrorCallback = callback;
    }

    // Connect to SSE - matching your test page logic exactly
    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.eventSource?.readyState === EventSource.OPEN) {
                resolve();
                return;
            }

            this.cleanup();

            const url = `${this.config.baseUrl}/cart/updates?chadcoCustomerId=${this.config.chadcoCustomerId}`;
            this.onConnectionStatusCallback?.('connecting', 'Connecting...');

            try {
                this.eventSource = new EventSource(url);

                this.eventSource.onopen = () => {
                    this.retryCount = 0;
                    this.onConnectionStatusCallback?.('connected', 'Connected to SSE');
                    this.startHeartbeatTimeout();
                    resolve();
                };

                this.eventSource.onmessage = (event) => {
                    try {
                        console.log('Raw SSE data:', event.data);
                        const data = JSON.parse(event.data);

                        if (data.type === 'heartbeat') {
                            this.handleHeartbeat();
                            return;
                        }

                        // Handle cart update - extract itemCount directly
                        const cartCount = data.itemCount;
                        this.onCartCountUpdateCallback?.(cartCount);

                    } catch (error) {
                        console.error('Parse error:', error);
                        this.onErrorCallback?.(event);
                    }
                };

                this.eventSource.onerror = (error) => {
                    console.error('SSE Error:', error);
                    console.error('EventSource readyState:', this.eventSource?.readyState);
                    console.error('EventSource url:', this.eventSource?.url);

                    // Detailed error logging for debugging
                    const errorDetails = {
                        type: 'SSE_ERROR',
                        readyState: this.eventSource?.readyState,
                        url: this.eventSource?.url,
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent,
                        error: error
                    };
                    console.error('SSE Error Details:', errorDetails);

                    this.onErrorCallback?.(error);

                    if (this.eventSource && this.eventSource.readyState === EventSource.CLOSED) {
                        this.onConnectionStatusCallback?.('disconnected', 'Connection closed - possible firewall/proxy issue');
                        this.eventSource = null;
                    } else {
                        this.onConnectionStatusCallback?.('error', 'Network error - check firewall/proxy settings');
                    }

                    reject(error);
                };

            } catch (error) {
                console.error('Connection error:', error);

                // Detailed connection error logging
                const connectionErrorDetails = {
                    type: 'SSE_CONNECTION_ERROR',
                    url: url,
                    error: error,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    possibleCauses: [
                        'Firewall blocking SSE connections',
                        'Proxy server interference',
                        'CORS policy blocking',
                        'Server not configured for SSE',
                        'Network connectivity issues'
                    ]
                };
                console.error('SSE Connection Error Details:', connectionErrorDetails);

                this.onConnectionStatusCallback?.('disconnected', 'Connection failed - check server/firewall configuration');
                this.eventSource = null;
                reject(error);
            }
        });
    }

    // Disconnect from SSE - matching your test page logic
    disconnect(): void {
        if (!this.eventSource) {
            return;
        }

        this.eventSource.close();
        this.eventSource = null;
        this.cleanup();
        this.onConnectionStatusCallback?.('disconnected', 'Disconnected');
    }

    // Handle heartbeat events - matching your test page logic
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

    // Handle reconnection
    private handleReconnect(): void {
        if (!this.config.autoReconnect || this.retryCount >= this.maxRetries) {
            this.onConnectionStatusCallback?.('disconnected', 'Max retries reached');
            return;
        }

        this.retryCount++;
        const delay = this.retryDelay * Math.pow(2, this.retryCount - 1);

        this.onConnectionStatusCallback?.('reconnecting', `Reconnecting in ${delay}ms (attempt ${this.retryCount}/${this.maxRetries})`);

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

        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }

    // Get connection status
    getConnectionStatus(): string {
        if (!this.eventSource) return 'disconnected';

        switch (this.eventSource.readyState) {
            case EventSource.CONNECTING:
                return 'connecting';
            case EventSource.OPEN:
                return 'connected';
            case EventSource.CLOSED:
                return 'disconnected';
            default:
                return 'unknown';
        }
    }

    // Check if connected
    isConnected(): boolean {
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
