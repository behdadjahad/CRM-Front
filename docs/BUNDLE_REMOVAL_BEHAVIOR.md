# Bundle Removal Behavior

## Overview
Items within a bundle cannot be removed individually. The entire bundle must be removed as a unit to maintain bundle integrity and discount eligibility.

## User Experience

### Before (Previous Behavior) ❌
- Each item in a bundle had its own remove button
- Users could remove individual items from a bundle
- This would break the bundle discount
- Confusing UX: "Why did I lose my discount?"

### After (Current Behavior) ✅
- **No individual remove buttons** on bundled items
- **One "حذف باندل" (Remove Bundle) button** at the bundle level
- Clicking removes **all items** in the bundle at once
- Clear, predictable behavior: bundle stays intact or is removed entirely

## Implementation

### CartBundleCard Component

#### Remove Bundle Button
Located in the bundle header, next to the discount badge:

```tsx
<Button
    variant="outline"
    size="sm"
    onClick={handleRemoveBundle}
    disabled={isUpdating || isRemoving}
    className="text-red-600 border-red-600 hover:bg-red-50"
>
    <Trash2 className="w-4 h-4 ml-1" />
    {isRemoving ? 'در حال حذف...' : 'حذف باندل'}
</Button>
```

#### CartItem Props for Bundled Items
```tsx
<CartItem
    item={item}
    onQuantityChange={onQuantityChange}
    onRemove={() => {}} // No-op: can't remove individually
    isUpdating={isUpdating}
    isRemoving={isRemoving}
    isInBundle={true}
    showRemoveButton={false} // ← Key prop: hides remove button
/>
```

### CartContainer Logic

#### Bundle Removal Handler
```tsx
const handleRemoveBundle = (bundleId: number) => {
    if (!chadcoCustomerId) return;

    // Find the bundle and get all its item IDs
    const bundle = bundles.find(b => b.id === bundleId);
    if (!bundle) return;

    // Get all item IDs in the bundle
    const itemIds = bundle.items.map(item => item.id);

    // Remove all items in one API call
    removeItemMutation.mutate({
        packageUnitIds: itemIds,
        chadcoCustomerId
    });
};
```

### API Call
When removing a bundle with 3 items:
```typescript
// API Request
PATCH /api/cart/remove-from-cart?chadcoCustomerId={id}
Body: {
    unitIds: [1, 2, 3]  // All item IDs from the bundle
}

// Response updates cart with:
// - Items removed
// - satisfiedBundles updated (bundle removed)
// - Discount recalculated
// - Total updated
```

## Visual Layout

### Bundle Card with Remove Button

```
┌──────────────────────────────────────────────────────────┐
│ 📦 Premium Package    🔻 15% تخفیف    [🗑️ حذف باندل]      │
│ Complete business features bundle                        │
├──────────────────────────────────────────────────────────┤
│ قیمت کل: ~~500,000~~  صرفه‌جویی: 75,000  باندل: 425,000  │
├──────────────────────────────────────────────────────────┤
│ آیتم‌های باندل (3):                                       │
│ ┃ ┌────────────────────────────────────────────────┐     │
│ ┃ │ [بخشی از باندل] Customer Management           │     │
│ ┃ │ 150,000 تومان                   [NO BUTTON]    │     │
│ ┃ └────────────────────────────────────────────────┘     │
│ ┃ ┌────────────────────────────────────────────────┐     │
│ ┃ │ [بخشی از باندل] Invoice System                │     │
│ ┃ │ 200,000 تومان                   [NO BUTTON]    │     │
│ ┃ └────────────────────────────────────────────────┘     │
│ ┃ ┌────────────────────────────────────────────────┐     │
│ ┃ │ [بخشی از باندل] Reporting Module              │     │
│ ┃ │ 150,000 تومان                   [NO BUTTON]    │     │
│ ┃ └────────────────────────────────────────────────┘     │
├──────────────────────────────────────────────────────────┤
│ 🎉 با خرید این باندل، 75,000 تومان صرفه‌جویی می‌کنید!   │
└──────────────────────────────────────────────────────────┘
```

Note: Each bundled item has **NO** remove button (trash icon).

## User Flow

### Scenario: User Wants to Remove Bundle

1. **User sees bundle** in cart with discount
2. **User clicks "حذف باندل"** button in bundle header
3. **System shows loading state**: "در حال حذف..."
4. **API removes all items** in the bundle: [1, 2, 3]
5. **Cart updates**:
   - Bundle section disappears
   - Discount removed
   - Total recalculated
6. **Success message**: "آیتم با موفقیت حذف شد"

### Scenario: User Wants to Keep Some Items

If a user wants to keep some items but not others:

1. **Remove the entire bundle** first
2. **Re-add individual items** they want to keep
3. Items will appear in "فیچرهای منفرد" section
4. No bundle discount applied (bundle is no longer complete)

## Benefits

### 1. Bundle Integrity ✅
- Bundles always maintained as complete units
- Discount eligibility never breaks accidentally
- Clear business logic: all or nothing

### 2. User Clarity ✅
- One action to remove bundle: simple and clear
- No confusion about why discount disappeared
- Predictable behavior

### 3. Discount Protection ✅
- Bundle discounts only apply when ALL items present
- Removing one item = losing discount anyway
- This behavior makes that explicit

### 4. Reduced Errors ✅
- Users can't accidentally break bundles
- System maintains consistent state
- Fewer support tickets about "lost discounts"

## Edge Cases

### What if user removes bundle then re-adds items?
- Items added individually go to "Individual Items" section
- No bundle discount unless all items re-added
- Backend will detect and re-form bundle automatically

### What if bundle has many items?
- One button removes all items efficiently
- Single API call (better performance)
- Clear feedback during removal

### What if removal fails?
- Optimistic update rolls back
- Error message shown
- Bundle remains intact

## Code Changes Summary

### Files Modified:
1. ✅ `components/cart/cart-bundle-card.tsx`
   - Added `onRemoveBundle` prop
   - Added "حذف باندل" button in header
   - Set `showRemoveButton={false}` for bundled items

2. ✅ `components/cart/cart-container.tsx`
   - Added `handleRemoveBundle()` function
   - Collects all item IDs from bundle
   - Calls remove API with all IDs

3. ✅ `components/cart/cart-item.tsx` (already had support)
   - `showRemoveButton` prop controls visibility
   - When `isInBundle={true}` and `showRemoveButton={false}`, no button shown

## Testing Checklist

- [x] Bundle shows "حذف باندل" button
- [x] Individual items in bundle have NO remove buttons
- [x] Clicking "حذف باندل" removes all items
- [x] Loading state shows during removal
- [x] Success message appears after removal
- [x] Bundle disappears from cart
- [x] Discount is removed from total
- [x] Cart updates correctly
- [x] Error handling works (rollback on failure)

## Comparison with Individual Items

### Individual Items (NOT in bundle):
```tsx
<CartItem
    item={item}
    onRemove={() => handleRemoveItem(item.id)}
    showRemoveButton={true}  // ← Shows remove button
    isInBundle={false}
/>
```
✅ Has remove button
✅ Can be removed individually

### Bundled Items:
```tsx
<CartItem
    item={item}
    onRemove={() => {}} // No-op
    showRemoveButton={false}  // ← Hides remove button
    isInBundle={true}
/>
```
❌ No remove button
❌ Cannot be removed individually
✅ Removed only via bundle removal

## Future Enhancements

### Potential Features:
1. **Confirmation Dialog**: "Are you sure you want to remove this bundle?"
2. **Keep Items Option**: "Remove bundle but keep items as individual?"
3. **Undo Action**: "Undo bundle removal" for 5 seconds
4. **Bundle Breakdown**: Show what happens if bundle is removed
5. **Alternative Bundles**: Suggest other bundles with some items

## Summary

Bundle removal now works as a **single, atomic operation**:
- ✅ One button to remove entire bundle
- ✅ No individual item removal from bundles
- ✅ Clear, predictable behavior
- ✅ Maintains bundle integrity
- ✅ Protects bundle discounts

This creates a better user experience and maintains the business logic that bundles are special units that provide discounts only when complete.



