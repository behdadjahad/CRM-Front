"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useCartCount } from "@/hooks/useCartCount";
import {ShoppingCart } from "lucide-react";


export interface CartIconInterface {
  className?: string;
}

export default function CartIcon({ className }: CartIconInterface) {
  const router = useRouter();
  const { count, isConnected } = useCartCount();

  const handleCartClick = () => {
    router.push("/cart");
  };

  
  return (
    <div
      className={cn(
        "bg-badge p-2 rounded-lg flex flex-row items-center justify-center gap-3 outline-none h-10 w-10",
        className
      )}
    >
      <Button
        variant="ghost"
        className="relative p-2  transition-colors"
        onClick={handleCartClick}
        title={`Cart (${count} items) - ${isConnected ? 'Live' : 'Offline'}`}
      >
        {/* Shopping Cart Icon */}
        <ShoppingCart className="h-6 w-6 text-gray-700" />

        {/* Item Count Badge */}
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {count > 99 ? "99+" : count}
          </span>
        )}


      </Button>


    </div>
  );
}
