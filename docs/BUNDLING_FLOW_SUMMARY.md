# Complete Bundling Flow Summary

## Overview
This document provides a complete understanding of the bundling system across the entire application, from feature display to cart checkout.

## 1. Feature Bundling (Single Features Page)

### Data Structure
```typescript
// Package Unit with Bundle Information
interface PackageUnit {
    id: number;
    name: string;
    price: number;
    PackageBundle?: PackageBundle[]; // Bundles this feature belongs to
    // ... other fields
}

interface PackageBundle {
    id: number;
    name: string;
    discountPercent: number;
}
```

### Bundling Logic (`lib/bundle-utils.ts`)

#### `organizeFeaturesWithBundles()`
- Takes array of `PackageUnit[]`
- Groups features by their `PackageBundle` membership
- Returns:
  ```typescript
  {
      bundles: BundleGroup[],      // Grouped features by bundle
      allFeatures: PackageUnit[]   // All features (including bundled ones)
  }
  ```

#### Helper Functions
- `isFeatureInBundle()`: Check if feature has any bundles
- `getFeatureBundleIds()`: Get all bundle IDs for a feature
- `createCartBundleItem()`: Convert bundle to cart format

### Display Components

#### `BundleCard` Component
**Location**: `components/packages/bundle-card.tsx`

**Features**:
- Displays bundle name and total price
- Shows all features within the bundle
- Add/Remove entire bundle from cart
- Visual distinction with orange/yellow theme
- Shows bundle discount

**Props**:
```typescript
{
    bundle: BundleGroup;
    isInCart: boolean;
    onAddToCart: (bundleId, bundleName) => void;
    onRemoveFromCart: (bundleId) => void;
    cartLoading: boolean;
    // ... other props
}
```

#### `SingleFeatureCard` Component
**Location**: `components/packages/single-feature-card.tsx`

**Features**:
- Can be displayed standalone or within a bundle
- Shows bundle badge if part of a bundle
- Highlights matched features
- Individual add/remove actions
- Supports bundle loading states

**Bundle-related Props**:
```typescript
{
    isInBundle?: boolean;        // Hide individual actions
    showPrice?: boolean;         // Control price display
    showAddButton?: boolean;     // Control add button
    bundleLoading?: boolean;     // Bundle-specific loading
}
```

### Container Logic (`components/packages/single-features-container.tsx`)

#### Bundle Management
```typescript
// Check if bundle is in cart (all features present)
const areAllBundleFeaturesInCart = (bundleFeatures: PackageUnit[]): boolean => {
    const featureIds = bundleFeatures.map(f => f.id);
    return featureIds.every(featureId => 
        cartItems.some(item => item.id === featureId)
    );
};

// Check using satisfiedBundles from API
const isBundleInCart = (bundleId: number): boolean => {
    return cartData?.data?.satisfiedBundles.some(
        bundle => bundle.id === bundleId
    ) || false;
};
```

#### Adding Bundle to Cart
```typescript
const handleAddBundle = (bundleId, bundleName) => {
    const featureIds = bundle.features.map(f => f.id);
    addToCartMutation.mutate({
        unitIds: featureIds,
        chadcoCustomerId: chadcoCustomerId,
        requestMessage: `Bundle: ${bundleName} (ID: ${bundleId})`
    });
};
```

#### Display Flow
1. Fetch all package units with bundle information
2. Organize into bundles using `organizeFeaturesWithBundles()`
3. Display bundles section first (if any)
4. Display all features section below (including bundled ones)
5. Show bundle badges on features that belong to bundles

---

## 2. Cart Bundling

### Data Structure
```typescript
// Cart API Response
interface CartData {
    packageUnits: CartItem[];          // All items in cart
    satisfiedBundles: SatisfiedBundle[]; // Bundles with all items present
    originalTotal: number;
    discountAmount: number;
    finalTotal: number;
    // ... other fields
}

interface SatisfiedBundle {
    id: number;
    name: string;
    description: string;
    discountPercent: { value: number };
    packageUnitIds: number[];  // Items that make up this bundle
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    bundleId?: number;  // Optional: Track which bundle added this
    // ... other fields
}
```

### Bundling Logic (`lib/cart-bundle-utils.ts`)

#### `organizeCartItemsWithBundles()`
```typescript
organizeCartItemsWithBundles(
    cartItems: CartItem[],
    satisfiedBundles: SatisfiedBundle[]
) => {
    bundles: CartBundleGroup[],      // Grouped cart items by bundle
    individualItems: CartItem[],      // Items not in any bundle
    bundledItemIds: Set<number>       // IDs of all bundled items
}
```

#### `CartBundleGroup` Structure
```typescript
interface CartBundleGroup {
    id: number;
    name: string;
    description: string;
    discountPercent: number;
    items: CartItem[];           // Items in this bundle
    totalPrice: number;          // Sum of item prices
    discountedPrice: number;     // After bundle discount
}
```

#### Helper Functions
- `isCartItemInBundle()`: Check if item is in any bundle
- `getCartItemBundleIds()`: Get bundle IDs for an item
- `getCartItemBundleInfo()`: Get bundle details for an item
- `calculateBundleDiscount()`: Calculate discount breakdown

### Display Components

#### `CartBundleCard` Component
**Location**: `components/cart/cart-bundle-card.tsx`

**Features**:
- Gradient orange/yellow background
- Displays bundle header with package icon
- Shows discount badge with percentage
- Price breakdown (original, savings, final)
- Lists all items in the bundle
- Visual left border indicator on items
- Celebration message for savings

**Layout**:
```
┌─────────────────────────────────────────┐
│ 📦 Bundle Name          🔻 15% تخفیف     │
│ Description                              │
├─────────────────────────────────────────┤
│ Original: ~~500,000~~  Save: 75,000     │
│ Bundle Price: 425,000 تومان              │
├─────────────────────────────────────────┤
│ Items (3):                               │
│ ┃ CartItem 1                             │
│ ┃ CartItem 2                             │
│ ┃ CartItem 3                             │
├─────────────────────────────────────────┤
│ 🎉 You save 75,000 تومان!                │
└─────────────────────────────────────────┘
```

#### `CartItem` Component (Enhanced)
**Location**: `components/cart/cart-item.tsx`

**Bundle Support**:
- `isInBundle` prop: Adds "بخشی از باندل" badge
- Different background when in bundle (white vs gray)
- Can hide quantity controls for bundled items
- Can hide remove button for bundle integrity
- Price shown in gray when in bundle

### Container Logic (`components/cart/cart-container.tsx`)

#### Organization Flow
```typescript
// 1. Get cart data from API
const items = cartData?.data?.packageUnits || [];
const satisfiedBundles = cartData?.data?.satisfiedBundles || [];

// 2. Organize items
const { bundles, individualItems, bundledItemIds } = useMemo(() => 
    organizeCartItemsWithBundles(items, satisfiedBundles),
    [items, satisfiedBundles]
);

// 3. Display sections
// - Bundles section (if any)
// - Individual items section (if any)
```

#### Display Structure
```tsx
<CartContainer>
  <Header>
    سبد خرید (5 مورد - 2 باندل)
  </Header>
  
  {bundles.length > 0 && (
    <BundlesSection>
      <h3>باندل‌های شما (2)</h3>
      {bundles.map(bundle => (
        <CartBundleCard bundle={bundle} />
      ))}
    </BundlesSection>
  )}
  
  {individualItems.length > 0 && (
    <IndividualSection>
      <h3>فیچرهای منفرد (1)</h3>
      {individualItems.map(item => (
        <CartItem item={item} />
      ))}
    </IndividualSection>
  )}
</CartContainer>
```

---

## 3. Complete Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                   Single Features Page                    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────────────┐  ┌────────────────────────┐ │
│  │   Bundle Section        │  │  All Features Section  │ │
│  │                         │  │                        │ │
│  │  📦 Premium Package     │  │  □ Feature 1 (bundle)  │ │
│  │  ├─ Feature 1          │  │  □ Feature 2 (bundle)  │ │
│  │  ├─ Feature 2          │  │  □ Feature 3           │ │
│  │  └─ Feature 3          │  │  □ Feature 4           │ │
│  │                         │  │                        │ │
│  │  [Add Bundle to Cart]  │  │  [Add to Cart] buttons │ │
│  └─────────────────────────┘  └────────────────────────┘ │
│                                                           │
│              User clicks "Add Bundle"                     │
│                       ↓                                   │
└───────────────────────┼───────────────────────────────────┘
                        │
                        │ API Call: addToCart([1, 2, 3])
                        ↓
┌──────────────────────────────────────────────────────────┐
│                      Backend                              │
├──────────────────────────────────────────────────────────┤
│  1. Add items [1, 2, 3] to cart                          │
│  2. Check for bundle matches                              │
│  3. Identify satisfied bundles                            │
│  4. Calculate bundle discounts                            │
│  5. Return CartData with satisfiedBundles                │
└───────────────────────┬───────────────────────────────────┘
                        │
                        │ Return: CartData
                        ↓
┌──────────────────────────────────────────────────────────┐
│                      Cart Page                            │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  organizeCartItemsWithBundles(items, satisfiedBundles)   │
│                       ↓                                   │
│  ┌─────────────────────────┐  ┌────────────────────────┐ │
│  │   Bundles Section       │  │  Individual Items      │ │
│  │                         │  │                        │ │
│  │  📦 Premium Package     │  │  • Standalone Feature  │ │
│  │  15% Discount           │  │                        │ │
│  │                         │  │  Price: 50,000        │ │
│  │  ┃ Feature 1           │  │  [Remove]              │ │
│  │  ┃ Feature 2           │  │                        │ │
│  │  ┃ Feature 3           │  └────────────────────────┘ │
│  │                         │                            │
│  │  Original: ~~500,000~~  │                            │
│  │  Bundle: 425,000        │                            │
│  │  🎉 Save: 75,000        │                            │
│  └─────────────────────────┘                            │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Key Features

### 🎯 Bundle Detection
- **Features Page**: Features know their bundles via `PackageBundle[]`
- **Cart Page**: Backend identifies satisfied bundles via matching items
- **Real-time**: Updates when items are added/removed

### 💰 Price Calculation
- **Individual**: Each feature has its own price
- **Bundle**: Sum of feature prices minus bundle discount
- **Display**: Shows both original and discounted prices
- **Savings**: Prominently displayed in green

### 🎨 Visual Design
- **Color Coding**: Orange/yellow for bundles, blue for individual
- **Badges**: "بخشی از باندل" badge on bundled items
- **Icons**: Package icon for bundles
- **Borders**: Dashed for bundles, solid for individual

### ⚡ Performance
- **Memoization**: Uses `useMemo` for bundle organization
- **Optimistic Updates**: Cart updates before API response
- **Loading States**: Separate states for bundles vs individual items

### ✅ Validation
- **Bundle Completeness**: All items must be present for bundle discount
- **Partial Bundles**: Treated as individual items if incomplete
- **Multiple Bundles**: Item can belong to multiple bundles

---

## 5. API Integration Points

### Features API
```typescript
GET /api/package-units
Response: {
    data: PackageUnit[] with PackageBundle[]
}
```

### Cart API

#### Get Cart
```typescript
GET /api/cart?chadcoCustomerId={id}
Response: {
    data: {
        packageUnits: CartItem[],
        satisfiedBundles: SatisfiedBundle[],
        originalTotal: number,
        discountAmount: number,
        finalTotal: number
    }
}
```

#### Add to Cart
```typescript
PATCH /api/cart/add?chadcoCustomerId={id}
Body: { unitIds: number[] }
Response: CartApiResponse
```

#### Remove from Cart
```typescript
PATCH /api/cart/remove-from-cart?chadcoCustomerId={id}
Body: { unitIds: number[] }
Response: CartApiResponse
```

---

## 6. Testing Scenarios

### Scenario 1: Add Complete Bundle
1. Navigate to single features page
2. Locate a bundle (e.g., "Premium Package")
3. Click "افزودن باندل به سبد خرید"
4. Navigate to cart
5. **Expected**: Bundle displayed in bundles section with discount

### Scenario 2: Add Individual Items
1. Navigate to single features page
2. Add individual features (not a complete bundle)
3. Navigate to cart
4. **Expected**: Items in individual section, no bundle discount

### Scenario 3: Complete Bundle by Adding Items
1. Add Feature 1 from bundle
2. Add Feature 2 from bundle
3. Add Feature 3 from bundle (completes bundle)
4. Navigate to cart
5. **Expected**: Items grouped as bundle with discount applied

### Scenario 4: Remove Bundle Item
1. Have a complete bundle in cart
2. Remove one item from the bundle
3. **Expected**: 
   - Bundle section disappears
   - Remaining items move to individual section
   - Discount removed

### Scenario 5: Multiple Bundles
1. Add items from Bundle A
2. Add items from Bundle B
3. Navigate to cart
4. **Expected**: Both bundles displayed separately

### Scenario 6: Mixed Cart
1. Add complete Bundle A
2. Add individual Feature X
3. Add individual Feature Y
4. Navigate to cart
5. **Expected**: 
   - Bundles section showing Bundle A
   - Individual section showing Features X and Y

---

## 7. Files Changed/Created

### New Files
- ✅ `lib/cart-bundle-utils.ts` - Cart bundling utilities
- ✅ `components/cart/cart-bundle-card.tsx` - Bundle display in cart
- ✅ `docs/CART_BUNDLING_IMPLEMENTATION.md` - Implementation guide
- ✅ `docs/BUNDLING_FLOW_SUMMARY.md` - This file

### Modified Files
- ✅ `components/cart/cart-item.tsx` - Added bundle support
- ✅ `components/cart/cart-container.tsx` - Bundle organization & display
- ✅ `components/packages/single-features-container.tsx` - Enhanced bundle checking
- ✅ `types/cart.ts` - Already had bundle support

### Existing Files (Reference)
- 📄 `lib/bundle-utils.ts` - Feature bundling (already exists)
- 📄 `components/packages/bundle-card.tsx` - Bundle display on features page
- 📄 `components/packages/single-feature-card.tsx` - Feature card

---

## 8. Future Enhancements

### Phase 1 (Completed) ✅
- [x] Cart bundle grouping
- [x] Visual bundle distinction
- [x] Discount display
- [x] Bundle integrity checking

### Phase 2 (Potential)
- [ ] Bulk bundle removal (remove entire bundle at once)
- [ ] Bundle preview before adding to cart
- [ ] Partial bundle suggestions ("Add 1 more item for bundle discount")
- [ ] Bundle popularity indicators
- [ ] Time-limited bundle offers

### Phase 3 (Advanced)
- [ ] Dynamic bundle creation (AI-suggested bundles)
- [ ] User-created custom bundles
- [ ] Bundle comparison tool
- [ ] Bundle upgrade paths
- [ ] Bundle gifting

---

## Summary

The bundling system now works seamlessly across the entire application:

1. **Features Page**: Shows available bundles and individual features
2. **Cart Integration**: Automatically detects and groups bundle items
3. **Visual Clarity**: Clear distinction between bundled and individual items
4. **Price Transparency**: Shows savings and discounts prominently
5. **Real-time Updates**: Bundles form/dissolve as items are added/removed

The implementation follows the same patterns as the existing feature bundling system, ensuring consistency and maintainability.


