/**
 * UI-specific types for features
 * These types are used by components and hooks
 */

import { PackageUnit, SingleFeaturesFilters } from './single-features-api';

/**
 * Filter form values
 */
export interface FilterFormValues {
    categories: string[];
    priceRanges: string[];
    featureTypes: string[];
    unitModels: string[];
    minPrice: string;
    maxPrice: string;
    countFilter: string;
    startDate: string;
    endDate: string;
    startDateType: string;
    endDateType: string;
    calendarOptions: string[];
    panelSettings: string[];
}

/**
 * Search form values
 */
export interface SearchFormValues {
    searchTerm: string;
}

/**
 * Transformed feature item for Redux store
 */
export interface TransformedFeatureItem {
    id: number;
    info: Record<string, string>;
    subInfo: Record<string, string>;
    exportData: Record<string, string | number>;
    rawData: PackageUnit;
}

/**
 * Loading state types
 */
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

/**
 * Selection mode
 */
export type SelectionMode = 'none' | 'single' | 'multiple';

