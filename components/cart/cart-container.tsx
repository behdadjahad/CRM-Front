"use client";

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import OrderSummaryCard from './order-summary-card';
import CartItem from './cart-item';
import CartBundleCard from './cart-bundle-card';
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
import { organizeCartItemsWithBundles } from '@/lib/cart-bundle-utils';
import { useQuantityUpdate } from '@/hooks/cart/useQuantityUpdate';

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
    const cartItems = cartData?.data?.items || []; // Items with quantities
    const packageUnits = cartData?.data?.packageUnits || []; // Full item details
    const satisfiedBundles = cartData?.data?.satisfiedBundles || [];
    const error = queryError?.message || null;
    const originalTotal = cartData?.data?.originalTotal || 0;
    const discountAmount = cartData?.data?.discountAmount || 0;
    const taxAmount = cartData?.data?.taxAmount || 0;
    const finalTotal = cartData?.data?.finalTotal || 0;

    // Quantity update hook with debouncing and optimistic updates
    const { updateQuantity, isUpdating: isQuantityUpdating, getOptimisticQuantity, isItemUpdating } = useQuantityUpdate({
        chadcoCustomerId: chadcoCustomerId || 0,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart', chadcoCustomerId] });
        },
    });




    // Merge cart items with quantities for proper display
    const itemsWithQuantities = useMemo(() => {
        return packageUnits.map(unit => {
            const cartItem = cartItems.find(item => item.unitId === unit.id);
            const serverQuantity = cartItem?.count || 1;

            // Use optimistic quantity if available, otherwise use server quantity
            const optimisticQuantity = getOptimisticQuantity(unit.id, serverQuantity);

            return {
                ...unit,
                quantity: optimisticQuantity
            };
        });
    }, [packageUnits, cartItems, getOptimisticQuantity]);

    // Calculate total item count including optimistic quantities
    const itemCount = itemsWithQuantities.reduce((total, item) => total + item.quantity, 0);

    // Organize items into bundles and individual items
    const { bundles, individualItems, bundledItemIds } = useMemo(() =>
        organizeCartItemsWithBundles(itemsWithQuantities, satisfiedBundles),
        [itemsWithQuantities, satisfiedBundles]
    );
    // Helper to extract error message
    const getErrorMessage = (err: any, defaultMessage: string): string => {
        return err?.message || defaultMessage;
    };

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    // Remove item mutation
    // Remove item mutation - NO optimistic updates
    const removeItemMutation = useMutation({
        mutationFn: async ({ packageUnitIds, chadcoCustomerId }: { packageUnitIds: number[], chadcoCustomerId: number }) => {
            return await removeFromCart(packageUnitIds, chadcoCustomerId);
        },
        onError: (err: any) => {
            const errorMessage = getErrorMessage(err, 'خطا در حذف آیتم');
            toast.error(errorMessage);
        },
        onSuccess: () => {
            toast.success('آیتم با موفقیت حذف شد');
            // Refetch cart to get real server state
            queryClient.invalidateQueries({ queryKey: ['cart', chadcoCustomerId] });
        },
    });

    const handleRemoveItem = (id: string) => {
        if (!chadcoCustomerId) return;

        // Find the item to get its quantity
        const item = itemsWithQuantities.find(item => item.id.toString() === id);
        if (!item) return;

        const quantity = item.quantity || 1;

        // Create array with multiple copies of the same ID based on quantity
        const itemIdsToRemove = Array(quantity).fill(parseInt(id));

        removeItemMutation.mutate({
            packageUnitIds: itemIdsToRemove,
            chadcoCustomerId
        });
    };

    const handleRemoveBundle = (bundleId: number) => {
        if (!chadcoCustomerId) return;

        // Find the bundle and get all its item IDs with quantities
        const bundle = bundles.find(b => b.id === bundleId);
        if (!bundle) return;

        // Create array with multiple copies of each item ID based on quantity
        const itemIds = bundle.items.flatMap(item =>
            Array(item.quantity || 1).fill(item.id)
        );

        removeItemMutation.mutate({
            packageUnitIds: itemIds,
            chadcoCustomerId
        });
    };

    const handleQuantityChange = (id: string, newQuantity: number) => {
        if (!chadcoCustomerId) return;

        // Find the current item to get its current quantity
        const currentItem = itemsWithQuantities.find(item => item.id.toString() === id);
        if (!currentItem) return;

        const currentQuantity = currentItem.quantity || 1;

        // Use debounced quantity update
        updateQuantity(currentItem.id, currentQuantity, newQuantity);
    };

    // Show loading skeleton
    if (loading && cartItems.length === 0) {
        return <CartSkeleton />;
    }

    // Show empty cart only if there's no error and no items
    if (!loading && cartItems.length === 0 && !error) {
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
                                <p className="text-lg font-medium text-static-text-primary dark:text-white">
                                    سبد خرید ({itemCount} مورد{bundles.length > 0 && ` - ${bundles.length} باندل`})
                                </p>
                                <div className="flex items-center justify-between">
                                    <div onClick={() => router.push('/single-features')} className="flex items-center cursor-pointer justify-between gap-2 py-0.5 text-sm font-normal text-static-text-primary ">
                                        بازگشت به فیچرها
                                        <ArrowLeft className="w-3 h-3 " />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                {/* Bundles Section */}
                                {bundles.length > 0 && (
                                    <div className="flex flex-col gap-4">
                                        <h3 className="text-md font-semibold text-gray-700 px-4">
                                            باندل‌های شما ({bundles.length})
                                        </h3>
                                        {bundles.map((bundle) => (
                                            <CartBundleCard
                                                key={bundle.id}
                                                bundle={bundle}
                                                onQuantityChange={(id, quantity) => handleQuantityChange(id.toString(), quantity)}
                                                onRemoveBundle={handleRemoveBundle}
                                                isUpdating={isQuantityUpdating}
                                                isRemoving={removeItemMutation.isPending}
                                                getOptimisticQuantity={getOptimisticQuantity}
                                                isItemUpdating={isItemUpdating}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Individual Items Section */}
                                {individualItems.length > 0 && (
                                    <div className="flex flex-col gap-4">
                                        {bundles.length > 0 && (
                                            <h3 className="text-md font-semibold text-gray-700 px-4">
                                                فیچرهای تکی ({individualItems.length})
                                            </h3>
                                        )}
                                        {individualItems.map((item: any) => (
                                            <CartItem
                                                key={item.id}
                                                item={item}
                                                onQuantityChange={(id, quantity) => handleQuantityChange(id.toString(), quantity)}
                                                onRemove={() => handleRemoveItem(item.id.toString())}
                                                isUpdating={isQuantityUpdating}
                                                isRemoving={removeItemMutation.isPending}
                                                getOptimisticQuantity={getOptimisticQuantity}
                                                isItemUpdating={isItemUpdating}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Left side - Discount & Summary */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 ">
                        <DiscountCodeCard
                            cartId={cartData?.data?.id || 0}
                            chadcoCustomerId={chadcoCustomerId || 0}
                        />
                        <OrderSummaryCard
                            // bundleDiscountByAmount={bundleDiscountByAmount}
                            bundles={bundles}
                            cartId={cartData?.data?.id || 0}
                            itemCount={itemCount}
                            originalTotal={originalTotal}
                            discountAmount={discountAmount}
                            discountPercent={cartData?.data?.discountPercent || 0}
                            discountAmountByDiscountCode={cartData?.data?.discountAmountByDiscountCode || null}
                            discountPercentByDiscountCode={cartData?.data?.discountPercentByDiscountCode || null}
                            taxAmount={taxAmount}
                            bundleDiscountPercent={satisfiedBundles[0]?.discountPercent?.value || 0}
                            taxPercent={cartData?.data?.taxPercent || 0}
                            finalTotal={finalTotal}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}