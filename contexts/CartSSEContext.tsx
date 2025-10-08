import React, { createContext, useContext, ReactNode } from 'react';
import { useCartSSE } from '@/hooks/useCartSSE';

interface CartSSEContextType {
    // Simplified interface - only cart count and connection status
    cartCount: number;
    isConnected: boolean;
    connectionStatus: string;
    connect: () => void;
    disconnect: () => void;
    reconnect: () => void;
    getConnectionStatus: () => string;
}

const CartSSEContext = createContext<CartSSEContextType | undefined>(undefined);

interface CartSSEProviderProps {
    children: ReactNode;
}

export function CartSSEProvider({ children }: CartSSEProviderProps) {
    const cartSSE = useCartSSE();

    return (
        <CartSSEContext.Provider value={cartSSE}>
            {children}
        </CartSSEContext.Provider>
    );
}

export function useCartSSEContext(): CartSSEContextType {
    const context = useContext(CartSSEContext);
    if (context === undefined) {
        throw new Error('useCartSSEContext must be used within a CartSSEProvider');
    }
    return context;
}

// Convenience hook for just the cart count
export function useCartCount() {
    const { cartCount, isConnected, connectionStatus } = useCartSSEContext();
    return {
        count: cartCount,
        isConnected,
        connectionStatus,
    };
}
