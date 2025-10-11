# Hooks Quick Reference

## useInfiniteScroll

### Basic Usage
```typescript
import { useInfiniteScroll } from '@/hooks';

const { loadMoreRef, isLoadingMore } = useInfiniteScroll({
  hasMore: currentPage < totalPages,
  isLoading: loading,
  onLoadMore: async () => {
    await dispatch(loadMoreItems());
  },
});
```

### In JSX
```tsx
{hasMore && (
  <div ref={loadMoreRef} className="py-8 text-center">
    {isLoadingMore ? (
      <Spinner />
    ) : (
      <div>اسکرول کنید تا بیشتر ببینید</div>
    )}
  </div>
)}
```

### All Options
```typescript
useInfiniteScroll({
  hasMore: boolean,           // Required: has more data?
  isLoading: boolean,         // Required: is loading?
  onLoadMore: () => void,     // Required: load callback
  rootMargin?: '100px',       // Optional: trigger distance
  threshold?: 0.1,            // Optional: visibility %
  disabled?: false,           // Optional: disable scroll
})
```

## useHighlightSearch

### Basic Usage
```typescript
import { useHighlightSearch } from '@/hooks';

const { isSearching, resetSearch } = useHighlightSearch({
  items: displayItems,
  highlightCode: 'export-customers',
  currentPage: 1,
  totalPages: 10,
  isLoading: false,
  checkMatch: (item, code) => item.code === code,
  onLoadNextPage: async () => {
    await dispatch(loadNextPage());
  },
});
```

### Reset on Filter Change
```typescript
const handleApplyFilters = () => {
  resetSearch(); // Reset search
  dispatch(applyFilters());
};
```

### All Options
```typescript
useHighlightSearch({
  items: T[],                          // Required: current items
  highlightCode?: string,              // Optional: code to find
  currentPage: number,                 // Required: current page
  totalPages: number,                  // Required: total pages
  isLoading: boolean,                  // Required: is loading?
  checkMatch: (item, code) => boolean, // Required: match function
  onLoadNextPage: () => Promise<void>, // Required: load callback
  scrollDelay?: 300,                   // Optional: scroll delay (ms)
})
```

## Combined Usage (Recommended)

```typescript
import { useInfiniteScroll, useHighlightSearch } from '@/hooks';

// Shared load callback
const loadNext = useCallback(async () => {
  await dispatch(loadMore({ page: currentPage + 1 }));
}, [currentPage, dispatch]);

// Auto-search for highlights
const { isSearching, resetSearch } = useHighlightSearch({
  items: data,
  highlightCode: searchParams.get('code'),
  currentPage,
  totalPages,
  isLoading: loading,
  checkMatch: (item, code) => item.featureCode === code,
  onLoadNextPage: loadNext,
});

// Manual infinite scroll
const { loadMoreRef, isLoadingMore } = useInfiniteScroll({
  hasMore: currentPage < totalPages,
  isLoading: loading,
  onLoadMore: loadNext,
  disabled: isSearching, // Disable while auto-searching
});

// Reset on filter change
const handleFilterChange = () => {
  resetSearch();
  dispatch(applyFilters());
};
```

## Common Patterns

### Pattern 1: Simple List
```typescript
const { loadMoreRef, isLoadingMore } = useInfiniteScroll({
  hasMore: hasMore,
  isLoading: isLoading,
  onLoadMore: loadMore,
});

return (
  <>
    {items.map(item => <Card key={item.id} {...item} />)}
    {hasMore && <div ref={loadMoreRef}>{isLoadingMore && <Spinner />}</div>}
  </>
);
```

### Pattern 2: With Search/Filter
```typescript
const loadNext = useCallback(async () => {
  await fetchMore({ filters, page: nextPage });
}, [filters, nextPage]);

const { loadMoreRef } = useInfiniteScroll({
  hasMore: hasNextPage,
  isLoading: isFetching,
  onLoadMore: loadNext,
});
```

### Pattern 3: With Highlight
```typescript
const loadNext = useCallback(async () => {
  await dispatch(loadMore());
}, [dispatch]);

const { resetSearch } = useHighlightSearch({
  items: data,
  highlightCode: urlCode,
  currentPage,
  totalPages,
  isLoading: loading,
  checkMatch: matchFunction,
  onLoadNextPage: loadNext,
});

const { loadMoreRef } = useInfiniteScroll({
  hasMore: hasMore,
  isLoading: loading,
  onLoadMore: loadNext,
});

// Don't forget to reset!
const handleFilterChange = () => {
  resetSearch();
  applyFilters();
};
```

## Return Values

### useInfiniteScroll
```typescript
{
  loadMoreRef: RefObject<HTMLDivElement>,  // Attach to trigger element
  isLoadingMore: boolean,                  // Is loading more items?
}
```

### useHighlightSearch
```typescript
{
  isSearching: boolean,      // Is auto-loading pages?
  searchComplete: boolean,   // Search finished?
  resetSearch: () => void,   // Reset search state
}
```

## Tips & Tricks

### Tip 1: Share Load Callback
```typescript
// ✅ Create one callback, use in both hooks
const loadNext = useCallback(async () => {
  await dispatch(loadMore());
}, [dispatch]);

useHighlightSearch({ onLoadNextPage: loadNext });
useInfiniteScroll({ onLoadMore: loadNext });
```

### Tip 2: Disable During Search
```typescript
// ✅ Prevent manual scroll while auto-searching
const { isSearching } = useHighlightSearch({ ... });
const { loadMoreRef } = useInfiniteScroll({ 
  disabled: isSearching  // Disable while searching
});
```

### Tip 3: Reset on Navigation
```typescript
// ✅ Reset when leaving page or changing filters
useEffect(() => {
  return () => resetSearch(); // Cleanup
}, [resetSearch]);
```

### Tip 4: Custom Trigger Distance
```typescript
// Load early for better UX
useInfiniteScroll({
  rootMargin: '200px', // Load 200px before bottom
  // ...
});

// Load late to save bandwidth
useInfiniteScroll({
  rootMargin: '50px', // Load 50px before bottom
  // ...
});
```

## Troubleshooting

### Hook not triggering?
```typescript
// Check these:
1. Is loadMoreRef attached? <div ref={loadMoreRef}>
2. Is hasMore true? console.log(hasMore)
3. Is element in viewport? Check CSS/layout
4. Is disabled true? console.log(disabled)
```

### Items disappearing?
```typescript
// Redux slice should APPEND, not REPLACE:
.addCase(loadMore.fulfilled, (state, action) => {
  state.items = [...state.items, ...action.payload]; // ✅ Append
  // state.items = action.payload; // ❌ Replace (wrong!)
});

// Don't set loading=true in loadMore.pending:
.addCase(loadMore.pending, (state) => {
  // Don't set state.loading = true; // ❌ Hides items
});
```

### Infinite loop?
```typescript
// Ensure checkMatch doesn't always return false:
checkMatch: (item, code) => {
  console.log('Checking:', item.code, 'vs', code);
  return item.code === code; // Verify this works
}
```

## Examples

### Example 1: Products
```typescript
const { loadMoreRef } = useInfiniteScroll({
  hasMore: products.length < totalProducts,
  isLoading: isLoadingProducts,
  onLoadMore: () => fetchMoreProducts(),
});
```

### Example 2: Search Results
```typescript
const { isSearching, resetSearch } = useHighlightSearch({
  items: searchResults,
  highlightCode: query,
  currentPage: page,
  totalPages: maxPages,
  isLoading: isSearching,
  checkMatch: (result, q) => result.title.includes(q),
  onLoadNextPage: loadMore,
});
```

### Example 3: Custom Matching
```typescript
useHighlightSearch({
  // ...
  checkMatch: (product, sku) => {
    // Custom complex matching
    return product.sku === sku || 
           product.aliases.includes(sku) ||
           product.tags.some(tag => tag.code === sku);
  },
});
```

## Quick Start Checklist

- [ ] Import hooks: `import { useInfiniteScroll, useHighlightSearch } from '@/hooks'`
- [ ] Create `loadNext` callback with `useCallback`
- [ ] Setup `useHighlightSearch` (if needed)
- [ ] Setup `useInfiniteScroll`
- [ ] Attach `loadMoreRef` to trigger element
- [ ] Update Redux slice to append items
- [ ] Remove `state.loading = true` from `loadMore.pending`
- [ ] Call `resetSearch()` when filters change
- [ ] Test scroll behavior
- [ ] Test highlight search (if applicable)

## Resources

- 📖 Full Guide: `INFINITE_SCROLL_OPTIMIZATION.md`
- 📊 Before/After: `INFINITE_SCROLL_BEFORE_AFTER.md`
- 🔧 Implementation: `hooks/useInfiniteScroll.ts`, `hooks/useHighlightSearch.ts`
- 💡 Example: `components/packages/single-features-container.tsx`

---

**Need help?** Check the implementation in `single-features-container.tsx` for a complete working example!

