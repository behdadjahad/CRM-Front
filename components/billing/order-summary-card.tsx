"use client";

import React from "react";
import { OrderSummaryCardProps } from "@/types/billing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function OrderSummaryCard({
    packageData,
    selectedDuration,
    onPay,
}: OrderSummaryCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("fa-IR").format(price);
    };

    // Use selected duration data if available, otherwise fall back to package data
    const displayData = selectedDuration ? {
        name: packageData.name,
        type: packageData.type,
        purchaseType: selectedDuration.title,
        basePrice: selectedDuration.originalPrice,
        discount: selectedDuration.discount,
        validityPeriod: packageData.validityPeriod,
        totalAmount: selectedDuration.currentPrice,
    } : {
        name: packageData.name,
        type: packageData.type,
        purchaseType: packageData.purchaseType,
        basePrice: packageData.basePrice,
        discount: packageData.discount,
        validityPeriod: packageData.validityPeriod,
        totalAmount: packageData.basePrice - packageData.discount.amount,
    };

    return (
        <div className="bg-white border border-[#D3D3D3] p-6 text-right font-primary-medium text-sm leading-[140%] tracking-normal rounded-[12px]" >
            <h2 className="text-base font-medium leading-snug text-black mb-6 flex  items-center gap-2">
                <Image src="/icons/payment-icon.svg" alt="order-summary-card-icon" width={20} height={20} />
                خلاصه سفارش
            </h2>

            <div className="w-full flex flex-col gap-6">
                {/* Package Name */}
                <div className="flex justify-between items-center">
                    <span className="text-[#717680] text-sm font-primary-medium leading-[140%] tracking-normal" >نام پکیج:</span>
                    <span className="font-medium text[#414651]">{displayData.name}</span>
                </div>

                {/* Package Type */}
                <div className="flex justify-between items-center">
                    <span className="text-[#717680] text-sm font-primary-medium leading-[140%] tracking-normal" >بر اساس تعداد/زمان:</span>
                    <span className="font-medium text[#414651]">
                        {displayData.type === 'rental' ? 'اجاره ای' : 'خریداری'}
                    </span>
                </div>

                {/* Purchase Type / Duration */}
                <div className="flex justify-between items-center">
                    <span className="text-[#717680] text-sm font-primary-medium leading-[140%] tracking-normal" >نوع خرید:</span>
                    <span className="font-medium text[#414651]">{displayData.purchaseType}</span>
                </div>

                {/* Base Price */}
                <div className="flex justify-between items-center">
                    <span className="text-[#717680] text-sm font-primary-medium leading-[140%] tracking-normal" >قیمت پایه:</span>
                    <span className="font-medium text[#414651]">
                        {formatPrice(displayData.basePrice)} تومان
                    </span>
                </div>

                {/* Discount */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-[#717680] text-sm font-primary-medium leading-[140%] tracking-normal" >تخفیف:</span>

                        <div className=" text-[10px] text-[#1C68DA] whitespace-nowrap bg-white border-[#1C68DA] rounded-lg border  py-1 px-2">
                            {displayData.discount.percentage}% تخفیف
                        </div>

                    </div>
                    <span className="font-medium text[#414651] whitespace-nowrap">
                        {formatPrice(displayData.discount.amount)} تومان
                    </span>
                </div>

                {/* Validity Period */}
                <div className="flex justify-between items-center">
                    <span className="text-[#717680] text-sm font-primary-medium leading-[140%] tracking-normal" >مدت زمان اعتبار:</span>
                    <span className="font-medium text-[#1C68DA]">{displayData.validityPeriod}</span>
                </div>



                {/* Total Amount */}
                <div className="flex justify-between items-center">
                    <span className="text-base font-normal text-[#535862]">جمع کل:</span>
                    <span className="text-base font-medium text-[#535862] ">
                        {formatPrice(displayData.totalAmount)} تومان
                    </span>
                </div>
            </div>

            {/* Pay Button */}
            <div className="mt-8  w-full ">
                <Button
                    variant={"info"}
                    onClick={onPay}
                    className="w-full"
                >
                    پرداخت
                </Button>
            </div>
        </div>
    );
}
