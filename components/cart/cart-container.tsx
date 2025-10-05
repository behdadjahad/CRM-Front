"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import OrderSummaryCard from './order-summary-card';
import CartItem from './cart-item';
import { ArrowLeft, ChevronLeft, Link } from 'lucide-react';
import DiscountCodeCard from './discount-code-card';
const itemslist = [
    {
        id: '1',
        name: 'ویرایش اطلاعات قرارداد',
        category: 'قرارداد',
        description: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ',
        price: 300000,
        quantity: 2,
        tag: 'best-selling',
        usageCount: 15,
    },
    {
        id: '2',
        name: 'سرویس هتل',
        category: 'سرویس هتل',
        description: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ',
        price: 320000,
        quantity: 1,
        tag: 'special',
        durationMonths: 3,
    },
    {
        id: '3',
        name: 'ثبت قرارداد',
        category: 'درخواست',
        description: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ',
        price: 150000,
        quantity: 1,
        tag: 'suggested',
        usageCount: 15,
    },
]

export default function CartContainer() {
    const router = useRouter();
    const [itemslistt, setItemslist] = useState(itemslist);
    const handleRemoveItem = (id: string) => {
        console.log("removing item", id)
    }
    const handleQuantityChange = (id: string, newQuantity: number) => {
        console.log("changing quantity", id, newQuantity)
        //replace item with new quantity
        const updatedItems = itemslistt.map(item => item.id === id ? { ...item, quantity: newQuantity } : item);
        setItemslist(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    }
    useEffect(() => {
        console.log("itemslist", itemslistt)
    }, [itemslistt]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-12 gap-6">
                    {/* Right side - Cart Items */}
                    <div className="col-span-12 lg:col-span-8  bg-white sm:p-4  rounded-2xl flex flex-col gap-6">

                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center flex-row gap-4 p-4  border-gray-200 dark:border-gray-700">
                                <p className="text-lg font-medium text-static-text-primary dark:text-white">سبد خرید ({itemslist.length}) مورد</p>
                                <div className="flex items-center justify-between">
                                    <div onClick={() => router.push('/single-features')} className="flex items-center cursor-pointer justify-between gap-2 py-0.5 text-sm font-normal text-static-text-primary ">
                                        بازگشت به فیچرها
                                        <ArrowLeft className="w-3 h-3 " />
                                    </div>

                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                {itemslistt.map(item => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onQuantityChange={(id, quantity) => handleQuantityChange(id, quantity)}
                                        onRemove={() => handleRemoveItem(item.id)}
                                    // isUpdating={isLoading}
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