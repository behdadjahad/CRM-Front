import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { payFeatures } from '@/api/cart';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { CustomToast } from '@/components/shared/custome-toast';

interface OrderSummaryCardProps {
    cartId: number;
    itemCount: number;
    originalTotal: number;
    discountAmount: number;
    discountPercent: number;
    discountAmountByDiscountCode: number | null;
    discountPercentByDiscountCode: number | null;
    taxAmount: number;
    taxPercent: number;
    finalTotal: number;
    bundles: any[];
    bundleDiscountPercent: number;
}

export default function OrderSummaryCard({
    cartId,
    itemCount,
    originalTotal,
    discountAmount,
    discountPercent,
    discountAmountByDiscountCode,
    discountPercentByDiscountCode,
    taxAmount,
    taxPercent,
    finalTotal,
    bundles,
    bundleDiscountPercent,
}: OrderSummaryCardProps) {
    const chadcoCustomerId = useSelector((state: RootState) => state?.login?.chadcoCustomerId);
    const router = useRouter();
    const queryClient = useQueryClient();

    // Calculate bundle discount amount
    const bundleDiscountAmount = bundles.reduce((acc, bundle) =>
        acc + (bundle.totalPrice - bundle.discountedPrice), 0
    );

    // Payment mutation
    const { mutate: payFeaturesMutation, isPending: isPaymentPending } = useMutation({
        mutationFn: (cartId: number) => payFeatures(cartId, chadcoCustomerId),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['cart', chadcoCustomerId] });
            CustomToast({
                type: 'success',
                message: 'پرداخت شما با موفقیت انجام شد. در حال انتقال به صفحه فاکتور...'
            });

            // const redirectUrl = response?.data?.invoiceId
            //     ? `/invoice`
            //     : '/single-features';

            // setTimeout(() => router.push(redirectUrl), 2000);
        },
        onError: (error: any) => {
            const errorMessage = error?.message || 'خطا در پرداخت. لطفا دوباره تلاش کنید.';
            CustomToast({
                type: 'error',
                message: errorMessage
            });
        },
    });

    // Payment handler
    const handlePayment = () => {
        if (itemCount === 0) {
            CustomToast({
                type: 'error',
                message: 'سبد خرید شما خالی است'
            });
            return;
        }
        if (finalTotal <= 0) {
            CustomToast({
                type: 'error',
                message: 'مبلغ قابل پرداخت نامعتبر است'
            });
            return;
        }
        payFeaturesMutation(cartId);
    };

    const isPaymentDisabled = itemCount === 0;

    // Summary items configuration
    const summaryItems = [
        {
            label: 'تعداد کل ایتم ها:',
            value: `${itemCount} فیچر`,
            className: 'text-static-secondary-gray-dark'
        },
        {
            label: 'مجموع:',
            value: `${formatPrice(originalTotal)} تومان`,
            className: 'text-static-secondary-gray-dark'
        },
        ...(discountAmount > 0 ? [{
            label: `تخفیف ${discountPercent > 0 ? `(${discountPercent}%)` : ''}:`,
            value: `- ${formatPrice(discountAmount)} تومان`,
            className: 'text-green-600'
        }] : []),
        ...(discountAmountByDiscountCode && discountAmountByDiscountCode > 0 ? [{
            label: `تخفیف کد ${discountPercentByDiscountCode && discountPercentByDiscountCode > 0 ? `(${discountPercentByDiscountCode}%)` : ''}:`,
            value: `- ${formatPrice(discountAmountByDiscountCode)} تومان`,
            className: 'text-green-600'
        }] : []),
        ...(taxAmount >= 0 ? [{
            label: `مالیات ${taxPercent > 0 ? `(${taxPercent}%)` : ''}:`,
            value: `${formatPrice(taxAmount)} تومان`,
            className: 'text-static-secondary-gray-dark'
        }] : []),
        ...(bundleDiscountAmount > 0 ? [{
            label: `تخفیف باندل ${bundleDiscountPercent > 0 ? `(${bundleDiscountPercent}%)` : ''}:`,
            value: `- ${formatPrice(bundleDiscountAmount)} تومان`,
            className: 'text-red-500'
        }] : []),
    ];

    return (
        <div className="bg-white border border-static-border-light p-6 text-right font-primary-medium text-sm leading-[140%] tracking-normal rounded-[12px]">
            <h2 className="text-base font-medium leading-snug text-black mb-6 flex items-center gap-2">
                <Image src="/icons/payment-icon.svg" alt="order-summary-card-icon" width={20} height={20} />
                خلاصه سفارش
            </h2>

            <div className="w-full flex flex-col gap-6">
                {/* Summary Items */}
                {summaryItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <span className="text-static-secondary-gray text-sm font-primary-medium leading-[140%] tracking-normal">
                            {item.label}
                        </span>
                        <span className={`font-medium ${item.className}`}>
                            {item.value}
                        </span>
                    </div>
                ))}

                {/* Final Total */}
                <div className="flex w-full justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-base font-semibold text-gray-900">قیمت نهایی:</span>
                    <span className="text-lg whitespace-nowrap font-bold text-static-info-primary">
                        {formatPrice(finalTotal)} تومان
                    </span>
                </div>
            </div>

            {/* Empty Cart Message */}
            {itemCount === 0 && (
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-sm text-gray-600">سبد خرید شما خالی است</p>
                </div>
            )}

            {/* Pay Button */}
            <div className="mt-8 w-full flex lg:flex-col sm:flex-row flex-col lg:justify-between justify-center gap-2 items-center">
                <Button
                    variant="info"
                    onClick={handlePayment}
                    disabled={isPaymentDisabled || isPaymentPending}
                    className="lg:w-full w-full sm:w-fit px-20 py-2 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPaymentPending ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            در حال پردازش...
                        </span>
                    ) : (
                        'پرداخت'
                    )}
                </Button>
            </div>
        </div>
    );
}
