# Feature Code Matching Guide

## Overview
This document explains how the feature code matching system works to search through nested `accessesJson` structures and highlight matching features.

## Data Structure

### AccessesJson Structure
```typescript
{
  "accessesJson": {
    "pages": [
      {
        "url": "customer/",
        "code": "customers",
        "show": true,
        "title": "customers",
        "pageId": 2,
        "enabled": true,
        "features": [
          {
            "code": "export-customers",         // ← This is what we search for!
            "name": "Export customers",
            "show": true,
            "enabled": true,
            "featureId": 2,
            "description": "Exporting customer information"
          },
          {
            "code": "edit-customer",           // ← Multiple features per page
            "name": "Edit customer",
            "show": true,
            "enabled": true,
            "featureId": 3,
            "description": "Edit customer information"
          }
        ]
      },
      {
        "url": "contract/",
        "code": "contracts",
        // ... more pages
      }
    ]
  }
}
```

## How It Works

### 1. Nested Search Process
The system searches through **all pages** → **all features** to find matching codes:

```typescript
// lib/feature-match-utils.ts

export function hasFeatureCode(accessesJson, featureCode) {
  // 1. Get pages array
  const pages = accessesJson?.pages;
  
  // 2. Loop through each page
  for (const page of pages) {
    const features = page?.features;
    
    // 3. Loop through each feature in the page
    for (const feature of features) {
      // 4. Check if feature code matches
      if (feature?.code === featureCode) {
        return true; // Found it!
      }
    }
  }
  
  return false; // Not found
}
```

### 2. Example Search Flow

Given this feature code: `"export-customers"`

```
accessesJson
  └── pages (array)
       ├── page[0]: "customers"
       │    └── features (array)
       │         ├── feature[0]: "export-customers" ✓ MATCH!
       │         └── feature[1]: "edit-customer"
       │
       ├── page[1]: "contracts"
       │    └── features (array)
       │         ├── feature[0]: "add-service"
       │         └── feature[1]: "view-contract"
       │
       └── page[2]: "invoices"
            └── features (array)
                 └── feature[0]: "pay-invoice"
```

**Result**: Match found in `pages[0].features[0]`!

## Utility Functions

### 1. `hasFeatureCode(accessesJson, featureCode)`
**Purpose**: Check if a unit contains a specific feature code

```typescript
import { hasFeatureCode } from '@/lib/feature-match-utils';

const unit = { /* unit data with accessesJson */ };
const isHighlighted = hasFeatureCode(unit.accessesJson, "export-customers");
// Returns: true or false
```

### 2. `getAllFeatureCodes(accessesJson)`
**Purpose**: Extract all feature codes from all pages

```typescript
import { getAllFeatureCodes } from '@/lib/feature-match-utils';

const codes = getAllFeatureCodes(unit.accessesJson);
// Returns: ["export-customers", "edit-customer", "add-service", ...]
```

### 3. `getAllFeaturesWithDetails(accessesJson)`
**Purpose**: Get all features with their full context

```typescript
import { getAllFeaturesWithDetails } from '@/lib/feature-match-utils';

const features = getAllFeaturesWithDetails(unit.accessesJson);
// Returns:
[
  {
    code: "export-customers",
    name: "Export customers",
    description: "Exporting customer information",
    pageTitle: "customers",
    pageCode: "customers"
  },
  // ... more features
]
```

### 4. `getMatchedFeature(accessesJson, featureCode)`
**Purpose**: Get the specific feature that matched

```typescript
import { getMatchedFeature } from '@/lib/feature-match-utils';

const matched = getMatchedFeature(unit.accessesJson, "export-customers");
// Returns:
{
  code: "export-customers",
  name: "Export customers",
  description: "Exporting customer information",
  pageTitle: "customers",
  pageCode: "customers"
}
```

### 5. `getFeatureCodesString(accessesJson)`
**Purpose**: Get feature codes as comma-separated string

```typescript
import { getFeatureCodesString } from '@/lib/feature-match-utils';

const codesString = getFeatureCodesString(unit.accessesJson);
// Returns: "export-customers, edit-customer, add-service"
```

### 6. `countFeatures(accessesJson)`
**Purpose**: Count total features

```typescript
import { countFeatures } from '@/lib/feature-match-utils';

const count = countFeatures(unit.accessesJson);
// Returns: 5 (total number of features across all pages)
```

## Implementation in Components

### SingleFeatureCard Component

```tsx
import { getMatchedFeature, getAllFeaturesWithDetails } from '@/lib/feature-match-utils';

function SingleFeatureCard({ 
  unit, 
  isHighlighted, 
  highlightCode, 
  accessesJson 
}) {
  // Get the specific feature that matched
  const matchedFeature = isHighlighted && highlightCode && accessesJson 
    ? getMatchedFeature(accessesJson, highlightCode)
    : null;
  
  // Get all features for this unit
  const allFeatures = accessesJson 
    ? getAllFeaturesWithDetails(accessesJson) 
    : [];
  
  return (
    <div className={isHighlighted ? "highlighted" : ""}>
      {/* Show the matched feature name */}
      {matchedFeature && (
        <span className="badge">
          🎯 {matchedFeature.name}
        </span>
      )}
      
      {/* Display all features */}
      <div>
        <h4>All features in this unit:</h4>
        {allFeatures.map(feature => (
          <div key={feature.code}>
            {feature.name} ({feature.pageTitle})
          </div>
        ))}
      </div>
    </div>
  );
}
```

### SingleFeaturesContainer Component

```tsx
import { hasFeatureCode } from '@/lib/feature-match-utils';

function SingleFeaturesContainer({ highlightCode }) {
  return (
    <div>
      {units.map(unit => {
        // Check if this unit has the highlighted feature
        const isHighlighted = highlightCode 
          ? hasFeatureCode(unit.accessesJson, highlightCode) 
          : false;
        
        return (
          <SingleFeatureCard
            key={unit.id}
            unit={unit}
            isHighlighted={isHighlighted}
            highlightCode={highlightCode}
            accessesJson={unit.accessesJson}
          />
        );
      })}
    </div>
  );
}
```

## Common Mistakes to Avoid

### ❌ Wrong: Checking page code instead of feature code
```typescript
// DON'T DO THIS:
const pageCode = unit.accessesJson?.pages?.[0]?.code;
if (pageCode === highlightCode) {
  // This only checks the FIRST page's code, not feature codes!
}
```

### ✅ Correct: Using the utility function
```typescript
// DO THIS:
import { hasFeatureCode } from '@/lib/feature-match-utils';
if (hasFeatureCode(unit.accessesJson, highlightCode)) {
  // This checks ALL features in ALL pages!
}
```

### ❌ Wrong: Only checking first page
```typescript
// DON'T DO THIS:
const features = unit.accessesJson?.pages?.[0]?.features;
// Misses features in other pages!
```

### ✅ Correct: Checking all pages
```typescript
// DO THIS:
import { getAllFeatureCodes } from '@/lib/feature-match-utils';
const allCodes = getAllFeatureCodes(unit.accessesJson);
// Gets features from ALL pages
```

## Visual Indicators

When a feature matches:

1. **Yellow border ring** - `ring-4 ring-yellow-400`
2. **Bold text** - `font-bold text-yellow-700`
3. **Feature name badge** - Shows the matched feature name
4. **Background tint** - `bg-yellow-50/20`
5. **Auto-scroll** - Scrolls to first match

## Testing Examples

### Test Case 1: Single Feature Match
```typescript
const accessesJson = {
  pages: [
    {
      code: "customers",
      features: [
        { code: "export-customers", name: "Export customers" }
      ]
    }
  ]
};

hasFeatureCode(accessesJson, "export-customers"); // true ✓
hasFeatureCode(accessesJson, "delete-customer"); // false ✗
```

### Test Case 2: Multiple Pages
```typescript
const accessesJson = {
  pages: [
    {
      code: "customers",
      features: [
        { code: "export-customers", name: "Export customers" }
      ]
    },
    {
      code: "contracts",
      features: [
        { code: "add-service", name: "Add Service" }
      ]
    }
  ]
};

hasFeatureCode(accessesJson, "add-service"); // true ✓
// Even though it's in the SECOND page!
```

### Test Case 3: No Features
```typescript
const accessesJson = {
  pages: [
    {
      code: "customers",
      features: [] // No features
    }
  ]
};

hasFeatureCode(accessesJson, "any-code"); // false ✗
```

## Performance Considerations

1. **Early Return**: Functions return immediately when a match is found
2. **Memoization**: Use `useMemo` for computed values
3. **Prop Optimization**: Only pass necessary data to child components

```typescript
// Good: Memoize the check
const isHighlighted = useMemo(() => 
  highlightCode ? hasFeatureCode(unit.accessesJson, highlightCode) : false,
  [unit.accessesJson, highlightCode]
);
```

## Debugging Tips

### 1. Log the Structure
```typescript
console.log('AccessesJson:', JSON.stringify(unit.accessesJson, null, 2));
console.log('Feature Codes:', getAllFeatureCodes(unit.accessesJson));
```

### 2. Check Each Level
```typescript
console.log('Has pages?', !!unit.accessesJson?.pages);
console.log('Pages count:', unit.accessesJson?.pages?.length);
console.log('First page features:', unit.accessesJson?.pages?.[0]?.features);
```

### 3. Verify Match
```typescript
const matched = getMatchedFeature(unit.accessesJson, highlightCode);
console.log('Matched feature:', matched);
```

## Summary

✅ **DO**:
- Use `hasFeatureCode()` to check for matches
- Search through **all pages** and **all features**
- Use utility functions for feature extraction
- Show matched feature details to user

❌ **DON'T**:
- Check only the first page
- Check page codes instead of feature codes
- Hardcode nested navigation
- Forget to handle null/undefined cases

