import { useEffect, useRef, useState, useCallback } from 'react';
import { SSEConnectionState, SSEConfig, SSEMessage } from '@/types/sse';

export function useSSE(config: SSEConfig) {
    const [connectionState, setConnectionState] = useState<SSEConnectionState>({
        status: 'disconnected',
        retryCount: 0,
        maxRetries: config.maxRetries || 5,
        reconnectDelay: config.retryDelay || 1000,
    });

    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const cleanup = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        if (heartbeatTimeoutRef.current) {
            clearTimeout(heartbeatTimeoutRef.current);
            heartbeatTimeoutRef.current = null;
        }
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
    }, []);

    const connect = useCallback(() => {
        if (eventSourceRef.current?.readyState === EventSource.OPEN) {
            return; // Already connected
        }

        cleanup();

        setConnectionState(prev => ({
            ...prev,
            status: 'connecting',
            lastError: undefined,
        }));

        try {
            const eventSource = new EventSource(config.url, {
                withCredentials: config.withCredentials || false,
            });

            eventSourceRef.current = eventSource;

            eventSource.onopen = () => {
                setConnectionState(prev => ({
                    ...prev,
                    status: 'connected',
                    lastConnected: new Date(),
                    retryCount: 0,
                    lastError: undefined,
                }));
                config.onOpen?.();
            };

            eventSource.onmessage = (event) => {
                try {
                    const message: SSEMessage = JSON.parse(event.data);

                    // Handle heartbeat
                    if (message.type === 'heartbeat') {
                        // Reset heartbeat timeout
                        if (heartbeatTimeoutRef.current) {
                            clearTimeout(heartbeatTimeoutRef.current);
                        }

                        if (config.heartbeatTimeout) {
                            heartbeatTimeoutRef.current = setTimeout(() => {
                                setConnectionState(prev => ({
                                    ...prev,
                                    status: 'error',
                                    lastError: 'Heartbeat timeout',
                                }));
                                eventSource.close();
                            }, config.heartbeatTimeout);
                        }
                        return;
                    }

                    config.onMessage?.(message);
                } catch (error) {
                    console.error('Error parsing SSE message:', error);
                }
            };

            eventSource.onerror = (error) => {
                console.error('SSE Error:', error);

                setConnectionState(prev => ({
                    ...prev,
                    status: 'error',
                    lastError: 'Connection error',
                }));

                config.onError?.(error);

                // Auto-reconnect if enabled and not exceeded max retries
                if (connectionState.retryCount < connectionState.maxRetries) {
                    const delay = connectionState.reconnectDelay * Math.pow(2, connectionState.retryCount);

                    setConnectionState(prev => ({
                        ...prev,
                        status: 'reconnecting',
                        retryCount: prev.retryCount + 1,
                    }));

                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, delay);
                } else {
                    setConnectionState(prev => ({
                        ...prev,
                        status: 'disconnected',
                    }));
                }
            };

        } catch (error) {
            console.error('Failed to create SSE connection:', error);
            setConnectionState(prev => ({
                ...prev,
                status: 'error',
                lastError: error instanceof Error ? error.message : 'Unknown error',
            }));
        }
    }, [config, connectionState.retryCount, connectionState.reconnectDelay, connectionState.maxRetries, cleanup]);

    const disconnect = useCallback(() => {
        cleanup();
        setConnectionState(prev => ({
            ...prev,
            status: 'disconnected',
            retryCount: 0,
        }));
        config.onClose?.();
    }, [cleanup, config]);

    const reconnect = useCallback(() => {
        disconnect();
        setTimeout(connect, 100);
    }, [disconnect, connect]);

    // Cleanup on unmount
    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    // Auto-connect when config changes
    useEffect(() => {
        if (config.url) {
            connect();
        }
        return cleanup;
    }, [config.url, connect, cleanup]);

    return {
        connectionState,
        connect,
        disconnect,
        reconnect,
        isConnected: connectionState.status === 'connected',
        isConnecting: connectionState.status === 'connecting',
        isReconnecting: connectionState.status === 'reconnecting',
        hasError: connectionState.status === 'error',
    };
}
