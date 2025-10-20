"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useFormik } from "formik";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { addToCart as addToCartApi, getCartItems, removeFromCart as removeFromCartApi } from '@/api/cart';
import { CartApiResponse, CartItem } from '@/types/cart';

import FilterContainer from "@/components/section/filter-container";
import FormMaker, { OptionType } from "@/components/shared/form-maker";
import SingleFeatureCard from "./single-feature-card";
import BundleCard from "./bundle-card";
import { Button } from "@/components/ui/button";
import { RootState, AppDispatch } from "@/store";
import { CustomToast } from "@/components/shared/custome-toast";
import { limitForSingleFeatures } from "@/lib/utils";

import {
    PackageUnit,
    SingleFeaturesFilters,
    SingleFeaturesContainerProps
} from "@/types/single-features-api";
import {
    fetchSingleFeatures,
    fetchAllSingleFeatures,
    loadMoreSingleFeatures,
    setCheckedItems,
    setFilters,
    setCurrentPage,
    clearError
} from "@/store/single-features-slice";
import { hasFeatureCode } from "@/lib/feature-match-utils";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useSearchParams } from "next/navigation";
import AutocompleteInput from "../shared/autocomplete-input";
import { useCartOperations } from "@/hooks/cart/useCartOperations";

interface SingleFeaturesContainerInterface {
    onPurchase?: (unitId: number, description: string) => void;
}

export default function SingleFeaturesContainer({
    onPurchase,
}: SingleFeaturesContainerInterface) {
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const queryClient = useQueryClient();
    const chadcoCustomerId = useSelector((state: RootState) => state?.login?.chadcoCustomerId);

    // Redux state
    const {
        items,
        bundles,
        checkedItems,
        filters,
        currentPage,
        totalPages,
        total,
        loading,
        error
    } = useSelector((state: RootState) => state.singleFeatures);

    // Local state
    const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());
    const [bundleLoadingItems, setBundleLoadingItems] = useState<Set<number>>(new Set());

    // Cart operations hook
    const {
        addToCart,
        removeItem,
        isAddingToCart,
        isRemovingFromCart,
    } = useCartOperations({ chadcoCustomerId: chadcoCustomerId || 0 });

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

    // Helper functions
    const isItemInCart = useCallback((unitId: number): boolean => {
        return cartItems.some((item: CartItem) => item.id === unitId);
    }, [cartItems]);

    const isBundleInCart = useCallback((bundleId: number): boolean => {
        if (!cartData?.data?.satisfiedBundles) return false;
        return cartData.data.satisfiedBundles.some(bundle => bundle.id === bundleId);
    }, [cartData]);

    const isItemChecked = useCallback((unitId: number): boolean => {
        return checkedItems.includes(unitId);
    }, [checkedItems]);

    // Event handlers
    const handleCheckItem = useCallback((unitId: number) => {
        const newCheckedItems = isItemChecked(unitId)
            ? checkedItems.filter(id => id !== unitId)
            : [...checkedItems, unitId];
        dispatch(setCheckedItems(newCheckedItems));
    }, [checkedItems, dispatch, isItemChecked]);

    const handleAddToCart = useCallback((unitIds: number[]) => {
        if (!chadcoCustomerId) return;

        setLoadingItems(prev => new Set([...Array.from(prev), ...unitIds]));
        addToCart(unitIds);

        // Clear loading state after a delay
        setTimeout(() => {
            setLoadingItems(prev => {
                const newSet = new Set(prev);
                unitIds.forEach(id => newSet.delete(id));
                return newSet;
            });
        }, 2000);
    }, [chadcoCustomerId, addToCart]);

    const handleRemoveFromCart = useCallback((itemId: string) => {
        if (!chadcoCustomerId) return;

        const cartItemWithQuantity = cartData?.data?.items?.find((item: any) => item.unitId.toString() === itemId);
        const quantity = cartItemWithQuantity?.count || 1;

        const itemIdsToRemove = Array(quantity).fill(parseInt(itemId));
        removeItem(parseInt(itemId), quantity);
    }, [chadcoCustomerId, cartData, removeItem]);

    const handleBundleAction = useCallback((bundleId: number, action: 'add' | 'remove') => {
        if (!chadcoCustomerId) return;

        const bundle = bundles.find(b => b.id === bundleId);
        if (!bundle) return;

        setBundleLoadingItems(prev => new Set([...Array.from(prev), bundleId]));

        if (action === 'add') {
            const featureIds = bundle.features.map(f => f.id);
            addToCart(featureIds);
        } else {
            const featureIds = bundle.features.map(f => f.id);
            featureIds.forEach(id => {
                const cartItem = cartData?.data?.items?.find((item: any) => item.unitId === id);
                if (cartItem) {
                    removeItem(id, cartItem.count);
                }
            });
        }

        // Clear loading state after a delay
        setTimeout(() => {
            setBundleLoadingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(bundleId);
                return newSet;
            });
        }, 2000);
    }, [chadcoCustomerId, bundles, addToCart, removeItem, cartData]);

    // Search and filter handlers
    const handleSearch = useCallback((searchTerm: string) => {
        dispatch(setFilters({ ...filters, keyword: searchTerm }));
        dispatch(setCurrentPage(1));
    }, [dispatch, filters]);

    const handleFilterChange = useCallback((newFilters: Partial<SingleFeaturesFilters>) => {
        dispatch(setFilters({ ...filters, ...newFilters }));
        dispatch(setCurrentPage(1));
    }, [dispatch, filters]);

    // Debounced search
    const debouncedSearch = useMemo(
        () => debounce(handleSearch, 300),
        [handleSearch]
    );

    // Formik for search form
    const searchForm = useFormik({
        initialValues: { keyword: filters.keyword || '' },
        onSubmit: (values) => {
            handleSearch(values.keyword);
        },
    });

    // Infinite scroll
    const hasMore = currentPage < totalPages;
    const { loadMoreRef, isLoadingMore } = useInfiniteScroll({
        hasMore,
        isLoading: loading,
        onLoadMore: () => {
            if (hasMore && !loading) {
                dispatch(loadMoreSingleFeatures({
                    page: currentPage + 1,
                    limit: limitForSingleFeatures,
                    filters
                }));
            }
        },
    });

    // Simple text highlighting function
    const highlightText = useCallback((text: string, searchTerm: string) => {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }, []);

    // Load initial data
    useEffect(() => {
        if (chadcoCustomerId) {
            dispatch(fetchSingleFeatures({ page: 1, limit: limitForSingleFeatures }));
        }
    }, [dispatch, chadcoCustomerId]);

    // Handle search params
    useEffect(() => {
        const search = searchParams.get('search');
        if (search) {
            dispatch(setFilters({ ...filters, keyword: search }));
            searchForm.setFieldValue('keyword', search);
        }
    }, [searchParams, dispatch, filters, searchForm]);

    // Get features from items (rawData contains the PackageUnit)
    const features = useMemo(() => {
        return items.map(item => item.rawData).filter(Boolean);
    }, [items]);

    // Convert PackageUnit to SingleFeatureUnit format
    const convertToSingleFeatureUnit = useCallback((unit: PackageUnit) => {
        return {
            ...unit,
            category: {
                id: unit.packageCategories?.[0]?.id || 1,
                name: unit.packageCategories?.[0]?.name || 'عمومی'
            },
            packageUnitLabel: unit.packageUnitLabel ? {
                id: 1,
                name: unit.packageUnitLabel
            } : null
        };
    }, []);

    // Render functions
    const renderSingleFeature = useCallback((unit: PackageUnit) => (
        <SingleFeatureCard
            key={unit.id}
            unit={convertToSingleFeatureUnit(unit)}
            onAddToCart={(unitId) => handleAddToCart([unitId])}
            onRemoveFromCart={handleRemoveFromCart}
            showCartActions={true}
            isChecked={isItemChecked(unit.id)}
            onCheckChange={handleCheckItem}
            cartLoading={loadingItems.has(unit.id)}
            isSelectable={!isItemInCart(unit.id)}
        />
    ), [convertToSingleFeatureUnit, handleAddToCart, handleRemoveFromCart, isItemChecked, handleCheckItem, loadingItems, isItemInCart]);

    const renderBundle = useCallback((bundle: any) => (
        <BundleCard
            key={bundle.id}
            bundle={bundle}
            onAddToCart={() => handleBundleAction(bundle.id, 'add')}
            onRemoveFromCart={() => handleBundleAction(bundle.id, 'remove')}
            isInCart={isBundleInCart(bundle.id)}
            cartLoading={loadingItems.has(bundle.id)}
            bundleLoading={bundleLoadingItems.has(bundle.id)}
            convertToSingleFeatureUnit={convertToSingleFeatureUnit}
        />
    ), [handleBundleAction, isBundleInCart, loadingItems, bundleLoadingItems, convertToSingleFeatureUnit]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        فیچرهای تکی
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {total} فیچر موجود است
                    </p>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <AutocompleteInput
                            placeholder="جستجو در فیچرها..."
                            value={searchForm.values.keyword}
                            onChange={(value) => {
                                searchForm.setFieldValue('keyword', value);
                                debouncedSearch(value);
                            }}
                            onSelect={(item) => {
                                searchForm.setFieldValue('keyword', item.name);
                                debouncedSearch(item.name);
                            }}
                            data={features}
                            filterFn={(unit, query) => {
                                const lowerQuery = query.toLowerCase();
                                return (
                                    unit.name.toLowerCase().includes(lowerQuery) ||
                                    unit.description?.toLowerCase().includes(lowerQuery) ||
                                    unit.packageCategories?.some((cat: any) =>
                                        cat.name.toLowerCase().includes(lowerQuery)
                                    ) || false
                                );
                            }}
                            displayFn={(unit) => {
                                const category = unit.packageCategories?.[0]?.name || 'عمومی';
                                return `${unit.name} (${category})`;
                            }}
                        />
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {features.map(renderSingleFeature)}
                    {bundles.map(renderBundle)}
                </div>

                {/* Infinite Scroll Trigger */}
                {hasMore && (
                    <div ref={loadMoreRef} className="flex justify-center py-8">
                        {isLoadingMore ? (
                            <div className="flex flex-col items-center gap-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="text-sm text-gray-500">در حال بارگذاری...</span>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-400">
                                اسکرول کنید تا بیشتر ببینید
                            </div>
                        )}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="mt-8 text-center">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-600">{error}</p>
                            <Button
                                onClick={() => dispatch(clearError())}
                                variant="outline"
                                className="mt-2"
                            >
                                تلاش مجدد
                            </Button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && features.length === 0 && bundles.length === 0 && (
                    <div className="mt-8 text-center">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                            <p className="text-gray-600">هیچ فیچری یافت نشد</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
