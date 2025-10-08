import { CartSSEService } from './cartSSE';
import { CartSSEConfig } from '@/types/cart-sse';

class SSEManager {
    private static instance: SSEManager;
    private cartSSEService: CartSSEService | null = null;
    private isInitialized = false;

    private constructor() { }

    static getInstance(): SSEManager {
        if (!SSEManager.instance) {
            SSEManager.instance = new SSEManager();
        }
        return SSEManager.instance;
    }

    // Initialize SSE manager
    initialize(config: CartSSEConfig): void {
        if (this.isInitialized) {
            console.warn('SSE Manager already initialized');
            return;
        }

        this.cartSSEService = new CartSSEService(config);
        this.isInitialized = true;

        console.log('SSE Manager initialized');
    }

    // Get cart SSE service
    getCartSSEService(): CartSSEService | null {
        return this.cartSSEService;
    }

    // Connect to cart SSE
    async connectCartSSE(): Promise<void> {
        if (!this.cartSSEService) {
            throw new Error('SSE Manager not initialized');
        }

        return this.cartSSEService.connect();
    }

    // Disconnect from cart SSE
    disconnectCartSSE(): void {
        if (this.cartSSEService) {
            this.cartSSEService.disconnect();
        }
    }

    // Update cart SSE configuration
    updateCartSSEConfig(config: Partial<CartSSEConfig>): void {
        if (this.cartSSEService) {
            this.cartSSEService.updateConfig(config);
        }
    }

    // Check if cart SSE is connected
    isCartSSEConnected(): boolean {
        return this.cartSSEService?.isConnected() || false;
    }

    // Get cart SSE connection status
    getCartSSEConnectionStatus(): string {
        return this.cartSSEService?.getConnectionStatus() || 'disconnected';
    }

    // Cleanup all connections
    cleanup(): void {
        if (this.cartSSEService) {
            this.cartSSEService.disconnect();
            this.cartSSEService = null;
        }
        this.isInitialized = false;
    }

    // Check if initialized
    getIsInitialized(): boolean {
        return this.isInitialized;
    }
}

export default SSEManager;
