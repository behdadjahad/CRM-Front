"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export interface CartIconInterface {
    className?: string;
}

export default function CartIcon({ className }: CartIconInterface) {
    const router = useRouter();
    const itemCount = useSelector((state: RootState) => state.cart?.items?.length || 0);

    const handleCartClick = () => {
        // Navigate to cart page - adjust the route as needed
        router.push("/cart");
    };

    return (
        <Button
            variant="ghost"
            className={cn("relative p-2 hover:bg-gray-100 rounded-full", className)}
            onClick={handleCartClick}
        >
            <ShoppingCart className="h-6 w-6 text-gray-700" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount > 99 ? "99+" : itemCount}
                </span>
            )}
        </Button>
    );
}

