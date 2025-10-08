"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OrderSummaryCard from './order-summary-card';
import CartItem from './cart-item';
import { ArrowLeft } from 'lucide-react';
import DiscountCodeCard from './discount-code-card';
import EmptyCart from './empty-cart';
import CartSkeleton from './cart-skeleton';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { removeFromCart, updateCartItemQuantity, getCartItems } from '@/api/cart';
import { CartApiResponse, CartItem as CartItemType } from '@/types/cart';
import toast from 'react-hot-toast';

export default function CartContainer() {
    const router = useRouter();
    const chadcoCustomerId = useSelector((state: RootState) => state?.login?.chadcoCustomerId);
    const queryClient = useQueryClient();


    // Fetch cart data using React Query
    const {
        data: cartData,
        isLoading: loading,
        error: queryError,
        refetch: refreshCart
    } = useQuery<CartApiResponse | null>({
        queryKey: ['cart', chadcoCustomerId],
        queryFn: async () => {
            if (!chadcoCustomerId) return null;
            return await getCartItems(chadcoCustomerId);
        },
        enabled: !!chadcoCustomerId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Extract cart data from API response
    const items = cartData?.data?.packageUnits || [];
    const error = queryError?.message || null;
    const originalTotal = cartData?.data?.originalTotal || 0;
    const discountAmount = cartData?.data?.discountAmount || 0;
    const taxAmount = cartData?.data?.taxAmount || 0;
    const finalTotal = cartData?.data?.finalTotal || 0;
    const itemCount = items.length;

    // Helper to extract error message
    const getErrorMessage = (err: any, defaultMessage: string): string => {
        return err?.message || defaultMessage;
    };

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    // Remove item mutation
    const removeItemMutation = useMutation({
        mutationFn: async ({ packageUnitIds, chadcoCustomerId }: { packageUnitIds: number[], chadcoCustomerId: number }) => {
            return await removeFromCart(packageUnitIds, chadcoCustomerId);
        },
        onMutate: async ({ packageUnitIds }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['cart', chadcoCustomerId] });

            // Snapshot the previous value
            const previousCart = queryClient.getQueryData(['cart', chadcoCustomerId]);

            // Optimistically update to the new value
            queryClient.setQueryData<CartApiResponse>(['cart', chadcoCustomerId], (old) => {
                if (!old?.data?.packageUnits) return old;

                const updatedItems = old.data.packageUnits.filter((item: CartItemType) =>
                    !packageUnitIds.includes(item.id)
                );

                // Recalculate totals
                const newOriginalTotal = updatedItems.reduce((sum, item) => sum + item.price, 0);

                return {
                    ...old,
                    data: {
                        ...old.data,
                        packageUnits: updatedItems,
                        originalTotal: newOriginalTotal,
                        finalTotal: newOriginalTotal - old.data.discountAmount + old.data.taxAmount,
                    }
                };
            });

            // Return a context object with the snapshotted value
            return { previousCart };
        },
        onError: (err: any, _variables, context) => {
            if (context?.previousCart) {
                queryClient.setQueryData(['cart', chadcoCustomerId], context.previousCart);
            }
            const errorMessage = getErrorMessage(err, 'خطا در حذف آیتم');
            toast.error(errorMessage);
        },
        onSuccess: () => {
            toast.success('آیتم با موفقیت حذف شد');
        },
        onSettled: () => {
            // Always refetch after error or success to ensure server state
            queryClient.invalidateQueries({ queryKey: ['cart', chadcoCustomerId] });
        },
    });

    // Update quantity mutation
    const updateQuantityMutation = useMutation({
        mutationFn: async ({ itemId, quantity, chadcoCustomerId }: { itemId: string, quantity: number, chadcoCustomerId: number }) => {
            return await updateCartItemQuantity(itemId, quantity, chadcoCustomerId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart', chadcoCustomerId] });
            toast.success('تعداد با موفقیت به‌روزرسانی شد');
        },
        onError: (err: any) => {
            const errorMessage = getErrorMessage(err, 'خطا در به‌روزرسانی تعداد');
            toast.error(errorMessage);
        },
    });

    const handleRemoveItem = (id: string) => {
        if (!chadcoCustomerId) return;

        removeItemMutation.mutate({
            packageUnitIds: [parseInt(id)],
            chadcoCustomerId
        });
    };

    const handleQuantityChange = (id: string, newQuantity: number) => {
        if (!chadcoCustomerId) return;

        updateQuantityMutation.mutate({
            itemId: id,
            quantity: newQuantity,
            chadcoCustomerId
        });
    };

    // Show loading skeleton
    if (loading && items.length === 0) {
        return <CartSkeleton />;
    }

    // Show empty cart only if there's no error and no items
    if (!loading && items.length === 0 && !error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto p-6">
                    <EmptyCart />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Right side - Cart Items */}
                    <div className="col-span-12 lg:col-span-8  bg-white sm:p-4  rounded-2xl flex flex-col gap-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span>خطا در بارگذاری سبد خرید: {error}</span>
                                    <button
                                        onClick={() => refreshCart()}
                                        className="text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
                                    >
                                        تلاش مجدد
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center flex-row gap-4 p-4  border-gray-200 dark:border-gray-700">
                                <p className="text-lg font-medium text-static-text-primary dark:text-white">سبد خرید ({items.length}) مورد</p>
                                <div className="flex items-center justify-between">
                                    <div onClick={() => router.push('/single-features')} className="flex items-center cursor-pointer justify-between gap-2 py-0.5 text-sm font-normal text-static-text-primary ">
                                        بازگشت به فیچرها
                                        <ArrowLeft className="w-3 h-3 " />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                {items.map((item: any) => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onQuantityChange={(id, quantity) => handleQuantityChange(id.toString(), quantity)}
                                        onRemove={() => handleRemoveItem(item.id.toString())}
                                        isUpdating={updateQuantityMutation.isPending}
                                        isRemoving={removeItemMutation.isPending}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Left side - Discount & Summary */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 ">
                        <DiscountCodeCard />
                        <OrderSummaryCard
                            cartId={cartData?.data?.id || 0}
                            itemCount={itemCount}
                            originalTotal={originalTotal}
                            discountAmount={discountAmount}
                            discountPercent={cartData?.data?.discountPercent || 0}
                            discountAmountByDiscountCode={cartData?.data?.discountAmountByDiscountCode || null}
                            discountPercentByDiscountCode={cartData?.data?.discountPercentByDiscountCode || null}
                            taxAmount={taxAmount}
                            taxPercent={cartData?.data?.taxPercent || 0}
                            finalTotal={finalTotal}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}