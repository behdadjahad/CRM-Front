# Shared OrderSummaryCard Component

A fully dynamic and reusable `OrderSummaryCard` component that can be used across different parts of your application with just props configuration.

## Features

- 🎯 **Fully Dynamic**: Configure everything through props
- 🔄 **Reusable**: Use in billing, cart, packages, subscriptions, and more
- 🎨 **Customizable**: Full control over styling, icons, and layout
- 📱 **Responsive**: Works on all screen sizes
- ⚡ **Type-Safe**: Full TypeScript support
- 🌐 **Internationalized**: Supports Persian/RTL layout and currency formatting
- ♿ **Accessible**: Proper semantic structure and ARIA support

## Quick Start

```tsx
import OrderSummaryCard from '@/components/shared/order-summary-card';
import { createCartSummaryConfig } from '@/components/shared/order-summary-helpers';

// Simple usage with helper
const config = createCartSummaryConfig(cartData, handlers);
<OrderSummaryCard config={config} />

// Or create custom config
const customConfig = {
    title: "خلاصه سفارش",
    icon: "/icons/cart-icon.svg",
    items: [
        {
            label: "محصول",
            value: "محصول نمونه",
            type: 'text'
        },
        {
            label: "قیمت",
            value: 100000,
            type: 'price',
            currency: 'تومان'
        }
    ],
    buttonText: "پرداخت",
    onButtonClick: () => console.log('Payment')
};

<OrderSummaryCard config={customConfig} />
```

## Component Structure

```
components/shared/
├── order-summary-card.tsx          # Main component
├── order-summary-helpers.tsx       # Helper functions for common use cases
└── README.md                       # This documentation
```

## Configuration Options

### OrderSummaryConfig Interface

```typescript
interface OrderSummaryConfig {
    // Header configuration
    title: string;
    icon?: string;
    iconAlt?: string;
    iconSize?: number;
    
    // Content configuration
    items: OrderSummaryItem[];
    
    // Button configuration
    buttonText?: string;
    buttonVariant?: 'default' | 'info' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    buttonClassName?: string;
    buttonDisabled?: boolean;
    onButtonClick?: () => void;
    
    // State configuration
    isLoading?: boolean;
    error?: string | null;
    loadingSkeletonCount?: number;
    
    // Styling configuration
    className?: string;
    cardClassName?: string;
    headerClassName?: string;
    itemsClassName?: string;
    buttonContainerClassName?: string;
    
    // Layout configuration
    showDivider?: boolean;
    dividerClassName?: string;
    highlightLastItem?: boolean;
    lastItemClassName?: string;
}
```

### OrderSummaryItem Interface

```typescript
interface OrderSummaryItem {
    label: string;
    value: string | number;
    type?: 'text' | 'price' | 'badge' | 'currency' | 'date' | 'percentage';
    currency?: string;
    className?: string;
    showWhen?: boolean; // Conditional rendering
    badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
    badgeClassName?: string;
}
```

## Usage Examples

### 1. Cart/Checkout Summary

```tsx
import { createCartSummaryConfig } from '@/components/shared/order-summary-helpers';

const cartData = {
    totalItems: 3,
    subtotal: 150000,
    discountAmount: 15000,
    finalPayable: 135000,
    discountCode: 'SAVE10',
    discountPercent: 10
};

const handlers = {
    onCheckout: () => console.log('Checkout'),
    isLoading: false,
    error: null
};

const config = createCartSummaryConfig(cartData, handlers);
<OrderSummaryCard config={config} />
```

### 2. Invoice/Billing Summary

```tsx
import { createInvoiceSummaryConfig } from '@/components/shared/order-summary-helpers';

const invoiceData = {
    invoiceNumber: 'INV-12345',
    paymentMethod: 'GATEWAY',
    originalTotal: 200000,
    discountAmount: 20000,
    discountPercent: 10,
    finalTotal: 180000,
    issuedAt: '2024-01-01',
    dueAt: '2024-01-31',
    currency: 'تومان'
};

const handlers = {
    onPayment: () => console.log('Payment'),
    isLoading: false,
    error: null
};

const config = createInvoiceSummaryConfig(invoiceData, handlers);
<OrderSummaryCard config={config} />
```

### 3. Package Selection Summary

```tsx
import { createPackageSummaryConfig } from '@/components/shared/order-summary-helpers';

const packageData = {
    name: 'پکیج حرفه‌ای',
    duration: 6,
    durationUnit: 'month',
    price: 500000,
    originalPrice: 600000,
    discountPercent: 17,
    features: ['پشتیبانی ۲۴/۷', 'API دسترسی'],
    currency: 'تومان'
};

const handlers = {
    onSelect: () => console.log('Select Package'),
    isLoading: false,
    error: null
};

const config = createPackageSummaryConfig(packageData, handlers);
<OrderSummaryCard config={config} />
```

### 4. Service Booking Summary

```tsx
import { createServiceBookingConfig } from '@/components/shared/order-summary-helpers';

const serviceData = {
    serviceName: 'مشاوره تخصصی',
    duration: 60,
    price: 150000,
    date: '2024-01-15',
    time: '۱۴:۰۰',
    location: 'تهران، خیابان ولیعصر',
    currency: 'تومان'
};

const handlers = {
    onBook: () => console.log('Book Service'),
    isLoading: false,
    error: null
};

const config = createServiceBookingConfig(serviceData, handlers);
<OrderSummaryCard config={config} />
```

### 5. Subscription Summary

```tsx
import { createSubscriptionConfig } from '@/components/shared/order-summary-helpers';

const subscriptionData = {
    planName: 'اشتراک طلایی',
    duration: 12,
    durationUnit: 'month',
    price: 1200000,
    features: ['دسترسی نامحدود', 'پشتیبانی اولویت'],
    currency: 'تومان',
    isActive: false
};

const handlers = {
    onSubscribe: () => console.log('Subscribe'),
    isLoading: false,
    error: null
};

const config = createSubscriptionConfig(subscriptionData, handlers);
<OrderSummaryCard config={config} />
```

### 6. Custom Configuration

```tsx
const customConfig = {
    title: "خلاصه سفارش سفارشی",
    icon: "/icons/custom-icon.svg",
    iconAlt: "custom-summary-icon",
    items: [
        {
            label: "نام محصول",
            value: "محصول ویژه",
            type: 'text'
        },
        {
            label: "تاریخ سفارش",
            value: "2024-01-15",
            type: 'date'
        },
        {
            label: "وضعیت",
            value: "در انتظار تایید",
            type: 'badge',
            badgeClassName: "text-yellow-600 bg-yellow-50 border-yellow-200"
        },
        {
            label: "قیمت",
            value: 500000,
            type: 'price',
            currency: 'تومان'
        }
    ],
    buttonText: "تایید سفارش",
    buttonVariant: "info",
    onButtonClick: () => console.log('Custom action'),
    showDivider: true,
    highlightLastItem: true,
    lastItemClassName: "text-lg font-bold text-blue-600"
};

<OrderSummaryCard config={customConfig} />
```

## Item Types

### Text
```tsx
{
    label: "نام محصول",
    value: "محصول نمونه",
    type: 'text'
}
```

### Price
```tsx
{
    label: "قیمت",
    value: 100000,
    type: 'price',
    currency: 'تومان'
}
```

### Badge
```tsx
{
    label: "وضعیت",
    value: "فعال",
    type: 'badge',
    badgeClassName: "text-green-600 bg-green-50 border-green-200"
}
```

### Currency
```tsx
{
    label: "مبلغ",
    value: 50000,
    type: 'currency',
    currency: 'تومان'
}
```

### Date
```tsx
{
    label: "تاریخ",
    value: "2024-01-15",
    type: 'date'
}
```

### Percentage
```tsx
{
    label: "تخفیف",
    value: 15,
    type: 'percentage'
}
```

## Loading and Error States

```tsx
const config = {
    title: "خلاصه سفارش",
    items: [...],
    buttonText: "پرداخت",
    onButtonClick: handlePayment,
    isLoading: true, // Shows skeleton loading
    error: null, // Shows error message
    loadingSkeletonCount: 4 // Number of skeleton items
};

<OrderSummaryCard config={config} />
```

## Styling Customization

```tsx
const config = {
    title: "خلاصه سفارش",
    items: [...],
    // Custom styling
    className: "my-custom-class",
    cardClassName: "border-2 border-blue-500",
    headerClassName: "text-blue-600",
    itemsClassName: "gap-8",
    buttonContainerClassName: "mt-12",
    buttonClassName: "bg-gradient-to-r from-blue-500 to-purple-600",
    dividerClassName: "border-blue-200",
    lastItemClassName: "text-2xl font-black text-purple-600"
};
```

## Migration Guide

### From Old Components

**Before:**
```tsx
// Old billing component
<BillingOrderSummaryCard 
    invoiceData={data}
    onPayment={handlePayment}
    isLoading={loading}
    error={error}
/>
```

**After:**
```tsx
// New shared component
import { createInvoiceSummaryConfig } from '@/components/shared/order-summary-helpers';

const config = createInvoiceSummaryConfig(invoiceData, {
    onPayment: handlePayment,
    isLoading: loading,
    error: error
});

<OrderSummaryCard config={config} />
```

## Best Practices

1. **Use Helper Functions**: Prefer helper functions for common use cases
2. **Type Safety**: Always use TypeScript interfaces
3. **Conditional Rendering**: Use `showWhen` for conditional items
4. **Consistent Styling**: Use consistent className patterns
5. **Error Handling**: Always handle loading and error states
6. **Accessibility**: Provide proper alt texts for icons

## File Structure

```
components/
├── shared/
│   ├── order-summary-card.tsx      # Main component
│   ├── order-summary-helpers.tsx   # Helper functions
│   └── README.md                   # Documentation
├── cart/
│   └── order-summary-card.tsx      # Cart-specific wrapper
├── billing/
│   └── order-summary-card.tsx      # Billing-specific wrapper
└── examples/
    └── order-summary-usage-examples.tsx  # Usage examples
```

## Contributing

When adding new features:

1. Update the TypeScript interfaces
2. Add helper functions for common use cases
3. Update this documentation
4. Add usage examples
5. Test with different configurations

## Support

For questions or issues, please refer to the usage examples or create an issue in the project repository.

