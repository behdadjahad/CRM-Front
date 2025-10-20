# Cart Bundling Implementation Guide

## Overview
This document describes the implementation of cart bundling functionality, which groups package units that belong to the same bundle and displays them with bundle discounts, similar to the feature bundling system.

## Architecture

### 1. Data Flow

```
API Response (CartData)
├── packageUnits: CartItem[]          // All items in cart
└── satisfiedBundles: SatisfiedBundle[] // Bundles that are satisfied
    ├── id: number
    ├── name: string
    ├── description: string
    ├── discountPercent: { value: number }
    └── packageUnitIds: number[]      // IDs of items in this bundle
```

### 2. Key Components

#### A. Cart Bundle Utilities (`lib/cart-bundle-utils.ts`)
Provides utility functions for organizing and managing bundled items:

- **`organizeCartItemsWithBundles()`**: Groups cart items by bundles
  - Input: `cartItems`, `satisfiedBundles`
  - Output: `{ bundles, individualItems, bundledItemIds }`
  
- **`isCartItemInBundle()`**: Checks if an item belongs to any bundle
  
- **`getCartItemBundleIds()`**: Gets all bundle IDs for an item
  
- **`getCartItemBundleInfo()`**: Gets bundle information for an item
  
- **`calculateBundleDiscount()`**: Calculates bundle discount details

#### B. CartBundleCard Component (`components/cart/cart-bundle-card.tsx`)
Displays bundled items in the cart with:
- Bundle header with name and description
- Discount badge showing savings percentage
- Price summary (original, discount, final)
- List of items in the bundle
- Visual indicators for bundle membership

#### C. CartItem Component (Updated)
Enhanced with bundle support:
- `isInBundle` prop: Shows "بخشی از باندل" badge
- `showPrice` prop: Controls individual price display
- `showRemoveButton` prop: Controls remove button visibility
- Different styling when part of a bundle

#### D. CartContainer Component (Updated)
Orchestrates the bundle display:
- Uses `organizeCartItemsWithBundles()` to separate items
- Displays bundles section first (if any)
- Displays individual items section below
- Shows bundle count in header

### 3. Type Definitions

```typescript
// Cart Bundle Group structure
interface CartBundleGroup {
    id: number;
    name: string;
    description: string;
    discountPercent: number;
    items: CartItem[];
    totalPrice: number;
    discountedPrice: number;
}

// Satisfied Bundle from API
interface SatisfiedBundle {
    id: number;
    name: string;
    description: string;
    discountPercent: {
        value: number;
    };
    packageUnitIds: number[];
}

// Cart Item (updated)
interface CartItem {
    id: number;
    name: string;
    accessesJson: AccessesJson;
    unitType?: string;
    unitModel: "flat" | "perDuration" | "perCount";
    enabledDurationInDays: number;
    showDurationInDays: number;
    countUnit: number;
    price: number;
    currencyId: number;
    createdAt: string;
    updatedAt: string;
    bundleId?: number; // Optional: Track which bundle this item came from
}
```

## Usage Examples

### 1. Organizing Cart Items

```typescript
import { organizeCartItemsWithBundles } from '@/lib/cart-bundle-utils';

const { bundles, individualItems, bundledItemIds } = useMemo(() => 
    organizeCartItemsWithBundles(cartItems, satisfiedBundles),
    [cartItems, satisfiedBundles]
);
```

### 2. Displaying Bundles in Cart

```tsx
{bundles.length > 0 && (
    <div className="flex flex-col gap-4">
        <h3>باندل‌های شما ({bundles.length})</h3>
        {bundles.map((bundle) => (
            <CartBundleCard
                key={bundle.id}
                bundle={bundle}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
                isUpdating={isUpdating}
                isRemoving={isRemoving}
            />
        ))}
    </div>
)}
```

### 3. Checking if Features are in Bundle

```typescript
// In single-features-container
const areAllBundleFeaturesInCart = (bundleFeatures: PackageUnit[]): boolean => {
    if (!Array.isArray(cartItems)) {
        return false;
    }
    const featureIds = bundleFeatures.map(f => f.id);
    return featureIds.every(featureId => 
        cartItems.some((item: CartItem) => item.id === featureId)
    );
};

const isBundleInCart = (bundleId: number): boolean => {
    if (!cartData?.data?.satisfiedBundles) {
        return false;
    }
    return cartData.data.satisfiedBundles.some(bundle => bundle.id === bundleId);
};
```

## Features

### 1. Bundle Grouping
- Automatically groups cart items by their bundle membership
- Separates bundled items from individual items
- Shows bundle count in cart header

### 2. Visual Design
- Distinctive orange/yellow gradient background for bundles
- Dashed border to differentiate from individual items
- Bundle items have left border indicator
- "بخشی از باندل" badge on items within bundles

### 3. Price Display
- Shows original total price (crossed out)
- Shows savings amount in green
- Shows final bundle price in orange
- Displays discount percentage badge

### 4. Bundle Management
- Individual items within bundles show their prices
- Quantity controls hidden for bundled items (to maintain bundle integrity)
- Remove button can be controlled per item
- Bundle celebration message for savings

### 5. Integration with Features Page
- Bundles can be added from single-features page
- Bundle status tracked in cart
- Visual feedback when bundle is in cart
- Proper loading states for bundle operations

## API Integration

### Adding Bundle to Cart
When adding a bundle from the features page:

```typescript
addToCartMutation.mutate({
    unitIds: bundle.features.map(f => f.id),
    chadcoCustomerId: chadcoCustomerId,
    requestMessage: `Bundle: ${bundleName} (ID: ${bundleId})`
});
```

### Cart Response Structure
The API returns:
- `packageUnits`: All items (including bundled ones)
- `satisfiedBundles`: Bundles that have all required items in cart
- Bundle discount is automatically applied in `finalTotal`

## Styling

### Bundle Card
- Background: `from-orange-50 to-yellow-50` gradient
- Border: `border-2 border-dashed border-orange-200`
- Rounded: `rounded-2xl`

### Bundle Items
- Left indicator: `w-1 h-12 bg-orange-400 rounded-full`
- Background: White with `border-orange-100`

### Discount Badge
- Background: `bg-orange-500`
- Icon: `TrendingDown` from lucide-react

## Benefits

1. **Clear Bundle Visibility**: Users can immediately see which items are part of bundles
2. **Savings Highlighted**: Discount amount and percentage prominently displayed
3. **Organized Cart**: Bundles grouped separately from individual items
4. **Consistent UX**: Similar to feature bundling on the products page
5. **Price Transparency**: Shows both original and discounted prices

## Best Practices

1. Always check if `satisfiedBundles` exists before accessing
2. Use `useMemo` to optimize bundle organization
3. Track bundle loading states separately from individual items
4. Show bundle ID in request messages for debugging
5. Maintain bundle integrity by controlling quantity/removal

## Future Enhancements

1. Partial bundle removal (remove entire bundle at once)
2. Bundle suggestions (when items can form a bundle)
3. Bundle comparison view
4. Bundle expiration/time-limited discounts
5. Mixed bundle types (required + optional items)


