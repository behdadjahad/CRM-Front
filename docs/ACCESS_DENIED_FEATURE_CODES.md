# AccessDenied Feature Codes Reference

This document lists all the `featureCode` values used throughout the application for the `AccessDenied` component.

## Usage Pattern

```tsx
<AccessDenied
  featureCode="feature-code-here"  // ← The feature code from accessesJson
  title="Button Title"
  message="Access denied message"
/>
```

## Feature Codes by Module

### Customer Module
- `export-customer-contracts` - Export customer contracts to Excel
- `filter-customers` - Filter customers list
- `export-customers` - Export customers to Excel

### Contract Module  
- `add-service` - Add service to contract
- `create-contract` - Create new contract
- `filter-contracts` - Filter contracts list
- `check-all-contracts` - Select all contracts
- `export-contracts` - Export contracts to Excel

### Lead Module
- `filter-lead` - Filter leads list
- `export-lead` - Export leads to Excel
- `lead-action` - Create new lead request
- `select-lead` - Select individual leads

### Setting/Station Module
- `filter-airlines` - Filter airlines list
- `filter-accommodations` - Filter accommodations list
- `filter-airports` - Filter airports list
- `export-airlines` - Export airlines to Excel
- `export-accommodations` - Export accommodations to Excel
- `export-airports` - Export airports to Excel

## Files Updated

### ✅ Completed Files
1. `app/(dashboard-layout)/contract/[id]/page.tsx` - 4 instances
   - `add-service` (4 times)

2. `app/(dashboard-layout)/sale/page.tsx` - 4 instances
   - `create-contract`
   - `filter-contracts`
   - `check-all-contracts`
   - `export-contracts`

3. `components/customer/customer-detail-content.tsx` - 1 instance
   - `export-customer-contracts`

4. `components/customer/customer-tab-container.tsx` - 2 instances
   - `filter-customers`
   - `export-customers`

5. `components/lead/LeadContainer.tsx` - 3 instances
   - `filter-lead`
   - `export-lead`
   - `lead-action`

6. `components/lead/lead-table.tsx` - 2 instances
   - `select-lead` (2 times)

7. `components/lead/lead-creation-container.tsx` - 1 instance
   - `export-lead`

8. `components/setting/station/setting-container.tsx` - 6 instances
   - `filter-airlines`
   - `filter-accommodations`
   - `filter-airports`
   - `export-airlines`
   - `export-accommodations`
   - `export-airports`

### 📝 Files with Generic/Unknown Feature Codes

These files use `AccessDenied` but don't have clear feature codes in context:

- `components/shared/form-tab-container.tsx` - Generic form submission (uses `hasAccess` prop)
- `components/setting/setting-create-form.tsx` - Needs review
- `components/service/contract-expense-container.tsx` - Needs review
- `components/service/client-info-container.tsx` - Needs review
- `components/service/client-info-card.tsx` - Needs review
- `components/shared/contract-info-container.tsx` - Needs review
- `app/(dashboard-layout)/report/page.tsx` - Needs review
- `components/contract/registery-form.tsx` - Needs review
- `components/contract/contract-container.tsx` - Needs review
- `components/contract/contract-card.tsx` - Needs review

## How to Add Feature Code

When you encounter an `AccessDenied` usage:

1. Find the `generateFeatureAccess()` call above it
2. Extract the feature code from the first parameter
3. Add it to the `AccessDenied` component

### Example

**Before:**
```tsx
{generateFeatureAccess(pageFeatures, "export-customers")?.show &&
  !generateFeatureAccess(pageFeatures, "export-customers")?.enable && (
  <AccessDenied
    title="خروجی"
    message="شما به این بخش دسترسی ندارید"
  />
)}
```

**After:**
```tsx
{generateFeatureAccess(pageFeatures, "export-customers")?.show &&
  !generateFeatureAccess(pageFeatures, "export-customers")?.enable && (
  <AccessDenied
    featureCode="export-customers"  // ← Added this line
    title="خروجی"
    message="شما به این بخش دسترسی ندارید"
  />
)}
```

## Benefits

With `featureCode` added:
- ✅ Users can see exactly which features they need when clicking "خرید سرویس"
- ✅ Highlighted features in single-features page
- ✅ Better user experience and conversion
- ✅ Auto-scroll to relevant features

## Testing

To test if a feature code works:

1. Navigate to a restricted feature
2. Click the disabled button/action
3. AccessDenied modal appears
4. Click "خرید سرویس"
5. Should redirect to: `/single-features?highlightCode=<feature-code>`
6. Verify the feature is highlighted with yellow border
7. Verify badge shows: 🎯 <feature-name>

## Notes

- Feature codes must match exactly with the codes in `accessesJson.pages[].features[].code`
- Case-sensitive matching
- Hyphens and underscores matter
- If no `featureCode` is provided, user is redirected to single-features page without highlighting

