import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';

export default function OrderSummaryCard() {
    // const { items, discountAmount } = useSelector((state: RootState) => state.cart);

    // const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    // const finalPayable = subtotal - discountAmount;

    const items = 4;
    const discountAmount = 10000;
    const finalPayable = 110000;
    const totalItems = 4;
    const subtotal = 120000;
    const handleCheckout = () => {
        console.log('Initiating checkout with:', { items, discountAmount, finalPayable });
        alert('پرداخت به زودی فعال خواهد شد!');
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">خلاصه سفارش</h3>
            <div className="flex flex-col gap-2 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between">
                    <span>تعداد آیتم‌ها:</span>
                    <span>{totalItems}</span>
                </div>
                <div className="flex justify-between">
                    <span>جمع کل:</span>
                    <span>{subtotal.toLocaleString('fa-IR')} تومن</span>
                </div>
                {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>تخفیف:</span>
                        <span>-{discountAmount.toLocaleString('fa-IR')} تومن</span>
                    </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <div className="flex justify-between font-bold text-xl text-gray-900 dark:text-white">
                    <span>قابل پرداخت:</span>
                    <span>{finalPayable.toLocaleString('fa-IR')} تومن</span>
                </div>
            </div>
            <Button // onClick={handleCheckout} 
                className="w-full mt-4">
                ادامه و پرداخت
            </Button>
        </div>
    );
}
