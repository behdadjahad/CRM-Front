import React from 'react';
import { CartItem as CartItemType } from "@/types/cart";
import { Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import QuantityInput from "../shared/quantity-input";
import { convertDaysToMonths } from "@/lib/duration-utils";
import { canUpdateQuantity } from "@/hooks/cart/useCartOperations";

interface CartItemProps {
    item: CartItemType;
    onQuantityChange: (id: string, quantity: number) => void;
    onRemove: () => void;
    isUpdating: boolean;
    isRemoving?: boolean;
    isInBundle?: boolean;
    showPrice?: boolean;
    showRemoveButton?: boolean;
    getOptimisticQuantity?: (itemId: number, fallbackQuantity: number) => number;
    isItemUpdating?: (itemId: number) => boolean;
}

export default function CartItem({
    item,
    onQuantityChange,
    onRemove,
    isUpdating,
    isRemoving = false,
    isInBundle = false,
    showPrice = true,
    showRemoveButton = true,
    getOptimisticQuantity,
    isItemUpdating,
}: CartItemProps) {
    // Get quantity with optimistic updates
    const baseQuantity = item.quantity || 1;
    const quantity = getOptimisticQuantity ? getOptimisticQuantity(item.id, baseQuantity) : baseQuantity;

    // Check if this item supports quantity updates
    const supportsQuantityUpdate = canUpdateQuantity(item.unitType, item.unitModel);

    // Event handlers
    const handleIncrease = () => {
        if (supportsQuantityUpdate) {
            onQuantityChange(item.id.toString(), quantity + 1);
        }
    };

    const handleDecrease = () => {
        if (supportsQuantityUpdate) {
            if (quantity > 1) {
                onQuantityChange(item.id.toString(), quantity - 1);
            } else {
                onRemove(); // Remove item if quantity would be 0
            }
        }
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (supportsQuantityUpdate) {
            onQuantityChange(item.id.toString(), newQuantity);
        }
    };

    // Helper functions
    const getTagClasses = (tag?: string) => {
        switch (tag) {
            case 'best-selling':
                return 'success';
            case 'special':
                return 'warning';
            case 'new':
                return 'info';
            default:
                return 'secondary';
        }
    };

    const getUnitModel = (unitModel: string, showDurationInDays: number, countUnit: number) => {
        switch (unitModel) {
            case 'flat':
                return <span className="text-xs text-my-header-label">بدون محدودیت</span>;
            case 'perCount':
                return <span className="text-xs text-my-header-label">{countUnit} count</span>;
            case 'perDuration':
                return <span className="text-xs text-my-header-label">{showDurationInDays} روز</span>;
            default:
                return <span className="text-xs text-my-header-label">نامشخص</span>;
        }
    };

    // Calculate usage count from accessesJson
    const usageCount = item.accessesJson?.usageCount || 0;

    return (
        <div className={cn(
            "flex flex-col items-center p-4 rounded-lg shadow-sm",
            isInBundle ? "bg-white" : "bg-static-background-light"
        )}>
            {/* Item Header */}
            <div className="flex items-center justify-between w-full mb-3">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <Badge variant={getTagClasses() as any} className="text-xs">
                        {item.name}
                    </Badge>
                </div>

                {showRemoveButton && !isInBundle && (
                    <button
                        onClick={onRemove}
                        disabled={isRemoving}
                        className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Item Details */}
            <div className="w-full text-center mb-3">
                <h3 className="sm:text-lg text-base font-medium text-gray-900 dark:text-white mb-2">
                    {item.name}
                </h3>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    {usageCount > 0 && (
                        <div className="bg-static-background-light text-[10px] text-my-header-label rounded-[10px] px-2 py-1 whitespace-nowrap border border-static-border-neutral">
                            تعداد استفاده: {usageCount}
                        </div>
                    )}

                    <div className="flex border border-[#D5D7DA] rounded-full w-fit px-2.5 py-1 justify-between items-center">
                        {getUnitModel(item.unitModel, item.showDurationInDays, item.countUnit)}
                    </div>
                </div>
            </div>

            {/* Quantity and Price */}
            <div className="flex items-center justify-between w-full">
                {supportsQuantityUpdate && !isInBundle && (
                    <QuantityInput
                        quantity={quantity}
                        onDecreaseQuantity={handleQuantityChange}
                        onIncreaseQuantity={handleQuantityChange}
                        isUpdating={isUpdating}
                        isItemUpdating={isItemUpdating?.(item.id)}
                    />
                )}

                {showPrice && (
                    <div className={cn(
                        "sm:text-xl text-base font-bold",
                        isInBundle ? "text-gray-600" : "text-static-info-primary"
                    )}>
                        {item.price.toLocaleString('fa-IR')} تومان
                    </div>
                )}
            </div>
        </div>
    );
}
