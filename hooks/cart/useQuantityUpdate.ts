import { useState, useCallback, useRef, useEffect } from 'react';
import { addToCart, removeFromCart } from '@/api/cart';
import { CustomToast } from '@/components/shared/custome-toast';

interface UseQuantityUpdateProps {
    chadcoCustomerId: number;
    onSuccess?: () => void;
    onQuantityChange?: (itemId: number, newQuantity: number) => void;
}

interface PendingUpdate {
    itemId: number;
    targetQuantity: number;
    originalQuantity: number;
}

/**
 * Custom hook for handling quantity updates with debouncing
 * Uses add/remove API calls to simulate quantity changes
 * Only works for perCount and flat unit types
 */
export const useQuantityUpdate = ({
    chadcoCustomerId,
    onSuccess,
    onQuantityChange,
}: UseQuantityUpdateProps) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const pendingUpdatesRef = useRef<Map<number, PendingUpdate>>(new Map());
    const [optimisticQuantities, setOptimisticQuantities] = useState<Map<number, number>>(new Map());

    // Clear pending updates when component unmounts
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const executeQuantityUpdate = useCallback(async (pendingUpdate: PendingUpdate) => {
        const { itemId, targetQuantity, originalQuantity } = pendingUpdate;
        setIsUpdating(true);

        try {
            if (targetQuantity > originalQuantity) {
                // Increase quantity: add (targetQuantity - originalQuantity) items
                const itemsToAdd = Array(targetQuantity - originalQuantity).fill(itemId);
                await addToCart(itemsToAdd, chadcoCustomerId);
            } else if (targetQuantity < originalQuantity && targetQuantity > 0) {
                // Decrease quantity: remove (originalQuantity - targetQuantity) items
                const itemsToRemove = Array(originalQuantity - targetQuantity).fill(itemId);
                await removeFromCart(itemsToRemove, chadcoCustomerId);
            } else if (targetQuantity === 0) {
                // Remove all items
                await removeFromCart([itemId], chadcoCustomerId);
            }

            // Clear optimistic quantity on success
            setOptimisticQuantities(prev => {
                const newMap = new Map(prev);
                newMap.delete(itemId);
                return newMap;
            });

            CustomToast({
                type: 'success',
                message: 'تعداد با موفقیت به‌روزرسانی شد',
            });
            onSuccess?.();
        } catch (error: any) {
            // Rollback optimistic quantity on error
            setOptimisticQuantities(prev => {
                const newMap = new Map(prev);
                newMap.delete(itemId);
                return newMap;
            });

            // Notify parent component to rollback
            onQuantityChange?.(itemId, originalQuantity);

            const errorMessage = error?.message || 'خطا در به‌روزرسانی تعداد';
            CustomToast({
                type: 'error',
                message: errorMessage,
            });
        } finally {
            setIsUpdating(false);
        }
    }, [chadcoCustomerId, onSuccess, onQuantityChange]);

    const debouncedQuantityUpdate = useCallback((
        itemId: number,
        currentQuantity: number,
        newQuantity: number
    ) => {
        // Immediately update UI optimistically
        setOptimisticQuantities(prev => {
            const newMap = new Map(prev);
            newMap.set(itemId, newQuantity);
            return newMap;
        });

        // Notify parent component of immediate UI change
        onQuantityChange?.(itemId, newQuantity);

        // Store the pending update with original quantity for rollback
        pendingUpdatesRef.current.set(itemId, {
            itemId,
            targetQuantity: newQuantity,
            originalQuantity: currentQuantity
        });

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for debounced execution
        timeoutRef.current = setTimeout(() => {
            const pendingUpdate = pendingUpdatesRef.current.get(itemId);
            if (pendingUpdate) {
                executeQuantityUpdate(pendingUpdate);
                pendingUpdatesRef.current.delete(itemId);
            }
        }, 500); // 500ms debounce delay
    }, [executeQuantityUpdate, onQuantityChange]);

    // Get optimistic quantity for an item
    const getOptimisticQuantity = useCallback((itemId: number, fallbackQuantity: number) => {
        return optimisticQuantities.get(itemId) ?? fallbackQuantity;
    }, [optimisticQuantities]);

    return {
        updateQuantity: debouncedQuantityUpdate,
        isUpdating,
        getOptimisticQuantity,
    };
};

/**
 * Check if an item supports quantity updates
 * Only perCount and flat unit types support quantity changes
 */
export const canUpdateQuantity = (unitType?: string, unitModel?: string): boolean => {
    return unitType === 'perCount' || unitModel === 'flat';
};
