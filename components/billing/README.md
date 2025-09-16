# Billing Components

This directory contains all the components for the billing/payment page UI.

## Components Structure

```
components/billing/
├── billing-container.tsx      # Main container component
├── order-summary-card.tsx     # Left panel - Order summary
├── features-list-card.tsx     # Top right panel - Features list
├── duration-selection-card.tsx # Bottom right panel - Duration selection
└── README.md                  # This file
```

## Usage

### 1. Import the main container
```typescript
import BillingContainer from "@/components/billing/billing-container";
import { BillingPageData } from "@/types/billing";
```

### 2. Prepare your data
```typescript
const billingData: BillingPageData = {
  user: { name: "امیر مقدسی" },
  package: {
    name: "طلایی",
    type: "rental",
    purchaseType: "۳ ماهه",
    basePrice: 1850000,
    discount: { percentage: 15, amount: 400000 },
    validityPeriod: "۱۴۰۴/۰۸/۲۶",
  },
  features: [...],
  durationOptions: [...],
  selectedDuration: "one-month",
};
```

### 3. Handle events
```typescript
const handleDurationChange = (durationId: string) => {
  // Update selected duration
};

const handlePay = () => {
  // Handle payment
};

const handleFeatureToggle = (categoryId: string) => {
  // Toggle feature category
};
```

### 4. Render the component
```typescript
<BillingContainer
  data={billingData}
  onDurationChange={handleDurationChange}
  onPay={handlePay}
  onFeatureToggle={handleFeatureToggle}
  onLoadMoreFeatures={handleLoadMoreFeatures}
  onLoadMoreDurations={handleLoadMoreDurations}
/>
```

## Props Interface

### BillingContainerProps
- `data: BillingPageData` - All billing data
- `onDurationChange: (durationId: string) => void` - Duration selection handler
- `onPay: () => void` - Payment handler
- `onFeatureToggle: (categoryId: string) => void` - Feature toggle handler
- `onLoadMoreFeatures: () => void` - Load more features handler
- `onLoadMoreDurations: () => void` - Load more durations handler

## Features

### ✅ Responsive Design
- Mobile-first approach
- Grid layout that adapts to screen size
- RTL support for Persian language

### ✅ Interactive Elements
- Duration selection with radio buttons
- Expandable feature categories
- Dynamic pricing calculation
- Load more functionality

### ✅ Persian Localization
- RTL layout
- Persian number formatting
- Persian text and labels
- Currency formatting (تومان)

### ✅ TypeScript Support
- Full type safety
- IntelliSense support
- Compile-time error checking

## Styling

The components use Tailwind CSS classes and follow the existing design system:
- Color palette from `globals.css`
- Consistent spacing and typography
- Hover and focus states
- Smooth transitions

## Testing

Use the test page at `/test` to see the components in action:
```typescript
// Visit: http://localhost:3000/test
```

## Mock Data

Mock data is available in `data/billing-mock-data.ts` for development and testing purposes.

## Future Enhancements

- [ ] Add loading states
- [ ] Add error handling
- [ ] Add animations
- [ ] Add accessibility improvements
- [ ] Add unit tests
