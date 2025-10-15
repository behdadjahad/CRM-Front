import { useState, useCallback, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCart, removeFromCart } from '@/api/cart';
import { CustomToast } from '@/components/shared/custome-toast';

interface UseCartOperationsProps {
    chadcoCustomerId: number;
}

interface PendingUpdate {
    itemId: number;
    targetQuantity: number;
    originalQuantity: number;
}

/**
 * Comprehensive cart operations hook
 * Combines quantity updates, add/remove operations with debouncing and optimistic updates
 */
export const useCartOperations = ({ chadcoCustomerId }: UseCartOperationsProps) => {
    const queryClient = useQueryClient();
    const [isUpdating, setIsUpdating] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const pendingUpdatesRef = useRef<Map<number, PendingUpdate>>(new Map());
    const [optimisticQuantities, setOptimisticQuantities] = useState<Map<number, number>>(new Map());
    const [failedItems, setFailedItems] = useState<Set<number>>(new Set());

    // Clear pending updates when component unmounts
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Add to cart mutation
    const addToCartMutation = useMutation({
        mutationFn: async ({ unitIds }: { unitIds: number[] }) => {
            return await addToCart(unitIds, chadcoCustomerId);
        },
        onError: (err: any) => {
            const errorMessage = err?.message || 'خطا در افزودن به سبد خرید';
            CustomToast({
                type: 'error',
                message: errorMessage,
            });
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['cart', chadcoCustomerId] });
            CustomToast({
                type: 'success',
                message: 'آیتم با موفقیت به سبد خرید اضافه شد',
            });
        },
    });

    // Remove from cart mutation
    const removeFromCartMutation = useMutation({
        mutationFn: async ({ unitIds }: { unitIds: number[] }) => {
            return await removeFromCart(unitIds, chadcoCustomerId);
        },
        onError: (err: any) => {
            const errorMessage = err?.message || 'خطا در حذف از سبد خرید';
            CustomToast({
                type: 'error',
                message: errorMessage,
            });
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['cart', chadcoCustomerId] });
            CustomToast({
                type: 'success',
                message: 'آیتم از سبد خرید حذف شد',
            });
        },
    });

    // Execute quantity update with proper error handling
    const executeQuantityUpdate = useCallback(async (pendingUpdate: PendingUpdate) => {
        const { itemId, targetQuantity, originalQuantity } = pendingUpdate;
        setIsUpdating(true);

        try {
            if (targetQuantity > originalQuantity) {
                const itemsToAdd = Array(targetQuantity - originalQuantity).fill(itemId);
                await addToCart(itemsToAdd, chadcoCustomerId);
            } else if (targetQuantity < originalQuantity && targetQuantity > 0) {
                const itemsToRemove = Array(originalQuantity - targetQuantity).fill(itemId);
                await removeFromCart(itemsToRemove, chadcoCustomerId);
            } else if (targetQuantity === 0) {
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

            // Delay the refetch to allow optimistic state to clear first
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['cart', chadcoCustomerId] });
            }, 100);
        } catch (error: any) {
            // Mark item as failed
            setFailedItems(prev => new Set([...Array.from(prev), itemId]));

            // Rollback optimistic quantity on error
            setOptimisticQuantities(prev => {
                const newMap = new Map(prev);
                newMap.delete(itemId);
                return newMap;
            });

            const errorMessage = error?.message || 'خطا در به‌روزرسانی تعداد';
            CustomToast({
                type: 'error',
                message: errorMessage,
            });
        } finally {
            setIsUpdating(false);
        }
    }, [chadcoCustomerId, queryClient]);

    // Debounced quantity update
    const updateQuantity = useCallback((
        itemId: number,
        currentQuantity: number,
        newQuantity: number
    ) => {
        // Clear failed state for this item when starting new update
        setFailedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
        });

        // Immediately update UI optimistically
        setOptimisticQuantities(prev => {
            const newMap = new Map(prev);
            newMap.set(itemId, newQuantity);
            return newMap;
        });

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
    }, [executeQuantityUpdate]);

    // Get optimistic quantity for an item
    const getOptimisticQuantity = useCallback((itemId: number, fallbackQuantity: number) => {
        // Check if this item has failed - if so, use server quantity
        if (failedItems.has(itemId)) {
            return fallbackQuantity;
        }

        // Check if there's an optimistic quantity for this item
        const optimisticQuantity = optimisticQuantities.get(itemId);

        // If there's an optimistic quantity, use it (even if pending)
        if (optimisticQuantity !== undefined) {
            return optimisticQuantity;
        }

        // Only fall back to server quantity if no optimistic update exists
        return fallbackQuantity;
    }, [optimisticQuantities, failedItems]);

    // Check if a specific item is being updated
    const isItemUpdating = useCallback((itemId: number) => {
        return optimisticQuantities.has(itemId);
    }, [optimisticQuantities]);

    // Remove item with all quantities
    const removeItem = useCallback((itemId: number, quantity: number) => {
        const itemIdsToRemove = Array(quantity).fill(itemId);
        removeFromCartMutation.mutate({ unitIds: itemIdsToRemove });
    }, [removeFromCartMutation]);

    // Remove bundle with all quantities
    const removeBundle = useCallback((bundleItems: Array<{ id: number; quantity?: number }>) => {
        const itemIds = bundleItems.flatMap(item =>
            Array(item.quantity || 1).fill(item.id)
        );
        removeFromCartMutation.mutate({ unitIds: itemIds });
    }, [removeFromCartMutation]);

    return {
        // Quantity operations
        updateQuantity,
        getOptimisticQuantity,
        isItemUpdating,
        isUpdating,

        // Direct operations
        addToCart: (unitIds: number[]) => addToCartMutation.mutate({ unitIds }),
        removeItem,
        removeBundle,

        // Loading states
        isAddingToCart: addToCartMutation.isPending,
        isRemovingFromCart: removeFromCartMutation.isPending,
    };
};

/**
 * Check if an item supports quantity updates
 * Only perCount and flat unit types support quantity changes
 */
export const canUpdateQuantity = (unitType?: string, unitModel?: string): boolean => {
    return unitType === 'perCount' || unitModel === 'flat';
};
