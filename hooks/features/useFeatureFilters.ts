/**
 * Custom hook for managing feature filters
 * Handles filter state, applied filters, and filter transformations
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { SingleFeaturesFilters } from '@/types/single-features-api';

interface UseFeatureFiltersProps {
    onFiltersChange?: (filters: SingleFeaturesFilters) => void;
}

export const useFeatureFilters = ({ onFiltersChange }: UseFeatureFiltersProps = {}) => {
    const [filters, setFilters] = useState<SingleFeaturesFilters>({});
    const [appliedFilters, setAppliedFilters] = useState<SingleFeaturesFilters>({});
    const appliedFiltersRef = useRef<SingleFeaturesFilters>({});

    // Update ref when appliedFilters changes
    useEffect(() => {
        appliedFiltersRef.current = appliedFilters;
    }, [appliedFilters]);

    /**
     * Apply current filters
     */
    const applyFilters = useCallback((newFilters: SingleFeaturesFilters) => {
        // Clean up undefined values
        const cleanFilters = { ...newFilters };
        Object.keys(cleanFilters).forEach(key => {
            const value = cleanFilters[key as keyof SingleFeaturesFilters];
            if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
                delete cleanFilters[key as keyof SingleFeaturesFilters];
            }
        });

        setAppliedFilters(cleanFilters);
        appliedFiltersRef.current = cleanFilters;
        onFiltersChange?.(cleanFilters);

        return cleanFilters;
    }, [onFiltersChange]);

    /**
     * Reset all filters
     */
    const resetFilters = useCallback(() => {
        setFilters({});
        setAppliedFilters({});
        appliedFiltersRef.current = {};
        onFiltersChange?.({});
    }, [onFiltersChange]);

    /**
     * Update a specific filter
     */
    const updateFilter = useCallback(<K extends keyof SingleFeaturesFilters>(
        key: K,
        value: SingleFeaturesFilters[K]
    ) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    /**
     * Update multiple filters at once
     */
    const updateFilters = useCallback((newFilters: Partial<SingleFeaturesFilters>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    }, []);

    /**
     * Get clean filters (without undefined/empty values)
     */
    const getCleanFilters = useCallback((filtersToClean?: SingleFeaturesFilters) => {
        const targetFilters = filtersToClean || appliedFiltersRef.current;
        const cleanFilters = { ...targetFilters };

        Object.keys(cleanFilters).forEach(key => {
            const value = cleanFilters[key as keyof SingleFeaturesFilters];
            if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
                delete cleanFilters[key as keyof SingleFeaturesFilters];
            }
        });

        return cleanFilters;
    }, []);

    /**
     * Check if any filters are applied
     */
    const hasActiveFilters = useCallback(() => {
        return Object.keys(appliedFilters).length > 0;
    }, [appliedFilters]);

    /**
     * Transform form values to API filter format
     */
    const transformFormToFilters = useCallback((formValues: {
        categories?: string[];
        priceRanges?: string[];
        featureTypes?: string[];
        unitModels?: string[];
        calendarOptions?: string[];
        panelSettings?: string[];
        searchTerm?: string;
    }): SingleFeaturesFilters => {
        return {
            keyword: formValues.searchTerm,
            categories: formValues.categories?.length ? formValues.categories : undefined,
            unitModels: formValues.unitModels?.length ? formValues.unitModels : undefined,
            featureTypes: formValues.featureTypes?.length ? formValues.featureTypes : undefined,
            minPrice: formValues.priceRanges?.length ?
                Math.min(...formValues.priceRanges.map(range => {
                    if (range === "free") return 0;
                    if (range === "0-50") return 0;
                    if (range === "50-200") return 50000;
                    if (range === "200+") return 200000;
                    return 0;
                })) : undefined,
            maxPrice: formValues.priceRanges?.length ?
                Math.max(...formValues.priceRanges.map(range => {
                    if (range === "free") return 0;
                    if (range === "0-50") return 50000;
                    if (range === "50-200") return 200000;
                    if (range === "200+") return 1000000;
                    return 1000000;
                })) : undefined,
            calendarOptions: formValues.calendarOptions?.length ? formValues.calendarOptions : undefined,
            panelSettings: formValues.panelSettings?.length ? formValues.panelSettings : undefined,
        };
    }, []);

    return {
        filters,
        appliedFilters,
        appliedFiltersRef,
        setFilters,
        applyFilters,
        resetFilters,
        updateFilter,
        updateFilters,
        getCleanFilters,
        hasActiveFilters,
        transformFormToFilters,
    };
};

