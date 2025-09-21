"use client";

import React from "react";
import { InvoiceResponse, OrderSummaryCardProps, SingleInvoice } from "@/types/billing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getSingleInvoice, payInvoice } from "@/api/invoices";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
export default function OrderSummaryCard({
    packageData,
    selectedDuration,
    onPay,
}: OrderSummaryCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("fa-IR").format(price);
    };
    const { id } = useParams();


    const { data: response, isLoading, error } = useQuery<InvoiceResponse>({
        queryKey: ["invoice", id],
        queryFn: () => getSingleInvoice(Number(id)),
        staleTime: 5 * 60 * 1000, // 5 minutes - prevents unnecessary refetches
        gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in newer versions)
    });
    const invoiceData: SingleInvoice | undefined = response?.data;

    const { mutate: payInvoiceMutation } = useMutation({
        mutationFn: (id: number) => payInvoice(id, invoiceData?.chadcoCustomerId || 0),
        onSuccess: () => {
            alert("پرداخت با موفقیت انجام شد");
        },
    });

    const handlePayment = () => {
        payInvoiceMutation(Number(id));
    }

    // Show skeleton while loading
    if (isLoading) {
        return (
            <div className="bg-white border border-[#D3D3D3] p-6 text-right font-primary-medium text-sm leading-[140%] tracking-normal rounded-[12px]">
                {/* Header Skeleton */}
                <div className="flex items-center gap-2 mb-6">
                    <Skeleton className="w-5 h-5" />
                    <Skeleton className="h-6 w-32" />
                </div>

                <div className="w-full flex flex-col gap-6">
                    {/* Package Name Skeleton */}
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                    </div>

                    {/* Package Type Skeleton */}
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-16" />
                    </div>

                    {/* Purchase Type Skeleton */}
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                    </div>

                    {/* Base Price Skeleton */}
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-28" />
                    </div>

                    {/* Discount Skeleton */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-6 w-20 rounded-lg" />
                        </div>
                        <Skeleton className="h-4 w-20" />
                    </div>

                    {/* Validity Period Skeleton */}
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-20" />
                    </div>

                    {/* Total Amount Skeleton */}
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                </div>

                {/* Pay Button Skeleton */}
                <div className="mt-8 w-full">
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="bg-white border border-red-200 p-6 text-right font-primary-medium text-sm leading-[140%] tracking-normal rounded-[12px]">
                <div className="flex items-center gap-2 mb-6">
                    <div className="text-red-500 text-xl">⚠️</div>
                    <h2 className="text-base font-medium leading-snug text-red-600">
                        خطا در بارگذاری اطلاعات
                    </h2>
                </div>
                <p className="text-red-500 text-sm">لطفاً دوباره تلاش کنید</p>
            </div>
        );
    }

    function getValidityPeriod(issuedAt: string | null, dueAt: string | null): string {
        if (!issuedAt || !dueAt) return "-";

        const start = new Date(issuedAt);
        const end = new Date(dueAt);
        const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        return `${diffDays} روز`; // e.g. "30 روز"
    }


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
                    <span className="font-medium text[#414651]">{invoiceData?.invoiceNumber?.slice(0, 5) || "-"}</span>
                </div>

                {/* Package Type */}
                {/* <div className="flex justify-between items-center">
                    <span className="text-[#717680] text-sm font-primary-medium leading-[140%] tracking-normal" >بر اساس تعداد/زمان:</span>
                    <span className="font-medium text[#414651]">
                        {displayData.type === 'rental' ? 'اجاره ای' : displayData.type === 'purchase' ? 'خریداری' : displayData.type || "-"}
                    </span>
                </div> */}

                {/* Purchase Type / Duration */}
                <div className="flex justify-between items-center">
                    <span className="text-[#717680] text-sm font-primary-medium leading-[140%] tracking-normal" >نوع خرید:</span>
                    <span className="font-medium text[#414651]">{invoiceData?.paymentMethod === "GATEWAY" ? "درگاه پرداخت" : invoiceData?.paymentMethod === "CASH" ? "نقدی" : invoiceData?.paymentMethod === "BANK_TRANSFER" ? "حواله بانکی" : "-"}</span>
                </div>

                {/* Base Price */}
                <div className="flex justify-between items-center">
                    <span className="text-[#717680] text-sm font-primary-medium leading-[140%] tracking-normal" >قیمت پایه:</span>
                    <span className="font-medium text[#414651]">
                        {invoiceData?.originalTotal ? formatPrice(invoiceData.originalTotal) : "-"} تومان
                    </span>
                </div>

                {/* Discount */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-[#717680] text-sm font-primary-medium leading-[140%] tracking-normal" >تخفیف:</span>

                        <div className=" text-[10px] text-[#1C68DA] whitespace-nowrap bg-white border-[#1C68DA] rounded-lg border  py-1 px-2">
                            {invoiceData?.discountPercent || 0}% تخفیف
                        </div>

                    </div>
                    <span className="font-medium text[#414651] whitespace-nowrap">
                        {invoiceData?.discountAmount ? formatPrice(invoiceData.discountAmount) : "-"} تومان
                    </span>
                </div>

                {/* Validity Period */}
                <div className="flex justify-between items-center">
                    <span className="text-[#717680] text-sm font-primary-medium leading-[140%] tracking-normal" >مدت زمان اعتبار:</span>
                    <span className="font-medium text-[#1C68DA]">{getValidityPeriod(invoiceData?.issuedAt || null, invoiceData?.dueAt || null) || "-"}</span>
                </div>



                {/* Total Amount */}
                <div className="flex justify-between items-center">
                    <span className="text-base font-normal text-[#535862]">جمع کل:</span>
                    <span className="text-base font-medium text-[#535862] ">
                        {invoiceData?.finalTotal ? formatPrice(invoiceData.finalTotal) : "-"} تومان
                    </span>
                </div>
            </div>

            {/* Pay Button */}
            <div className="mt-8  w-full ">
                <Button
                    variant={"info"}
                    onClick={handlePayment}
                    className="w-full"
                >
                    پرداخت
                </Button>
            </div>
        </div>
    );
}
