# Feature Highlighting Guide

## Overview
This feature allows you to highlight specific features in the single-features page based on their feature code. When a user lacks access to a feature, they can be directed to the single-features page with the relevant features highlighted.

## How It Works

### 1. User Flow
1. User attempts to access a restricted feature
2. `AccessDenied` modal appears
3. User clicks "خرید سرویس" (Buy Service)
4. User is redirected to single-features page with matching features highlighted

### 2. Component Integration

#### AccessDenied Component
Pass the `featureCode` prop to highlight specific features:

```tsx
<AccessDenied
  title="افزودن سرویس"
  message="شما به این بخش دسترسی ندارید"
  featureCode="add-service" // The feature code to highlight
/>
```

#### Example Usage in Contract Page
```tsx
{pageFeatures && generateFeatureAccess(pageFeatures, "add-service")?.show && 
 generateFeatureAccess(pageFeatures, "add-service")?.enable ? (
  <Button variant="info">
    افزودن سرویس
  </Button>
) : (
  <AccessDenied
    title="افزودن سرویس"
    featureCode="add-service" // Pass the same code used in generateFeatureAccess
  />
)}
```

### 3. URL Structure
When navigating with a feature code, the URL will be:
```
/single-features?highlightCode=add-service
```

### 4. Feature Matching
The system searches through all package units and checks their `accessesJson.pages[].features[].code` fields. Any unit containing a feature with the matching code will be highlighted.

## Visual Indicators

Highlighted features include:
- 🎯 **Yellow ring border** with pulse animation
- **Bold text** for the feature name (in yellow-brown color)
- **"پیشنهاد شده" badge** (Recommended badge)
- **Auto-scroll** to the first matching feature
- **Enhanced shadow** for better visibility

## Technical Implementation

### Files Modified
1. `components/shared/AccessDenied.tsx` - Accepts and passes feature code
2. `app/(dashboard-layout)/single-features/page.tsx` - Reads query parameter
3. `components/packages/single-features-container.tsx` - Processes highlighting logic
4. `components/packages/single-feature-card.tsx` - Displays highlighted state
5. `lib/feature-match-utils.ts` - Utility functions for matching feature codes

### Utility Functions

#### `hasFeatureCode(accessesJson, featureCode)`
Checks if a package unit contains a feature with the given code.

```typescript
import { hasFeatureCode } from "@/lib/feature-match-utils";

const isHighlighted = hasFeatureCode(unit.accessesJson, "add-service");
```

#### `getAllFeatureCodes(accessesJson)`
Extracts all feature codes from a package unit.

```typescript
import { getAllFeatureCodes } from "@/lib/feature-match-utils";

const codes = getAllFeatureCodes(unit.accessesJson);
// Returns: ["add-service", "edit-service", "delete-service", ...]
```

## Data Structure

### AccessesJson Structure
```typescript
{
  pages: [
    {
      pageId: 1,
      title: "قراردادها",
      code: "contract",
      url: "/contract",
      show: true,
      enabled: true,
      features: [
        {
          featureId: 1,
          code: "add-service",      // This is matched!
          name: "افزودن سرویس",
          description: "...",
          show: true,
          enabled: true,
          urlPattern: ["/contract/*/add-service"]
        }
      ]
    }
  ]
}
```

## Best Practices

1. **Use Consistent Codes**: Use the same code in both `generateFeatureAccess` and `AccessDenied`
2. **Meaningful Codes**: Use descriptive codes like `add-service`, `edit-customer`, etc.
3. **Fallback**: If no code is provided, the page works normally without highlighting
4. **Multiple Features**: Multiple units can match the same code - all will be highlighted

## Example Scenarios

### Scenario 1: Add Service Feature
```tsx
// In contract page
<AccessDenied
  title="افزودن سرویس"
  featureCode="add-service"
/>
```
Result: All package units containing the "add-service" feature will be highlighted.

### Scenario 2: Edit Customer Feature
```tsx
// In customer page
<AccessDenied
  title="ویرایش مشتری"
  featureCode="edit-customer"
/>
```
Result: All package units containing the "edit-customer" feature will be highlighted.

### Scenario 3: No Feature Code
```tsx
// General access denied
<AccessDenied
  title="خرید سرویس"
  // No featureCode provided
/>
```
Result: User is redirected to single-features page without any highlighting.

## Testing

To test the implementation:

1. Find a feature with access control (e.g., "add-service" in contract page)
2. Ensure the user doesn't have access to it
3. Click on the disabled feature/button
4. Verify AccessDenied modal appears
5. Click "خرید سرویس"
6. Verify:
   - Redirects to `/single-features?highlightCode=add-service`
   - Matching features are highlighted with yellow border
   - "پیشنهاد شده" badge appears
   - Page auto-scrolls to first matching feature
   - Feature name is bold

## Troubleshooting

### Features Not Highlighted
- Check that the feature code matches exactly (case-sensitive)
- Verify the package unit's `accessesJson` structure
- Check browser console for any errors
- Ensure the feature code exists in the backend data

### Auto-scroll Not Working
- The scroll happens after a 300ms delay
- Ensure cards have the `data-unit-card` attribute
- Check if the page has fully loaded before scrolling

### Query Parameter Not Working
- Verify Next.js `useSearchParams` is being used correctly
- Check that the URL includes `?highlightCode=...`
- Ensure the page is a client component (`"use client"`)

## Future Enhancements

Possible improvements:
1. Add analytics to track which features users try to access
2. Show a counter of how many matching features were found
3. Add filter to show only highlighted features
4. Add a "clear highlight" button
5. Store recently highlighted codes for quick access

