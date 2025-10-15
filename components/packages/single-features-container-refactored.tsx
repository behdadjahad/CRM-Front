"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useFormik } from "formik";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from '@tanstack/react-query';
import { getCartItems } from '@/api/cart';
import { CartApiResponse } from '@/types/cart';
import { useSearchParams } from "next/navigation";

import FilterContainer from "@/components/section/filter-container";
import FormMaker, { OptionType } from "@/components/shared/form-maker";
import { Button } from "@/components/ui/button";
import { RootState, AppDispatch } from "@/store";
import { limitForSingleFeatures } from "@/lib/utils";

import { SingleFeaturesFilters } from "@/types/single-features-api";
import {
    fetchSingleFeatures,
    loadMoreSingleFeatures,
    setCheckedItems,
    setCurrentPage,
    clearError
} from "@/store/single-features-slice";
import { hasFeatureCode } from "@/lib/feature-match-utils";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useHighlightSearch } from "@/hooks/useHighlightSearch";

// Import new custom hooks
import { useCartActions } from "@/hooks/cart/useCartActions";
import { useFeatureFilters } from "@/hooks/features/useFeatureFilters";
import { useBundleDetection } from "@/hooks/features/useBundleDetection";
import { useFeatureSelection } from "@/hooks/features/useFeatureSelection";

// Import extracted components
import { SingleFeaturesHeader } from "./SingleFeaturesHeader";
import { FeatureSelectionBar } from "./FeatureSelectionBar";
import { BundleSection } from "./BundleSection";
import { SingleFeaturesGrid } from "./SingleFeaturesGrid";
import { SingleFeaturesPagination } from "./SingleFeaturesPagination";

// Import utilities and constants
import { convertToSingleFeatureUnit, extractCategories } from "@/lib/features/feature-transformers";
import { PRICE_RANGES, UNIT_MODEL_OPTIONS, FEATURE_TYPES, SORT_OPTIONS } from "@/lib/features/feature-constants";

interface SingleFeaturesContainerInterface {
    onPurchase?: (unitId: number, description: string) => void;
}

export default function SingleFeaturesContainer({
    onPurchase,
}: SingleFeaturesContainerInterface) {
    const searchParams = useSearchParams();
    const highlightCode = searchParams.get('highlightCode');
    const dispatch = useDispatch<AppDispatch>();

    const [sortBy, setSortBy] = useState<string>("name");
    const [actualSearchTerm, setActualSearchTerm] = useState("");
    const [pageSize] = useState(limitForSingleFeatures);
    const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());
    const [bundleLoadingItems, setBundleLoadingItems] = useState<Set<number>>(new Set());

    // Get state from Redux store
    const {
        items,
        currentPage,
        totalPages,
        total,
        loading,
        error,
        checkedItems,
        bundles,
    } = useSelector((state: RootState) => state.singleFeatures);

    const chadcoCustomerId = useSelector(
        (state: RootState) => state?.login?.chadcoCustomerId
    );

    // Fetch cart data
    const { data: cartData } = useQuery<CartApiResponse | null>({
        queryKey: ['cart', chadcoCustomerId],
        queryFn: async () => {
            if (!chadcoCustomerId) return null;
            return await getCartItems(chadcoCustomerId);
        },
        enabled: !!chadcoCustomerId,
        staleTime: 5 * 60 * 1000,
    });

    const cartItems = cartData?.data?.packageUnits || [];
    const satisfiedBundles = cartData?.data?.satisfiedBundles || [];

    // Use custom hooks
    const {
        isItemInCart,
        isBundleInCart,
        areAllBundleFeaturesInCart,
    } = useBundleDetection({ cartItems, satisfiedBundles });

    const {
        addToCart,
        removeFromCart,
        addToCartMutation,
        removeFromCartMutation,
    } = useCartActions({
        chadcoCustomerId: chadcoCustomerId || 0,
        onAddSuccess: (unitIds) => {
            // Remove added items from selection
            const remaining = checkedItems.filter(id => !unitIds.includes(id));
            dispatch(setCheckedItems(remaining));

            // Clear loading states
            setLoadingItems(prev => {
                const newSet = new Set(prev);
                unitIds.forEach(id => newSet.delete(id));
                return newSet;
            });
        },
        onRemoveSuccess: (unitIds) => {
            setLoadingItems(prev => {
                const newSet = new Set(prev);
                unitIds.forEach(id => newSet.delete(id));
                return newSet;
            });
        },
    });

    const {
        selectedIds,
        selectedCount,
        selectableItems,
        allSelected,
        toggleItem,
        toggleAll,
        isItemSelected,
        clearSelection,
    } = useFeatureSelection({
        items,
        isItemSelectable: (itemId) => !isItemInCart(itemId),
    });

    const {
        appliedFilters,
        appliedFiltersRef,
        applyFilters,
        resetFilters,
        transformFormToFilters,
        getCleanFilters,
    } = useFeatureFilters({
        onFiltersChange: (filters) => {
            dispatch(fetchSingleFeatures({
                page: 1,
                limit: pageSize,
                filters: getCleanFilters(filters)
            }));
            dispatch(setCurrentPage(1));
        },
    });

    // Sync Redux checkedItems with local selection
    useEffect(() => {
        dispatch(setCheckedItems(selectedIds));
    }, [selectedIds, dispatch]);

    // Search form
    const searchFormik = useFormik({
        initialValues: {
            searchTerm: "",
        },
        onSubmit: () => { },
    });

    // Filter form
    const filterFormik = useFormik({
        initialValues: {
            categories: [] as string[],
            priceRanges: [] as string[],
            featureTypes: [] as string[],
            unitModels: [] as string[],
            minPrice: "",
            maxPrice: "",
            countFilter: "",
            startDate: "",
            endDate: "",
            startDateType: "",
            endDateType: "",
            calendarOptions: [],
            panelSettings: [],
        },
        onSubmit: () => { },
    });

    // Debounced search
    const debouncedSearch = useCallback(
        debounce((keyword: string) => {
            setActualSearchTerm(keyword);
            const searchFilters = {
                ...appliedFiltersRef.current,
                keyword: keyword || undefined
            };
            applyFilters(searchFilters);
        }, 300),
        [applyFilters]
    );

    useEffect(() => {
        debouncedSearch(searchFormik.values.searchTerm);
        return () => debouncedSearch.cancel();
    }, [searchFormik.values.searchTerm, debouncedSearch]);

    // Initial fetch
    useEffect(() => {
        const cleanFilters = getCleanFilters();
        dispatch(fetchSingleFeatures({
            page: currentPage,
            limit: pageSize,
            filters: cleanFilters
        }));
    }, [dispatch]);

    // Package units for display
    const packageUnits = useMemo(() => {
        return items.map(item => item.rawData).filter(Boolean);
    }, [items]);

    // Extract categories
    const categories = useMemo(() => extractCategories(packageUnits), [packageUnits]);

    // Load next page callback
    const loadNextPage = useCallback(async () => {
        const cleanFilters = getCleanFilters();
        await dispatch(loadMoreSingleFeatures({
            page: currentPage + 1,
            limit: pageSize,
            filters: cleanFilters
        })).unwrap();
    }, [currentPage, pageSize, dispatch, getCleanFilters]);

    // Highlight search hook
    const { isSearching: isSearchingHighlight, resetSearch } = useHighlightSearch({
        items: packageUnits,
        highlightCode: highlightCode! || "",
        currentPage,
        totalPages,
        isLoading: loading,
        checkMatch: (unit, code) => hasFeatureCode(unit.accessesJson, code),
        onLoadNextPage: loadNextPage,
    });

    // Infinite scroll hook
    const { loadMoreRef, isLoadingMore } = useInfiniteScroll({
        hasMore: currentPage < totalPages,
        isLoading: loading,
        onLoadMore: loadNextPage,
        disabled: isSearchingHighlight,
    });

    // Filter items for FilterContainer
    const filterItems = [
        {
            title: "نوع",
            component: (
                <FormMaker
                    form={filterFormik}
                    fields={[{
                        key: "featureTypes",
                        component: "checkbox",
                        type: "text",
                        className: "flex flex-col items-start",
                        options: FEATURE_TYPES,
                    }]}
                    className="w-full"
                />
            ),
        },
        {
            title: "دسته‌بندی",
            component: (
                <FormMaker
                    form={filterFormik}
                    fields={[{
                        key: "categories",
                        component: "checkbox",
                        type: "text",
                        className: "flex flex-col items-start",
                        options: categories.map(category => ({
                            value: category,
                            label: category
                        })),
                    }]}
                    className="w-full"
                />
            ),
        },
        {
            title: "مدل واحد",
            component: (
                <FormMaker
                    form={filterFormik}
                    fields={[{
                        key: "unitModels",
                        component: "checkbox",
                        type: "text",
                        className: "flex flex-col items-start",
                        options: UNIT_MODEL_OPTIONS.filter(option => option.value !== "all"),
                    }]}
                    className="w-full"
                />
            ),
        },
        {
            title: "محدوده قیمت",
            component: (
                <FormMaker
                    form={filterFormik}
                    fields={[{
                        key: "priceRanges",
                        component: "checkbox",
                        type: "text",
                        className: "flex flex-col items-start",
                        options: PRICE_RANGES.filter(option => option.value !== "all"),
                    }]}
                    className="w-full"
                />
            ),
        }
    ];

    const rangeItems = [
        {
            title: "بازه زمانی",
            component: (
                <FormMaker
                    form={filterFormik}
                    fields={[
                        {
                            key: "startDate",
                            dependantKey: "startDateType",
                            component: "date",
                            placeholder: "از تاریخ",
                            type: "text",
                            floating: true,
                            className: "w-full px-0 mb-3",
                        },
                        {
                            key: "endDate",
                            dependantKey: "endDateType",
                            component: "date",
                            placeholder: "تا تاریخ",
                            type: "text",
                            floating: true,
                            className: "w-full px-0",
                        },
                    ]}
                    className="flex flex-col w-full gap-2"
                />
            ),
        },
    ];

    const sortList: OptionType[] = SORT_OPTIONS.map(option => ({
        value: option.value,
        label: option.label
    }));

    // Handlers
    const handleApplyFilters = () => {
        const newFilters = transformFormToFilters(filterFormik.values);
        const finalFilters = {
            ...newFilters,
            keyword: appliedFilters.keyword || actualSearchTerm
        };
        resetSearch();
        applyFilters(finalFilters);
    };

    const handleSort = (sortValue: string) => {
        setSortBy(sortValue);
    };

    const handleCancelFilter = () => {
        filterFormik.resetForm();
        setSortBy("name");
        searchFormik.resetForm();
        setActualSearchTerm("");
        resetSearch();
        resetFilters();
    };

    const handleAddSelectedToCart = () => {
        if (chadcoCustomerId && selectedIds.length > 0) {
            setLoadingItems(new Set(selectedIds));
            addToCart(selectedIds);
            clearSelection();
        }
    };

    const handleAddBundleToCart = (bundleId: number, bundleName: string, features: any[]) => {
        if (chadcoCustomerId) {
            setBundleLoadingItems(prev => new Set([...Array.from(prev), bundleId]));
            const featureIds = features.map(f => f.id);
            setLoadingItems(new Set(featureIds));
            addToCart(featureIds);
        }
    };

    const handleRemoveBundleFromCart = (bundleId: number, features: any[]) => {
        if (chadcoCustomerId) {
            setBundleLoadingItems(prev => new Set([...Array.from(prev), bundleId]));
            const featureIds = features.map(f => f.id);
            setLoadingItems(new Set(featureIds));
            removeFromCart(featureIds);
        }
    };

    const handleRefresh = () => {
        dispatch(clearError());
        const cleanFilters = getCleanFilters();
        dispatch(fetchSingleFeatures({
            page: currentPage,
            limit: pageSize,
            filters: cleanFilters
        }));
    };

    // Error state
    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 text-lg mb-2">خطا در بارگذاری داده‌ها</div>
                <div className="text-gray-400 text-sm mb-4">
                    {typeof error === 'string' ? error : 'خطای نامشخص'}
                </div>
                <Button onClick={handleRefresh} variant="outline">تلاش مجدد</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters and Search Section */}
            <section className="bg-card rounded-lg p-6">
                <div className="gap-4 flex flex-col">
                    <div className="flex flex-row items-center justify-between">
                        <FilterContainer
                            onFilterHandler={handleApplyFilters}
                            rangeItems={rangeItems}
                            filterItems={filterItems}
                            sortList={sortList}
                            onSortHandler={handleSort}
                            onCancleHandler={handleCancelFilter}
                        />
                        <SingleFeaturesHeader
                            searchTerm={searchFormik.values.searchTerm}
                            onSearchChange={(value) => searchFormik.setFieldValue("searchTerm", value)}
                            onSearchSelect={(selectedFeature) => {
                                searchFormik.setFieldValue("searchTerm", selectedFeature.name);
                                setActualSearchTerm(selectedFeature.name);
                                const searchFilters = {
                                    ...appliedFiltersRef.current,
                                    keyword: selectedFeature.name
                                };
                                applyFilters(searchFilters);
                            }}
                            packageUnits={packageUnits}
                            selectedCount={selectedCount}
                            selectableCount={selectableItems.length}
                            allSelected={allSelected}
                            onSelectAll={toggleAll}
                        />
                    </div>
                </div>
            </section>

            {/* Results Summary */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => toggleAll(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
                        {selectedCount > 0 ? `${selectedCount} مورد انتخاب شده` : `انتخاب همه (${selectableItems.length} مورد قابل انتخاب)`}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                        نمایش {packageUnits.length} از {total} مورد
                    </span>
                </div>
            </div>

            {/* Selection Bar */}
            <FeatureSelectionBar
                selectedCount={selectedCount}
                onAddToCart={handleAddSelectedToCart}
                onClearSelection={clearSelection}
                isLoading={addToCartMutation.isPending}
            />

            {/* Bundles Section */}
            <BundleSection
                bundles={bundles}
                convertToSingleFeatureUnit={convertToSingleFeatureUnit}
                isBundleChecked={(bundleId) => false}
                onBundleCheckChange={() => { }}
                isBundleInCart={isBundleInCart}
                areAllBundleFeaturesInCart={areAllBundleFeaturesInCart}
                onAddBundleToCart={handleAddBundleToCart}
                onRemoveBundleFromCart={handleRemoveBundleFromCart}
                bundleLoadingItems={bundleLoadingItems}
                chadcoCustomerId={chadcoCustomerId}
            />

            {/* Features Grid */}
            <section>
                {loading && packageUnits.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">در حال بارگذاری...</div>
                    </div>
                ) : (
                    <SingleFeaturesGrid
                        units={packageUnits}
                        convertToSingleFeatureUnit={convertToSingleFeatureUnit}
                        chadcoCustomerId={chadcoCustomerId}
                        isItemInCart={isItemInCart}
                        isItemChecked={isItemSelected}
                        onItemCheckChange={toggleItem}
                        onAddToCart={(unitId, requestMessage) => {
                            if (chadcoCustomerId) {
                                setLoadingItems(new Set([unitId]));
                                addToCart([unitId]);
                            }
                        }}
                        onRemoveFromCart={(itemId) => {
                            if (chadcoCustomerId) {
                                setLoadingItems(new Set([parseInt(itemId)]));
                                removeFromCart([parseInt(itemId)]);
                            }
                        }}
                        onPurchase={onPurchase}
                        loadingItems={loadingItems}
                        highlightCode={highlightCode || ""}
                    />
                )}
            </section>

            {/* Pagination */}
            <SingleFeaturesPagination
                hasMore={currentPage < totalPages}
                isLoading={isLoadingMore}
                loadMoreRef={loadMoreRef}
                currentCount={packageUnits.length}
                totalCount={total}
            />
        </div>
    );
}

