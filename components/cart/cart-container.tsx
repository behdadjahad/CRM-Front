"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import OrderSummaryCard from './order-summary-card';
import CartItem from './cart-item';
import { ArrowLeft } from 'lucide-react';
import DiscountCodeCard from './discount-code-card';
import EmptyCart from './empty-cart';
import CartSkeleton from './cart-skeleton';

export default function CartContainer() {
    const router = useRouter();
    const {
        items,
        loading,
        error,
        removeFromCart,
        updateQuantity,
        refreshCart
    } = useCart();

    useEffect(() => {
        // Refresh cart data when component mounts
        refreshCart();
    }, []);

    const handleRemoveItem = (id: string) => {
        removeFromCart(id);
    };

    const handleQuantityChange = (id: string, newQuantity: number) => {
        updateQuantity(id, newQuantity);
    };

    // Show loading skeleton
    if (loading && items.length === 0) {
        return <CartSkeleton />;
    }

    // Show empty cart
    if (!loading && items.length === 0) {
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
                                خطا در بارگذاری سبد خرید: {error}
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
                                {items.map(item => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onQuantityChange={(id, quantity) => handleQuantityChange(id.toString(), quantity)}
                                        onRemove={() => handleRemoveItem(item.id.toString())}
                                        isUpdating={loading}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Left side - Discount & Summary */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 ">
                        <DiscountCodeCard />
                        <OrderSummaryCard />
                    </div>
                </div>
            </div>
        </div>
    );
}