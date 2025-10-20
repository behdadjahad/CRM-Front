/**
 * Custom hook for cart operations
 * Centralizes all cart mutations (add, remove, update)
 * NO optimistic updates - uses real server responses
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCart, removeFromCart } from '@/api/cart';
import { CustomToast } from '@/components/shared/custome-toast';

interface UseCartActionsProps {
    chadcoCustomerId: number;
    onAddSuccess?: (unitIds: number[]) => void;
    onRemoveSuccess?: (unitIds: number[]) => void;
}

export const useCartActions = ({
    chadcoCustomerId,
    onAddSuccess,
    onRemoveSuccess,
}: UseCartActionsProps) => {
    const queryClient = useQueryClient();

    // Add to cart mutation - NO optimistic updates
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
            // Only update after server confirms
            queryClient.invalidateQueries({ queryKey: ['cart', chadcoCustomerId] });
            CustomToast({
                type: 'success',
                message: 'آیتم با موفقیت به سبد خرید اضافه شد',
            });
            onAddSuccess?.(variables.unitIds);
        },
    });

    // Remove from cart mutation - NO optimistic updates
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
            // Only update after server confirms
            queryClient.invalidateQueries({ queryKey: ['cart', chadcoCustomerId] });
            CustomToast({
                type: 'success',
                message: 'آیتم از سبد خرید حذف شد',
            });
            onRemoveSuccess?.(variables.unitIds);
        },
    });

    return {
        addToCart: (unitIds: number[]) => addToCartMutation.mutate({ unitIds }),
        removeFromCart: (unitIds: number[]) => removeFromCartMutation.mutate({ unitIds }),
        isAddingToCart: addToCartMutation.isPending,
        isRemovingFromCart: removeFromCartMutation.isPending,
        addToCartMutation,
        removeFromCartMutation,
    };
};

