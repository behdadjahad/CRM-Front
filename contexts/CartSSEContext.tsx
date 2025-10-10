"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CartSSEService, CartSSEConfig, CartSSEEvent } from '@/services/cartSSE';
import { useCartPolling } from '@/hooks/useCartPolling';

// Context types
interface CartSSEState {
  count: number;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  connectionMessage: string;
  lastUpdated: string | null;
}

interface CartSSEContextType {
  // State
  count: number;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  connectionMessage: string;
  lastUpdated: string | null;
  
  // Actions
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
}

// Create context
const CartSSEContext = createContext<CartSSEContextType | undefined>(undefined);

// Provider props
interface CartSSEProviderProps {
  children: ReactNode;
}

// Provider component
export function CartSSEProvider({ children }: CartSSEProviderProps) {
  const chadcoCustomerId = useSelector((state: RootState) => state?.login?.chadcoCustomerId);
  
  // State
  const [state, setState] = useState<CartSSEState>({
    count: 0,
    isConnected: false,
    connectionStatus: 'disconnected',
    connectionMessage: 'Not connected',
    lastUpdated: null,
  });

  // Service reference
  const cartSSEServiceRef = useRef<CartSSEService | null>(null);
  const [useSSE, setUseSSE] = useState(true);

  // Fallback polling when SSE fails
  const { cartCount: pollingCount, isPolling } = useCartPolling({
    enabled: !useSSE && !!chadcoCustomerId,
    interval: 10000, // 10 seconds
    onCartCountUpdate: (count) => {
      setState(prev => ({
        ...prev,
        count,
        lastUpdated: new Date().toISOString(),
      }));
    }
  });

  // Initialize SSE service when customer ID is available
  useEffect(() => {
    if (!chadcoCustomerId) {
      // Disconnect if no customer ID
      if (cartSSEServiceRef.current) {
        cartSSEServiceRef.current.disconnect();
        cartSSEServiceRef.current = null;
      }
      setState(prev => ({
        ...prev,
        count: 0,
        isConnected: false,
        connectionStatus: 'disconnected',
        connectionMessage: 'Not authenticated',
      }));
      return;
    }

    // Create new SSE service
    const config: CartSSEConfig = {
      chadcoCustomerId,
      baseUrl: 'http://185.126.203.246:3001',
      autoReconnect: true,
      maxRetries: 5,
      retryDelay: 1000,
      heartbeatTimeout: 30000,
    };

    cartSSEServiceRef.current = new CartSSEService(config);

    // Set up event handlers
    cartSSEServiceRef.current.onCartUpdate((event: CartSSEEvent) => {
      console.log('[SSE] Cart update received:', event);
      
      if (event.type === 'cart_update' && typeof event.itemCount === 'number') {
        setState(prev => ({
          ...prev,
          count: event.itemCount,
          lastUpdated: new Date().toISOString(),
        }));
      } else if (event.type === 'connection_established') {
        // Backend sends initial count on connection
        if (typeof event.itemCount === 'number') {
          setState(prev => ({
            ...prev,
            count: event.itemCount,
            lastUpdated: new Date().toISOString(),
          }));
        }
      }
    });

    cartSSEServiceRef.current.onConnectionStatus((status, message) => {
      console.log('[SSE] Connection status:', status, message);
      
      setState(prev => ({
        ...prev,
        isConnected: status === 'connected',
        connectionStatus: status,
        connectionMessage: message,
      }));

      // Switch to polling if SSE fails completely
      if (status === 'disconnected' && message.includes('Max retries reached')) {
        console.log('[SSE] Switching to polling fallback');
        setUseSSE(false);
        setState(prev => ({
          ...prev,
          connectionStatus: 'disconnected',
          connectionMessage: 'Using polling fallback',
        }));
      }
    });

    cartSSEServiceRef.current.onError((error) => {
      console.error('[SSE] Error:', error);
      
      setState(prev => ({
        ...prev,
        isConnected: false,
        connectionStatus: 'error',
        connectionMessage: 'Connection error - check network',
      }));
    });

    // Connect to SSE
    cartSSEServiceRef.current.connect().catch((error) => {
      console.error('[SSE] Failed to connect:', error);
      
      setState(prev => ({
        ...prev,
        isConnected: false,
        connectionStatus: 'error',
        connectionMessage: 'Failed to connect - using fallback',
      }));
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
  const connect = () => {
    if (cartSSEServiceRef.current && chadcoCustomerId) {
      cartSSEServiceRef.current.connect().catch((error) => {
        console.error('[SSE] Failed to connect:', error);
      });
    }
  };

  const disconnect = () => {
    if (cartSSEServiceRef.current) {
      cartSSEServiceRef.current.disconnect();
    }
  };

  const reconnect = () => {
    if (cartSSEServiceRef.current) {
      cartSSEServiceRef.current.disconnect();
      setTimeout(() => {
        if (cartSSEServiceRef.current && chadcoCustomerId) {
          cartSSEServiceRef.current.connect().catch((error) => {
            console.error('[SSE] Failed to reconnect:', error);
          });
        }
      }, 100);
    }
  };

  // Context value
  const contextValue: CartSSEContextType = {
    // State
    count: state.count,
    isConnected: state.isConnected,
    connectionStatus: state.connectionStatus,
    connectionMessage: state.connectionMessage,
    lastUpdated: state.lastUpdated,
    
    // Actions
    connect,
    disconnect,
    reconnect,
  };

  return (
    <CartSSEContext.Provider value={contextValue}>
      {children}
    </CartSSEContext.Provider>
  );
}

// Custom hook to use the context
export function useCartCount(): CartSSEContextType {
  const context = useContext(CartSSEContext);
  
  if (context === undefined) {
    throw new Error('useCartCount must be used within a CartSSEProvider');
  }
  
  return context;
}

// Export context for advanced usage
export { CartSSEContext };
