import { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CartSSEService } from '@/services/cartSSE';
import { CartSSEState, CartSSEUpdate, CartSSEConfig } from '@/types/cart-sse';
import { SSE_CONFIG, getCartSSEUrl } from '@/config/sse';

export function useCartSSE() {
    const chadcoCustomerId = useSelector((state: RootState) => state?.login?.chadcoCustomerId);
    const [cartCount, setCartCount] = useState<number>(0);
    const [isSSEConnected, setIsSSEConnected] = useState<boolean>(false);
    const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');

    const cartSSEServiceRef = useRef<CartSSEService | null>(null);

    // Initialize SSE service
    useEffect(() => {
        if (!chadcoCustomerId) {
            // Disconnect if no customer ID
            if (cartSSEServiceRef.current) {
                cartSSEServiceRef.current.disconnect();
                cartSSEServiceRef.current = null;
            }
            setIsSSEConnected(false);
            setConnectionStatus('disconnected');
            setCartCount(0);
            return;
        }

        // Create new SSE service
        const config: CartSSEConfig = {
            baseUrl: SSE_CONFIG.API_BASE_URL,
            chadcoCustomerId,
            autoReconnect: SSE_CONFIG.CART_SSE.AUTO_RECONNECT,
            maxRetries: SSE_CONFIG.MAX_RETRIES,
            retryDelay: SSE_CONFIG.RECONNECT_DELAY,
            heartbeatTimeout: SSE_CONFIG.HEARTBEAT_TIMEOUT,
        };

        cartSSEServiceRef.current = new CartSSEService(config);

        // Set up event handlers - simplified to only track count
        cartSSEServiceRef.current.onCartCountUpdate((count: number) => {
            setCartCount(count);
        });

        cartSSEServiceRef.current.onConnectionStatus((status: string, message: string) => {
            setIsSSEConnected(status === 'connected');
            setConnectionStatus(status);
        });

        cartSSEServiceRef.current.onError((error: Event) => {
            console.error('Cart SSE Error:', error);
            // Handle error similar to your test page
            if (cartSSEServiceRef.current?.getConnectionStatus() === 'disconnected') {
                setIsSSEConnected(false);
                setConnectionStatus('disconnected');

                // Log detailed error for debugging
                console.error('SSE Connection Failed - Possible Causes:', {
                    error,
                    timestamp: new Date().toISOString(),
                    possibleCauses: [
                        'Firewall blocking SSE connections',
                        'Proxy server interference',
                        'CORS policy blocking',
                        'Server not configured for SSE',
                        'Network connectivity issues',
                        'Persian server firewall restrictions'
                    ],
                    suggestions: [
                        'Check server SSE configuration',
                        'Verify CORS headers',
                        'Test from different network',
                        'Contact server administrator',
                        'Use polling fallback instead'
                    ]
                });
            }
        });

        // Connect to SSE
        cartSSEServiceRef.current.connect().catch((error) => {
            console.error('Failed to connect to cart SSE:', error);
        });

        // Cleanup on unmount or customer change
        return () => {
            if (cartSSEServiceRef.current) {
                cartSSEServiceRef.current.disconnect();
                cartSSEServiceRef.current = null;
            }
        };
    }, [chadcoCustomerId]);

    // Manual connection control
    const connect = useCallback(() => {
        if (cartSSEServiceRef.current && chadcoCustomerId) {
            cartSSEServiceRef.current.connect().catch((error) => {
                console.error('Failed to connect to cart SSE:', error);
            });
        }
    }, [chadcoCustomerId]);

    const disconnect = useCallback(() => {
        if (cartSSEServiceRef.current) {
            cartSSEServiceRef.current.disconnect();
        }
    }, []);

    const reconnect = useCallback(() => {
        if (cartSSEServiceRef.current) {
            cartSSEServiceRef.current.disconnect();
            setTimeout(() => {
                if (cartSSEServiceRef.current && chadcoCustomerId) {
                    cartSSEServiceRef.current.connect().catch((error) => {
                        console.error('Failed to reconnect to cart SSE:', error);
                    });
                }
            }, 100);
        }
    }, [chadcoCustomerId]);

    // Get connection status
    const getConnectionStatus = useCallback(() => {
        return cartSSEServiceRef.current?.getConnectionStatus() || 'disconnected';
    }, []);

    // Check if connected
    const isConnected = useCallback(() => {
        return cartSSEServiceRef.current?.isConnected() || false;
    }, []);

    return {
        // Simplified return - only cart count and connection status
        cartCount,
        isConnected: isSSEConnected,
        connectionStatus,
        connect,
        disconnect,
        reconnect,
        getConnectionStatus,
    };
}
