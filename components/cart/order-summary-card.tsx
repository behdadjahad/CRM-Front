import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

export default function OrderSummaryCard() {
    const { items, total, subtotal, discountAmount } = useSelector((state: RootState) => state.cart);

    const totalItems = items?.length || 0;
    const taxRate = 0.09; // 9% tax
    const taxAmount = subtotal * taxRate;
    const finalPayable = subtotal + taxAmount - discountAmount;

    const handlePayment = () => {
        alert('پرداخت به زودی فعال خواهد شد!');
    };

    const handleCheckout = () => {
        console.log('Initiating checkout with:', { items, totalItems, subtotal, taxAmount, discountAmount, finalPayable });
        alert('پرداخت به زودی فعال خواهد شد!');
    };

    return (
        <div className="bg-white border border-static-border-light p-6 text-right font-primary-medium text-sm leading-[140%] tracking-normal rounded-[12px]" >
            <h2 className="text-base font-medium leading-snug text-black mb-6 flex  items-center gap-2">
                <Image src="/icons/payment-icon.svg" alt="order-summary-card-icon" width={20} height={20} />
                خلاصه سفارش
            </h2>

            <div className="w-full flex flex-col gap-6">
                {/* Total Items */}
                <div className="flex justify-between items-center">
                    <span className="text-static-secondary-gray text-sm font-primary-medium leading-[140%] tracking-normal">تعداد کل ایتم ها:</span>
                    <span className="font-medium text-static-secondary-gray-dark">{totalItems} مورد</span>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between items-center">
                    <span className="text-static-secondary-gray text-sm font-primary-medium leading-[140%] tracking-normal">مجموع:</span>
                    <span className="font-medium text-static-secondary-gray-dark">
                        {formatPrice(subtotal)} تومان
                    </span>
                </div>

                {/* Discount */}
                {discountAmount > 0 && (
                    <div className="flex justify-between items-center">
                        <span className="text-static-secondary-gray text-sm font-primary-medium leading-[140%] tracking-normal">تخفیف:</span>
                        <span className="font-medium text-green-600">
                            - {formatPrice(discountAmount)} تومان
                        </span>
                    </div>
                )}

                {/* Tax */}
                <div className="flex justify-between items-center">
                    <span className="text-static-secondary-gray text-sm font-primary-medium leading-[140%] tracking-normal">مالیات (9%):</span>
                    <span className="font-medium text-static-secondary-gray-dark">
                        {formatPrice(taxAmount)} تومان
                    </span>
                </div>

                {/* Final Total */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-base font-semibold text-gray-900">مبلغ قابل پرداخت:</span>
                    <span className="text-xl font-bold text-static-info-primary">
                        {formatPrice(finalPayable)} تومان
                    </span>
                </div>
            </div>

            {/* Pay Button */}
            <div className="mt-8 w-f w-full flex lg:flex-col sm:flex-row flex-col lg:justify-between justify-center gap-2 items-center ">
                <Button
                    variant={"info"}
                    onClick={handlePayment}
                    className="lg:w-full  w-full sm:w-fit px-20 py-2 text-base font-medium"
                >
                    پرداخت
                </Button>
                <Button variant={'outline'} className='lg:w-full  text-base py-2 w-full font-medium text-black border border-black sm:w-fit px-12 '>
                    ایجاد باندل (13% تخفیف )
                </Button>
            </div>
        </div>
    );
}
