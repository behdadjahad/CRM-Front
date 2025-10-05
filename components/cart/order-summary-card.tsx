import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { COLOR_MAPPING } from '@/constants/color-mapping';

export default function OrderSummaryCard() {
    // const { items, discountAmount } = useSelector((state: RootState) => state.cart);

    // const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    // const finalPayable = subtotal - discountAmount;
    const invoiceData = {
        invoiceNumber: "1234567890",
        paymentMethod: "GATEWAY",
        originalTotal: 120000,
        discountPercent: 10,
        discountAmount: 10000,
    }

    const handlePayment = () => {
        alert('پرداخت به زودی فعال خواهد شد!');
    };
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
        <div className="bg-white border border-static-border-light p-6 text-right font-primary-medium text-sm leading-[140%] tracking-normal rounded-[12px]" >
            <h2 className="text-base font-medium leading-snug text-black mb-6 flex  items-center gap-2">
                <Image src="/icons/payment-icon.svg" alt="order-summary-card-icon" width={20} height={20} />
                خلاصه سفارش
            </h2>

            <div className="w-full flex flex-col gap-6">
                {/* Package Name */}
                <div className="flex justify-between items-center">
                    <span className="text-static-secondary-gray text-sm font-primary-medium leading-[140%] tracking-normal" > تعداد کل ایتم ها:</span>
                    <span className="font-medium text-static-secondary-gray-dark">{invoiceData?.invoiceNumber?.slice(0, 5) || "-"}</span>
                </div>


                {/* Base Price */}
                <div className="flex justify-between items-center">
                    <span className="text-static-secondary-gray text-sm font-primary-medium leading-[140%] tracking-normal" >مجموع :</span>
                    <span className="font-medium text-static-secondary-gray-dark">
                        {invoiceData?.originalTotal ? formatPrice(invoiceData.originalTotal) : "-"} تومان
                    </span>
                </div>

                {/* Discount */}



                {/* Total Amount */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-static-secondary-gray text-sm font-primary-medium leading-[140%] tracking-normal" >مدت زمان اعتبار:</span>
                        {
                            invoiceData?.discountPercent && invoiceData?.discountPercent > 0 && (<div className=" text-[10px] text-static-info-primary whitespace-nowrap bg-white border-static-info-primary rounded-lg border  py-1 px-2">
                                {invoiceData?.discountPercent || 0}% تخفیف
                            </div>)
                        }


                    </div>
                    <span className="font-medium text-static-secondary-gray-dark whitespace-nowrap">
                        {invoiceData?.discountAmount ? formatPrice(invoiceData.discountAmount) : "-"}
                        {invoiceData?.discountPercent && invoiceData?.discountPercent > 0 ? ` تومان` : "-"}

                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-static-secondary-gray text-sm font-primary-medium leading-[140%] tracking-normal" >  مالیات (9%):</span>
                    <span className="font-medium text-static-info-primary">time</span>
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
