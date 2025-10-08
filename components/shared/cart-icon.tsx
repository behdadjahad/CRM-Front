"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useCartCount } from "@/contexts/CartSSEContext";

export interface CartIconInterface {
    className?: string;
}

export default function CartIcon({ className }: CartIconInterface) {
    const router = useRouter();
    const { count, isConnected, connectionStatus } = useCartCount();

    const handleCartClick = () => {
        router.push("/cart");
    };

    // Get connection status indicator color - matching your test page logic
    const getConnectionIndicatorColor = () => {
        switch (connectionStatus) {
            case 'connected':
                return 'bg-green-500';
            case 'connecting':
                return 'bg-yellow-500';
            case 'disconnected':
            case 'error':
            default:
                return 'bg-red-500';
        }
    };

    return (
        <Button
            variant="ghost"
            className={cn("relative p-2 hover:bg-gray-100 rounded-full", className)}
            onClick={handleCartClick}
        >
            <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {count > 99 ? "99+" : count}
                </span>
            )}
            {/* SSE Connection Status Indicator - matching your test page */}
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getConnectionIndicatorColor()}`} />
        </Button>
    );
}

