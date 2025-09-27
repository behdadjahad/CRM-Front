import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchAllSingleFeatures } from '@/store/single-features-slice';
import { SingleFeaturesFilters } from '@/types/single-features-api';

/**
 * Custom hook for exporting single features data
 * Similar to customer export functionality
 */
export const useSingleFeaturesExport = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { allItems, loading, filters } = useSelector((state: RootState) => state.singleFeatures);

    /**
     * Fetch all single features data for export
     * @param exportFilters - Optional filters to apply for export
     */
    const fetchForExport = async (exportFilters?: SingleFeaturesFilters) => {
        const filtersToUse = exportFilters || filters;
        await dispatch(fetchAllSingleFeatures({
            page: 1,
            limit: 1000, // Large limit to get all data
            filters: filtersToUse
        }));
    };

    /**
     * Get export data in the format expected by export utilities
     */
    const getExportData = () => {
        return allItems;
    };

    /**
     * Check if export data is available
     */
    const hasExportData = () => {
        return allItems && allItems.length > 0;
    };

    return {
        fetchForExport,
        getExportData,
        hasExportData,
        isLoading: loading,
        exportCount: allItems?.length || 0,
    };
};

export default useSingleFeaturesExport;
