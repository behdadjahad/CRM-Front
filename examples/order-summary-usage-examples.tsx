// Usage Examples for OrderSummaryCard Component
// This file demonstrates how to use the shared OrderSummaryCard in different scenarios

import React from 'react';
import OrderSummaryCard from '@/components/shared/order-summary-card';
import {
    createInvoiceSummaryConfig,
    createCartSummaryConfig,
    createPackageSummaryConfig,
    createServiceBookingConfig,
    createSubscriptionConfig
} from '@/components/shared/order-summary-helpers';

// ============================================================================
// 1. BILLING/INVOICE USAGE EXAMPLE
// ============================================================================

interface BillingPageProps {
    invoiceId: string;
}

export function BillingPage({ invoiceId }: BillingPageProps) {
    const [invoiceData, setInvoiceData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handlePayment = async () => {
        setIsLoading(true);
        try {
            // Your payment logic here
            console.log('Processing payment...');
        } catch (err) {
            setError('خطا در پردازش پرداخت');
        } finally {
            setIsLoading(false);
        }
    };

    const invoiceConfig = createInvoiceSummaryConfig(invoiceData, {
        onPayment: handlePayment,
        isLoading,
        error
    });

    return (
        <div className="max-w-md mx-auto">
            <OrderSummaryCard config={invoiceConfig} />
        </div>
    );
}

// ============================================================================
// 2. CART/CHECKOUT USAGE EXAMPLE
// ============================================================================

interface CartPageProps {
    cartItems: any[];
}

export function CartPage({ cartItems }: CartPageProps) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Calculate cart totals
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = 10000; // Your discount logic
    const finalPayable = subtotal - discountAmount;

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            // Your checkout logic here
            console.log('Processing checkout...');
        } catch (err) {
            setError('خطا در پردازش سفارش');
        } finally {
            setIsLoading(false);
        }
    };

    const cartConfig = createCartSummaryConfig({
        totalItems,
        subtotal,
        discountAmount,
        finalPayable,
        discountCode: 'SAVE10',
        discountPercent: 10
    }, {
        onCheckout: handleCheckout,
        isLoading,
        error
    });

    return (
        <div className="max-w-md mx-auto">
            <OrderSummaryCard config={cartConfig} />
        </div>
    );
}

// ============================================================================
// 3. PACKAGE SELECTION USAGE EXAMPLE
// ============================================================================

interface PackageSelectionProps {
    selectedPackage: any;
}

export function PackageSelection({ selectedPackage }: PackageSelectionProps) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleSelectPackage = async () => {
        setIsLoading(true);
        try {
            // Your package selection logic here
            console.log('Selecting package...');
        } catch (err) {
            setError('خطا در انتخاب پکیج');
        } finally {
            setIsLoading(false);
        }
    };

    const packageConfig = createPackageSummaryConfig({
        name: selectedPackage.name,
        duration: selectedPackage.duration,
        durationUnit: 'month',
        price: selectedPackage.price,
        originalPrice: selectedPackage.originalPrice,
        discountPercent: selectedPackage.discountPercent,
        features: selectedPackage.features,
        currency: 'تومان'
    }, {
        onSelect: handleSelectPackage,
        isLoading,
        error
    });

    return (
        <div className="max-w-md mx-auto">
            <OrderSummaryCard config={packageConfig} />
        </div>
    );
}

// ============================================================================
// 4. SERVICE BOOKING USAGE EXAMPLE
// ============================================================================

interface ServiceBookingProps {
    selectedService: any;
    selectedDate: string;
    selectedTime: string;
}

export function ServiceBooking({ selectedService, selectedDate, selectedTime }: ServiceBookingProps) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleBookService = async () => {
        setIsLoading(true);
        try {
            // Your booking logic here
            console.log('Booking service...');
        } catch (err) {
            setError('خطا در رزرو سرویس');
        } finally {
            setIsLoading(false);
        }
    };

    const bookingConfig = createServiceBookingConfig({
        serviceName: selectedService.name,
        duration: selectedService.duration,
        price: selectedService.price,
        date: selectedDate,
        time: selectedTime,
        location: selectedService.location,
        currency: 'تومان'
    }, {
        onBook: handleBookService,
        isLoading,
        error
    });

    return (
        <div className="max-w-md mx-auto">
            <OrderSummaryCard config={bookingConfig} />
        </div>
    );
}

// ============================================================================
// 5. SUBSCRIPTION USAGE EXAMPLE
// ============================================================================

interface SubscriptionPageProps {
    subscriptionPlan: any;
}

export function SubscriptionPage({ subscriptionPlan }: SubscriptionPageProps) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            // Your subscription logic here
            console.log('Processing subscription...');
        } catch (err) {
            setError('خطا در پردازش اشتراک');
        } finally {
            setIsLoading(false);
        }
    };

    const subscriptionConfig = createSubscriptionConfig({
        planName: subscriptionPlan.name,
        duration: subscriptionPlan.duration,
        durationUnit: 'month',
        price: subscriptionPlan.price,
        features: subscriptionPlan.features,
        currency: 'تومان',
        isActive: subscriptionPlan.isActive
    }, {
        onSubscribe: handleSubscribe,
        isLoading,
        error
    });

    return (
        <div className="max-w-md mx-auto">
            <OrderSummaryCard config={subscriptionConfig} />
        </div>
    );
}

// ============================================================================
// 6. CUSTOM CONFIGURATION EXAMPLE
// ============================================================================

export function CustomOrderSummary() {
    const customConfig = {
        title: "خلاصه سفارش سفارشی",
        icon: "/icons/custom-icon.svg",
        iconAlt: "custom-summary-icon",
        items: [
            {
                label: "نام محصول",
                value: "محصول ویژه",
                type: 'text' as const
            },
            {
                label: "تاریخ سفارش",
                value: "2024-01-15",
                type: 'date' as const
            },
            {
                label: "وضعیت",
                value: "در انتظار تایید",
                type: 'badge' as const,
                badgeClassName: "text-yellow-600 bg-yellow-50 border-yellow-200"
            },
            {
                label: "قیمت",
                value: 500000,
                type: 'price' as const,
                currency: 'تومان'
            }
        ],
        buttonText: "تایید سفارش",
        buttonVariant: "info" as const,
        onButtonClick: () => console.log('Custom action'),
        showDivider: true,
        highlightLastItem: true,
        lastItemClassName: "text-lg font-bold text-blue-600"
    };

    return (
        <div className="max-w-md mx-auto">
            <OrderSummaryCard config={customConfig} />
        </div>
    );
}

// ============================================================================
// 7. LOADING AND ERROR STATES EXAMPLE
// ============================================================================

export function OrderSummaryWithStates() {
    const [state, setState] = React.useState<'loading' | 'error' | 'success'>('loading');

    const config = {
        title: "خلاصه سفارش",
        icon: "/icons/payment-icon.svg",
        items: [
            {
                label: "محصول",
                value: "محصول نمونه",
                type: 'text' as const
            },
            {
                label: "قیمت",
                value: 100000,
                type: 'price' as const,
                currency: 'تومان'
            }
        ],
        buttonText: "پرداخت",
        onButtonClick: () => console.log('Payment'),
        isLoading: state === 'loading',
        error: state === 'error' ? 'خطا در بارگذاری اطلاعات' : null,
        loadingSkeletonCount: 3
    };

    return (
        <div className="max-w-md mx-auto space-y-4">
            <div className="flex gap-2">
                <button
                    onClick={() => setState('loading')}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Loading
                </button>
                <button
                    onClick={() => setState('error')}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                >
                    Error
                </button>
                <button
                    onClick={() => setState('success')}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Success
                </button>
            </div>

            <OrderSummaryCard config={config} />
        </div>
    );
}

