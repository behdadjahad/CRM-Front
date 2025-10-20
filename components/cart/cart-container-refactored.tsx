"use client";

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';

import { RootState } from '@/store';
import { getCartItems } from '@/api/cart';
import { CartApiResponse } from '@/types/cart';
import { organizeCartItemsWithBundles } from '@/lib/cart-bundle-utils';
import { useCartOperations } from '@/hooks/cart/useCartOperations';

import OrderSummaryCard from './order-summary-card';
import CartItem from './cart-item';
import CartBundleCard from './cart-bundle-card';
import DiscountCodeCard from './discount-code-card';
import EmptyCart from './empty-cart';
import CartSkeleton from './cart-skeleton';

export default function CartContainer() {
    const router = useRouter();
    const chadcoCustomerId = useSelector((state: RootState) => state?.login?.chadcoCustomerId);

    // Fetch cart data using React Query
    const {
        data: cartData,
        isLoading: loading,
        error: queryError,
    } = useQuery<CartApiResponse | null>({
        queryKey: ['cart', chadcoCustomerId],
        queryFn: async () => {
            if (!chadcoCustomerId) return null;
            return await getCartItems(chadcoCustomerId);
        },
        enabled: !!chadcoCustomerId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Cart operations hook
    const {
        updateQuantity,
        getOptimisticQuantity,
        isItemUpdating,
        removeItem,
        removeBundle,
        isRemovingFromCart,
    } = useCartOperations({ chadcoCustomerId: chadcoCustomerId || 0 });

    // Extract cart data from API response
    const cartItems = cartData?.data?.items || [];
    const packageUnits = cartData?.data?.packageUnits || [];
    const satisfiedBundles = cartData?.data?.satisfiedBundles || [];

    // Cart summary data
    const cartSummary = useMemo(() => ({
        originalTotal: cartData?.data?.originalTotal || 0,
        discountAmount: cartData?.data?.discountAmount || 0,
        discountPercent: cartData?.data?.discountPercent || 0,
        discountAmountByDiscountCode: cartData?.data?.discountAmountByDiscountCode || null,
        discountPercentByDiscountCode: cartData?.data?.discountPercentByDiscountCode || null,
        taxAmount: cartData?.data?.taxAmount || 0,
        taxPercent: cartData?.data?.taxPercent || 0,
        finalTotal: cartData?.data?.finalTotal || 0,
        cartId: cartData?.data?.id || 0,
        itemCount: cartItems.reduce((total, item) => total + item.count, 0),
    }), [cartData, cartItems]);

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

    // Organize items into bundles and individual items
    const { bundles, individualItems } = useMemo(() =>
        organizeCartItemsWithBundles(itemsWithQuantities, satisfiedBundles),
        [itemsWithQuantities, satisfiedBundles]
    );

    // Event handlers
    const handleQuantityChange = (id: string, newQuantity: number) => {
        if (!chadcoCustomerId) return;

        // Find the current item to get its current quantity
        const currentItem = itemsWithQuantities.find(item => item.id.toString() === id);
        if (!currentItem) return;

        const currentQuantity = currentItem.quantity || 1;

        // Use debounced quantity update
        updateQuantity(currentItem.id, currentQuantity, newQuantity);
    };

    const handleRemoveItem = (id: string) => {
        if (!chadcoCustomerId) return;

        // Find the item to get its quantity
        const item = itemsWithQuantities.find(item => item.id.toString() === id);
        if (!item) return;

        const quantity = item.quantity || 1;
        removeItem(item.id, quantity);
    };

    const handleRemoveBundle = (bundleId: number) => {
        if (!chadcoCustomerId) return;

        // Find the bundle and get all its item IDs with quantities
        const bundle = bundles.find(b => b.id === bundleId);
        if (!bundle) return;

        removeBundle(bundle.items);
    };

    // Loading state
    if (loading) {
        return <CartSkeleton />;
    }

    // Error state
    if (queryError?.message) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold text-red-600 mb-4">خطا در بارگذاری سبد خرید</h2>
                        <p className="text-gray-600">{queryError.message}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Empty cart state
    if (cartSummary.itemCount === 0) {
        return <EmptyCart />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Cart Items Section */}
                    <div className="lg:col-span-8 col-span-12">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            {/* Cart Header */}
                            <div className="flex justify-between items-center flex-row gap-4 p-4 border-gray-200 dark:border-gray-700">
                                <p className="text-lg font-medium text-static-text-primary dark:text-white">
                                    سبد خرید ({cartSummary.itemCount} مورد{bundles.length > 0 && ` - ${bundles.length} باندل`})
                                </p>
                                <div className="flex items-center justify-between">
                                    <div
                                        onClick={() => router.push('/single-features')}
                                        className="flex items-center cursor-pointer justify-between gap-2 py-0.5 text-sm font-normal text-static-text-primary"
                                    >
                                        بازگشت به فیچرها
                                        <ArrowLeft className="w-3 h-3" />
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
                                                onQuantityChange={handleQuantityChange}
                                                onRemoveBundle={handleRemoveBundle}
                                                isUpdating={false}
                                                isRemoving={isRemovingFromCart}
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
                                                onQuantityChange={handleQuantityChange}
                                                onRemove={() => handleRemoveItem(item.id.toString())}
                                                isUpdating={false}
                                                isRemoving={isRemovingFromCart}
                                                getOptimisticQuantity={getOptimisticQuantity}
                                                isItemUpdating={isItemUpdating}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Section */}
                    <div className="lg:col-span-4 col-span-12">
                        <div className="flex flex-col gap-6">
                            {/* Discount Code Card */}
                            <DiscountCodeCard
                                cartId={cartSummary.cartId}
                                chadcoCustomerId={chadcoCustomerId || 0}
                            />

                            {/* Order Summary Card */}
                            <OrderSummaryCard
                                cartId={cartSummary.cartId}
                                itemCount={cartSummary.itemCount}
                                originalTotal={cartSummary.originalTotal}
                                discountAmount={cartSummary.discountAmount}
                                discountPercent={cartSummary.discountPercent}
                                discountAmountByDiscountCode={cartSummary.discountAmountByDiscountCode}
                                discountPercentByDiscountCode={cartSummary.discountPercentByDiscountCode}
                                taxAmount={cartSummary.taxAmount}
                                taxPercent={cartSummary.taxPercent}
                                finalTotal={cartSummary.finalTotal}
                                bundles={bundles}
                                bundleDiscountPercent={0} // This should be calculated from bundles
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
