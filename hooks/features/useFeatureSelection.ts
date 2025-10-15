/**
 * Custom hook for managing feature selection (bulk selection)
 * Handles checkbox selection state and operations
 */

import { useState, useCallback, useMemo } from 'react';

interface UseFeatureSelectionProps<T = { id: number }> {
    items: T[];
    isItemSelectable?: (itemId: number) => boolean;
}

export const useFeatureSelection = <T extends { id: number }>({
    items = [],
    isItemSelectable
}: UseFeatureSelectionProps<T>) => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    /**
     * Select or deselect a single item
     */
    const toggleItem = useCallback((itemId: number, checked: boolean) => {
        // Check if item is selectable
        if (isItemSelectable && !isItemSelectable(itemId)) {
            return;
        }

        if (checked) {
            setSelectedIds(prev => [...prev, itemId]);
        } else {
            setSelectedIds(prev => prev.filter(id => id !== itemId));
        }
    }, [isItemSelectable]);

    /**
     * Select or deselect all selectable items
     */
    const toggleAll = useCallback((checked: boolean) => {
        if (checked) {
            const selectableIds = items
                .filter(item => !isItemSelectable || isItemSelectable(item.id))
                .map(item => item.id);
            setSelectedIds(selectableIds);
        } else {
            setSelectedIds([]);
        }
    }, [items, isItemSelectable]);

    /**
     * Check if an item is selected
     */
    const isItemSelected = useCallback((itemId: number): boolean => {
        return selectedIds.includes(itemId);
    }, [selectedIds]);

    /**
     * Clear all selections
     */
    const clearSelection = useCallback(() => {
        setSelectedIds([]);
    }, []);

    /**
     * Remove specific items from selection
     */
    const removeFromSelection = useCallback((itemIds: number[]) => {
        setSelectedIds(prev => prev.filter(id => !itemIds.includes(id)));
    }, []);

    /**
     * Get selectable items (items that can be selected)
     */
    const selectableItems = useMemo(() => {
        return items.filter(item => !isItemSelectable || isItemSelectable(item.id));
    }, [items, isItemSelectable]);

    /**
     * Check if all selectable items are selected
     */
    const allSelected = useMemo(() => {
        return selectableItems.length > 0 && selectedIds.length === selectableItems.length;
    }, [selectableItems, selectedIds]);

    /**
     * Get selection count
     */
    const selectedCount = useMemo(() => {
        return selectedIds.length;
    }, [selectedIds]);

    return {
        selectedIds,
        selectedCount,
        selectableItems,
        allSelected,
        toggleItem,
        toggleAll,
        isItemSelected,
        clearSelection,
        removeFromSelection,
        setSelectedIds,
    };
};

