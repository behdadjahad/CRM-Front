"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useCartCount } from "@/contexts/CartSSEContext";
import { ShoppingCart } from "lucide-react";

export interface CartIconInterface {
  className?: string;
}

export default function CartIcon({ className }: CartIconInterface) {
  const router = useRouter();
  const { count, isConnected, connectionStatus, connectionMessage } = useCartCount();

  const handleCartClick = () => {
    router.push("/cart");
  };

  // Get connection status indicator color
  const getConnectionIndicatorColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-500';
      case 'disconnected':
      default:
        return 'bg-red-500';
    }
  };

  // Get connection status text
  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Live';
      case 'disconnected':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        onClick={handleCartClick}
        title={`Cart (${count} items) - ${connectionMessage}`}
      >
        {/* Shopping Cart Icon */}
        <ShoppingCart className="h-6 w-6 text-gray-700" />

        {/* Item Count Badge */}
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {count > 99 ? "99+" : count}
          </span>
        )}

        {/* SSE Connection Status Indicator */}
        <div
          className={cn(
            "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white transition-colors",
            getConnectionIndicatorColor()
          )}
          title={`Connection: ${getConnectionStatusText()}`}
        />
      </Button>

      {/* Connection Status Tooltip (optional - for debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-black text-white text-xs rounded shadow-lg z-50 opacity-0 hover:opacity-100 transition-opacity">
          <div>Status: {getConnectionStatusText()}</div>
          <div>Count: {count}</div>
          <div>Message: {connectionMessage}</div>
        </div>
      )}
    </div>
  );
}
