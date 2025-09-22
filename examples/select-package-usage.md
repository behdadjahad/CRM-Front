# SelectPackage Function Usage Examples

## Overview
The `selectPackage` function is now integrated into the package card component and will be called automatically when users click the "شروع کردن" (Start) button.

## How It Works

### 1. Automatic Integration
The function is automatically called when users click the package card button. No additional setup is required.

### 2. Data Flow
```typescript
// When user clicks "شروع کردن" button:
// 1. Extract package data (categories, units)
// 2. Call selectPackage API
// 3. Handle success/error
// 4. Open purchase modal (if successful)
```

### 3. Manual Usage (if needed)
If you need to call `selectPackage` manually, here's how:

```typescript
import { selectPackage } from '@/api/packages/package-api';

// Example 1: Select a single package
const handleManualSelection = async () => {
  try {
    const result = await selectPackage({
      packages: [1], // Package ID
      categories: [1, 2, 3], // Category IDs
      units: [
        { unitId: 1 },
        { unitId: 2 },
        { unitId: 3 }
      ]
    }, chadcoCustomerId);
    
    console.log('Package selected:', result);
  } catch (error) {
    console.error('Selection failed:', error);
  }
};

// Example 2: Select multiple packages
const handleMultipleSelection = async () => {
  try {
    const result = await selectPackage({
      packages: [1, 2, 3], // Multiple package IDs
      categories: [1, 2, 3, 4, 5], // All relevant categories
      units: [
        { unitId: 1 },
        { unitId: 2 },
        { unitId: 3 },
        { unitId: 4 },
        { unitId: 5 }
      ]
    }, chadcoCustomerId);
    
    console.log('Packages selected:', result);
  } catch (error) {
    console.error('Selection failed:', error);
  }
};
```

## Component Integration

### PackageCard Component
```typescript
<PackageCard
  data={packageData}
  chadcoCustomerId={chadcoCustomerId} // From Redux store
  onPackageSelect={(packageId, result) => {
    console.log('Package selected:', packageId, result);
    // Handle selection success
  }}
/>
```

### PackageComparisonContainer Component
```typescript
<PackageComparisonContainer
  packages={comparisonData.packages}
  categories={comparisonData.categories}
  // Customer ID is automatically retrieved from Redux store
  // Selection callback is automatically handled
/>
```

## Error Handling

The component includes built-in error handling:
- Shows loading state during selection
- Disables button when no customer ID is available
- Logs errors to console
- Provides user feedback through button text

## Required Data

The function automatically extracts:
- **Packages**: Package IDs from the selected package
- **Categories**: All category IDs from the package's categories
- **Units**: All unit IDs from the package's units

## API Response

The function returns the API response which can be used for:
- Success confirmation
- Further processing
- UI updates
- Error handling

## Notes

1. **Customer ID**: Must be available in Redux store (`state.user.chadcoCustomerId`)
2. **Authentication**: User must be logged in
3. **Data Structure**: Package data must include `packageCategories` with nested `units`
4. **Error Handling**: Built-in error handling with console logging
5. **UI Feedback**: Button shows loading state and success/error feedback
