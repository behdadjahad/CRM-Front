"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useCartPolling } from '@/hooks/useCartPolling';

// Context types
interface CartPollingContextType {
  // State
  count: number;
  isConnected: boolean;
  connectionStatus: 'connected' | 'disconnected';
  connectionMessage: string;
  lastUpdated: string | null;
  
  // Actions (for compatibility)
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
}

// Create context
const CartPollingContext = createContext<CartPollingContextType | undefined>(undefined);

// Provider props
interface CartPollingProviderProps {
  children: ReactNode;
}

// Provider component
export function CartPollingProvider({ children }: CartPollingProviderProps) {
  const chadcoCustomerId = useSelector((state: RootState) => state?.login?.chadcoCustomerId);
  
  // State
  const [state, setState] = useState({
    count: 0,
    isConnected: false,
    connectionStatus: 'disconnected' as const,
    connectionMessage: 'Not connected',
    lastUpdated: null as string | null,
  });

  // Polling hook
  const { cartCount, isPolling, lastError } = useCartPolling({
    enabled: !!chadcoCustomerId,
    interval: 5000, // 5 seconds for faster updates
    onCartCountUpdate: (count) => {
      setState(prev => ({
        ...prev,
        count,
        isConnected: true,
        connectionStatus: 'connected',
        connectionMessage: 'Polling active',
        lastUpdated: new Date().toISOString(),
      }));
    },
    onError: (error) => {
      setState(prev => ({
        ...prev,
        isConnected: false,
        connectionStatus: 'disconnected',
        connectionMessage: `Polling error: ${error.message || 'Unknown error'}`,
      }));
    }
  });

  // Update count when polling result changes
  useEffect(() => {
    if (cartCount !== state.count) {
      setState(prev => ({
        ...prev,
        count: cartCount,
        lastUpdated: new Date().toISOString(),
      }));
    }
  }, [cartCount]);

  // Actions (for compatibility with SSE context)
  const connect = () => {
    setState(prev => ({
      ...prev,
      isConnected: true,
      connectionStatus: 'connected',
      connectionMessage: 'Polling started',
    }));
  };

  const disconnect = () => {
    setState(prev => ({
      ...prev,
      isConnected: false,
      connectionStatus: 'disconnected',
      connectionMessage: 'Polling stopped',
    }));
  };

  const reconnect = () => {
    setState(prev => ({
      ...prev,
      isConnected: true,
      connectionStatus: 'connected',
      connectionMessage: 'Polling restarted',
    }));
  };

  // Context value
  const contextValue: CartPollingContextType = {
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
    <CartPollingContext.Provider value={contextValue}>
      {children}
    </CartPollingContext.Provider>
  );
}

// Custom hook to use the context
export function useCartCount(): CartPollingContextType {
  const context = useContext(CartPollingContext);
  
  if (context === undefined) {
    throw new Error('useCartCount must be used within a CartPollingProvider');
  }
  
  return context;
}

// Export context for advanced usage
export { CartPollingContext };
