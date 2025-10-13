"use client";
import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { addToCart as addToCartApi, getCartItems, removeFromCart as removeFromCartApi } from '@/api/cart';
import { CartApiResponse, CartItem } from '@/types/cart';
import toast from 'react-hot-toast';

import FilterContainer from "@/components/section/filter-container";
import FormMaker, { OptionType } from "@/components/shared/form-maker";
import SingleFeatureCard from "./single-feature-card";
import BundleCard from "./bundle-card";
import { Button } from "@/components/ui/button";
import { RootState, AppDispatch } from "@/store";
import { CustomToast } from "@/components/shared/custome-toast";
import { convertDaysToMonths } from "@/lib/duration-utils";
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
import { useHighlightSearch } from "@/hooks/useHighlightSearch";
import { useSearchParams } from "next/navigation";

interface SingleFeaturesContainerInterface {
    onPurchase?: (unitId: number, description: string) => void;

}

export default function SingleFeaturesContainer({
    onPurchase,

}: SingleFeaturesContainerInterface) {
    const searchParams = useSearchParams()
    const highlightCode = searchParams.get('highlightCode')
    const dispatch = useDispatch<AppDispatch>();
    const [sortBy, setSortBy] = useState<string>("name");
    const [actualSearchTerm, setActualSearchTerm] = useState("");
    const [pageSize, setPageSize] = useState(limitForSingleFeatures); // Items per page
    const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set()); // Track loading per item
    const [bundleLoadingItems, setBundleLoadingItems] = useState<Set<number>>(new Set()); // Track loading per bundle
    const queryClient = useQueryClient();

    // Get state from Redux store
    const {
        items,
        allItems,
        currentPage,
        totalPages,
        total,
        loading,
        error,
        checkedItems,
        filters,
        bundles,
    } = useSelector((state: RootState) => state.singleFeatures);

    const chadcoCustomerId = useSelector(
        (state: RootState) => state?.login?.chadcoCustomerId
    );
    //   const queryClient = useQueryClient();
    //   const { data: categoryData } = useQuery({
    //     queryKey: ["categoryData"],
    //     queryFn: async () => await getPackageCategory(),
    //   });
    // Fetch cart data using React Query
    const {
        data: cartData,
    } = useQuery<CartApiResponse | null>({
        queryKey: ['cart', chadcoCustomerId],
        queryFn: async () => {
            if (!chadcoCustomerId) return null;
            return await getCartItems(chadcoCustomerId);
        },
        enabled: !!chadcoCustomerId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const cartItems = cartData?.data?.packageUnits || [];
    console.log("cartItems", cartItems);

    // Helper function to check if item is in cart
    const isItemInCart = (itemId: number): boolean => {
        if (!Array.isArray(cartItems)) {
            return false;
        }
        return cartItems.some((item: CartItem) => item.id === itemId);
    };

    // Helper function to check if bundle is in cart
    const isBundleInCart = (bundleId: number): boolean => {
        if (!Array.isArray(cartItems)) {
            return false;
        }
        return cartItems.some((item: CartItem) => item.bundleId === bundleId);
    };

    // Add to cart mutation
    const addToCartMutation = useMutation({
        mutationFn: async ({ packageUnitIds, chadcoCustomerId, requestMessage }: { packageUnitIds: number[], chadcoCustomerId: number, requestMessage?: string }) => {
            return await addToCartApi(packageUnitIds, chadcoCustomerId, requestMessage);
        },
        onMutate: async ({ packageUnitIds }) => {
            // Set loading state for these items
            setLoadingItems(prev => new Set([...Array.from(prev), ...packageUnitIds]));

            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['cart', chadcoCustomerId] });

            // Snapshot the previous value
            const previousCart = queryClient.getQueryData(['cart', chadcoCustomerId]);

            // Optimistically update to the new value
            queryClient.setQueryData<CartApiResponse>(['cart', chadcoCustomerId], (old) => {
                if (!old?.data?.packageUnits) return old;

                // Find the items being added from the current items list
                const itemsToAdd = items.filter(item => packageUnitIds.includes(item.id));

                // Recalculate totals
                const newItems = [...old.data.packageUnits, ...itemsToAdd];
                const newOriginalTotal = newItems.reduce((sum, item) => sum + item.price, 0);

                return {
                    ...old,
                    data: {
                        ...old.data,
                        packageUnits: newItems,
                        originalTotal: newOriginalTotal,
                        finalTotal: newOriginalTotal - old.data.discountAmount + old.data.taxAmount,
                    }
                };
            });

            // Return a context object with the snapshotted value
            return { previousCart, packageUnitIds };
        },
        onError: (err: any, variables, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousCart) {
                queryClient.setQueryData(['cart', chadcoCustomerId], context.previousCart);
            }
            // Remove loading state for these items
            if (context?.packageUnitIds) {
                setLoadingItems(prev => {
                    const newSet = new Set(prev);
                    context.packageUnitIds.forEach((id: number) => newSet.delete(id));
                    return newSet;
                });

                // Clear bundle loading state if this was a bundle operation
                const bundleIds = bundles.filter(bundle =>
                    bundle.features.some(f => context.packageUnitIds.includes(f.id))
                ).map(bundle => bundle.id);

                if (bundleIds.length > 0) {
                    setBundleLoadingItems(prev => {
                        const newSet = new Set(prev);
                        bundleIds.forEach(id => newSet.delete(id));
                        return newSet;
                    });
                }
            }
            const errorMessage = err?.message || 'خطا در افزودن به سبد خرید';
            toast.error(errorMessage);
        },
        onSuccess: (data, variables) => {
            // Remove loading state for these items
            setLoadingItems(prev => {
                const newSet = new Set(prev);
                variables.packageUnitIds.forEach(id => newSet.delete(id));
                return newSet;
            });

            // Clear bundle loading state if this was a bundle operation
            const bundleIds = bundles.filter(bundle =>
                bundle.features.some(f => variables.packageUnitIds.includes(f.id))
            ).map(bundle => bundle.id);

            if (bundleIds.length > 0) {
                setBundleLoadingItems(prev => {
                    const newSet = new Set(prev);
                    bundleIds.forEach(id => newSet.delete(id));
                    return newSet;
                });
            }

            toast.success('آیتم با موفقیت به سبد خرید اضافه شد');

            // Clear selected items that were just added to cart
            const remainingSelected = checkedItems.filter(id => !variables.packageUnitIds.includes(id));
            dispatch(setCheckedItems(remainingSelected));
        },
        onSettled: () => {
            // Always refetch after error or success to ensure server state
            queryClient.invalidateQueries({ queryKey: ['cart', chadcoCustomerId] });
        },
    });

    // Remove from cart mutation
    const removeFromCartMutation = useMutation({
        mutationFn: async ({ packageUnitIds, chadcoCustomerId }: { packageUnitIds: number[], chadcoCustomerId: number }) => {
            return await removeFromCartApi(packageUnitIds, chadcoCustomerId);
        },
        onMutate: async ({ packageUnitIds }) => {
            // Set loading state for these items
            setLoadingItems(prev => new Set([...Array.from(prev), ...packageUnitIds]));

            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['cart', chadcoCustomerId] });

            // Snapshot the previous value
            const previousCart = queryClient.getQueryData(['cart', chadcoCustomerId]);

            // Optimistically update to the new value
            queryClient.setQueryData<CartApiResponse>(['cart', chadcoCustomerId], (old) => {
                if (!old?.data?.packageUnits) return old;

                const updatedItems = old.data.packageUnits.filter((item: CartItem) =>
                    !packageUnitIds.includes(item.id)
                );

                // Recalculate totals
                const newOriginalTotal = updatedItems.reduce((sum, item) => sum + item.price, 0);

                return {
                    ...old,
                    data: {
                        ...old.data,
                        packageUnits: updatedItems,
                        originalTotal: newOriginalTotal,
                        finalTotal: newOriginalTotal - old.data.discountAmount + old.data.taxAmount,
                    }
                };
            });

            return { previousCart, packageUnitIds };
        },
        onError: (err: any, variables, context) => {
            // If the mutation fails, roll back
            if (context?.previousCart) {
                queryClient.setQueryData(['cart', chadcoCustomerId], context.previousCart);
            }
            // Remove loading state for these items
            if (context?.packageUnitIds) {
                setLoadingItems(prev => {
                    const newSet = new Set(prev);
                    context.packageUnitIds.forEach((id: number) => newSet.delete(id));
                    return newSet;
                });
            }
            const errorMessage = err?.message || 'خطا در حذف از سبد خرید';
            toast.error(errorMessage);
        },
        onSuccess: (data, variables) => {
            // Remove loading state for these items
            setLoadingItems(prev => {
                const newSet = new Set(prev);
                variables.packageUnitIds.forEach(id => newSet.delete(id));
                return newSet;
            });
            toast.success('آیتم از سبد خرید حذف شد');
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: ['cart', chadcoCustomerId] });
        },
    });

    // Add multi-selection handler (around line 350, after other handlers)
    const handleAddSelectedToCart = () => {
        if (chadcoCustomerId) {
            addToCartMutation.mutate({
                packageUnitIds: checkedItems,
                chadcoCustomerId: chadcoCustomerId,
                requestMessage: `Bulk request for ${checkedItems.length} features`
            });

            // Clear selected items after adding to cart
            dispatch(setCheckedItems([]));
        }
    };

    // Search form using formik (consistent pattern)
    const searchFormik = useFormik({
        initialValues: {
            searchTerm: "",
        },
        onSubmit: () => { },
    });

    // Filter form using formik - Updated to support multiple selections
    const filterFormik = useFormik({
        initialValues: {
            categories: [] as string[], // Changed to array for multiple selection
            priceRanges: [] as string[], // Changed to array for multiple selection
            featureTypes: [] as string[], // Changed to array for multiple selection
            customerTypes: [] as string[], // Changed to array for multiple selection
            unitModels: [] as string[], // Changed to array for multiple selection
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

    // Separate state for applied filters (what's actually being used for API calls)
    const [appliedFilters, setAppliedFilters] = useState<SingleFeaturesFilters>({});

    // Ref to track current applied filters to avoid circular dependencies
    const appliedFiltersRef = useRef<SingleFeaturesFilters>({});

    // Debounced search that triggers data fetch
    const debouncedSearch = useCallback(
        debounce((keyword: string) => {
            setActualSearchTerm(keyword);

            // Create filters with current applied filters + new search term
            const searchFilters = {
                ...appliedFiltersRef.current,
                keyword: keyword || undefined
            };

            // Clean up undefined values
            const cleanFilters = { ...searchFilters };
            Object.keys(cleanFilters).forEach(key => {
                if (cleanFilters[key as keyof SingleFeaturesFilters] === undefined || cleanFilters[key as keyof SingleFeaturesFilters] === "") {
                    delete cleanFilters[key as keyof SingleFeaturesFilters];
                }
            });

            // Update applied filters
            setAppliedFilters(searchFilters);
            appliedFiltersRef.current = searchFilters;

            // Fetch data with search term
            dispatch(fetchSingleFeatures({
                page: 1,
                limit: pageSize,
                filters: cleanFilters
            }));
            dispatch(setCurrentPage(1));
        }, 300),
        [pageSize, dispatch]
    );

    // Update ref when appliedFilters changes
    useEffect(() => {
        appliedFiltersRef.current = appliedFilters;
    }, [appliedFilters]);

    useEffect(() => {
        debouncedSearch(searchFormik.values.searchTerm);
        return () => debouncedSearch.cancel();
    }, [searchFormik.values.searchTerm, debouncedSearch]);

    // Function to transform form values to API filters
    const transformFormToFilters = useCallback((formValues: typeof filterFormik.values): SingleFeaturesFilters => {
        return {
            keyword: actualSearchTerm,
            categories: formValues.categories.length > 0 ? formValues.categories : undefined,
            unitModels: formValues.unitModels.length > 0 ? formValues.unitModels : undefined,
            featureTypes: formValues.featureTypes.length > 0 ? formValues.featureTypes : undefined,
            // Map price ranges to minPrice/maxPrice
            minPrice: formValues.priceRanges.length > 0 ?
                Math.min(...formValues.priceRanges.map(range => {
                    if (range === "free") return 0;
                    if (range === "0-50") return 0;
                    if (range === "50-200") return 50000;
                    if (range === "200+") return 200000;
                    return 0;
                })) : undefined,
            maxPrice: formValues.priceRanges.length > 0 ?
                Math.max(...formValues.priceRanges.map(range => {
                    if (range === "free") return 0;
                    if (range === "0-50") return 50000;
                    if (range === "50-200") return 200000;
                    if (range === "200+") return 1000000; // Set a high upper limit
                    return 1000000;
                })) : undefined,
            calendarOptions: formValues.calendarOptions.length > 0 ? formValues.calendarOptions : undefined,
            panelSettings: formValues.panelSettings.length > 0 ? formValues.panelSettings : undefined,
        };
    }, [actualSearchTerm]);


    useEffect(() => {
        const cleanFilters = { ...appliedFilters };
        Object.keys(cleanFilters).forEach(key => {
            if (cleanFilters[key as keyof SingleFeaturesFilters] === undefined || cleanFilters[key as keyof SingleFeaturesFilters] === "") {
                delete cleanFilters[key as keyof SingleFeaturesFilters];
            }
        });

        dispatch(fetchSingleFeatures({
            page: currentPage,
            limit: pageSize,
            filters: cleanFilters
        }));
    }, [dispatch]);

    // Get raw package units from Redux items for filtering options
    const packageUnits = useMemo(() => {
        return items.map(item => item.rawData).filter(Boolean);
    }, [items]);

    // Extract unique categories for filtering
    const categories = useMemo(() => {
        const uniqueCategories = Array.from(
            new Set(packageUnits.flatMap(unit =>
                unit.packageCategories?.map((cat: any) => cat.name) || []
            ).filter(Boolean))
        );
        return uniqueCategories.sort();
    }, [packageUnits]);


    // Filter options
    const priceRanges = [
        { value: "all", label: "همه قیمت‌ها" },
        { value: "free", label: "رایگان" },
        { value: "0-50", label: "کمتر از ۵۰ هزار تومان" },
        { value: "50-200", label: "۵۰ تا ۲۰۰ هزار تومان" },
        { value: "200+", label: "بیشتر از ۲۰۰ هزار تومان" },
    ];

    const unitModelOptions = [
        { value: "all", label: "همه مدل‌ها" },
        { value: "flat", label: "بدون محدودیت" },
        { value: "perCount", label: "بر اساس تعداد" },
        { value: "perDuration", label: "بر اساس مدت" },
    ];

    const featureTypes = [
        { value: "sale", label: "فروش" },
        { value: "rent", label: "اجاره" },

    ];

    // Sort options
    const sortOptions = [
        { value: "name", label: "نام" },
        { value: "price-low", label: "قیمت (کم به زیاد)" },
        { value: "price-high", label: "قیمت (زیاد به کم)" },
        { value: "newest", label: "جدیدترین" },
    ];

    // Local filtering and sorting (since API filtering might be limited)
    // Data is already filtered and paginated from Redux store
    const displayUnits = useMemo(() => {
        return packageUnits; // packageUnits comes from Redux and is already filtered
    }, [packageUnits]);

    console.log("displayUnits", displayUnits);

    // Callback to load next page (used by both hooks)
    const loadNextPage = useCallback(async () => {
        const cleanFilters = { ...appliedFilters };
        Object.keys(cleanFilters).forEach(key => {
            if (cleanFilters[key as keyof SingleFeaturesFilters] === undefined ||
                cleanFilters[key as keyof SingleFeaturesFilters] === "") {
                delete cleanFilters[key as keyof SingleFeaturesFilters];
            }
        });

        await dispatch(loadMoreSingleFeatures({
            page: currentPage + 1,
            limit: pageSize,
            filters: cleanFilters
        })).unwrap();
    }, [currentPage, pageSize, appliedFilters, dispatch]);

    // Use highlight search hook for auto-loading until highlighted item is found
    const { isSearching: isSearchingHighlight, resetSearch } = useHighlightSearch({
        items: displayUnits,
        highlightCode: highlightCode! || "",
        currentPage,
        totalPages,
        isLoading: loading,
        checkMatch: (unit, code) => hasFeatureCode(unit.accessesJson, code),
        onLoadNextPage: loadNextPage,
    });

    // Use infinite scroll hook for manual scrolling
    const { loadMoreRef, isLoadingMore } = useInfiniteScroll({
        hasMore: currentPage < totalPages,
        isLoading: loading,
        onLoadMore: loadNextPage,
        disabled: isSearchingHighlight, // Disable manual scroll while searching for highlight
    });

    // Filter items for FilterContainer - Updated for multiple selection
    const filterItems = [
        {
            title: "نوع",
            component: (
                <FormMaker
                    form={filterFormik}
                    fields={[
                        {
                            key: "featureTypes",
                            component: "checkbox",
                            type: "text",
                            className: "flex flex-col items-start",
                            options: featureTypes.filter(type => type.value !== "all"), // Remove "all" option for multi-select
                        },
                    ]}
                    className="w-full"
                />
            ),
        },
        {
            title: "دسته‌بندی",
            component: (
                <FormMaker
                    form={filterFormik}
                    fields={[
                        {
                            key: "categories",
                            component: "checkbox",
                            type: "text",
                            className: "flex flex-col items-start",
                            options: categories.filter(category => category).map(category => ({
                                value: category,
                                label: category
                            })),
                        },
                    ]}
                    className="w-full"
                />
            ),
        },
        {
            title: "مدل واحد",
            component: (
                <FormMaker
                    form={filterFormik}
                    fields={[
                        {
                            key: "unitModels",
                            component: "checkbox",
                            type: "text",
                            className: "flex flex-col items-start",
                            options: unitModelOptions.filter(option => option.value !== "all"), // Remove "all" option
                        },
                    ]}
                    className="w-full"
                />
            ),
        },
        {
            title: "محدوده قیمت",
            component: (
                <FormMaker
                    form={filterFormik}
                    fields={[
                        {
                            key: "priceRanges",
                            component: "checkbox",
                            type: "text",
                            className: "flex flex-col items-start",
                            options: priceRanges.filter(option => option.value !== "all"), // Remove "all" option
                        },
                    ]}
                    className="w-full"
                />
            ),
        }
    ];

    // Range items for FilterContainer (date ranges)
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

    // Sort options for FilterContainer
    const sortList: OptionType[] = sortOptions.map(option => ({
        value: option.value,
        label: option.label
    }));

    // Handle filter actions
    const handleApplyFilters = () => {
        // Transform current form values to filters and apply them
        const newFilters = transformFormToFilters(filterFormik.values);

        // Preserve the current search term from applied filters
        const finalFilters = {
            ...newFilters,
            keyword: appliedFilters.keyword || actualSearchTerm
        };

        setAppliedFilters(finalFilters);
        appliedFiltersRef.current = finalFilters;

        // Reset highlight search when filters change
        resetSearch();

        // Clean up undefined values
        const cleanFilters = { ...finalFilters };
        Object.keys(cleanFilters).forEach(key => {
            if (cleanFilters[key as keyof SingleFeaturesFilters] === undefined || cleanFilters[key as keyof SingleFeaturesFilters] === "") {
                delete cleanFilters[key as keyof SingleFeaturesFilters];
            }
        });

        // Directly dispatch with page 1 (reset to first page when applying new filters)
        dispatch(fetchSingleFeatures({
            page: 1,
            limit: pageSize,
            filters: cleanFilters
        }));
        dispatch(setCurrentPage(1));
        console.log("Filters applied:", cleanFilters);
    };

    const handleSort = (sortValue: string) => {
        setSortBy(sortValue);
    };

    const handleCancelFilter = () => {
        filterFormik.resetForm();
        setAppliedFilters({});
        appliedFiltersRef.current = {};
        setSortBy("name");
        searchFormik.resetForm();
        setActualSearchTerm("");

        // Reset highlight search when filters reset
        resetSearch();

        // Directly dispatch with empty filters (including no search term)
        dispatch(fetchSingleFeatures({
            page: 1,
            limit: pageSize,
            filters: {}
        }));
        dispatch(setCurrentPage(1));
        dispatch(setFilters({}));
    };

    // Handle bulk operations
    const handleCheckItem = (itemId: number, checked: boolean) => {
        // Don't allow selection if item is already in cart
        if (isItemInCart(itemId)) {
            return;
        }

        if (checked) {
            dispatch(setCheckedItems([...checkedItems, itemId]));
        } else {
            dispatch(setCheckedItems(checkedItems.filter(id => id !== itemId)));
        }
    };

    // Handle bundle selection
    const handleCheckBundle = (bundleId: number, checked: boolean) => {
        // Don't allow selection if bundle is already in cart
        if (isBundleInCart(bundleId)) {
            return;
        }

        if (checked) {
            dispatch(setCheckedItems([...checkedItems, `bundle-${bundleId}`]));
        } else {
            dispatch(setCheckedItems(checkedItems.filter(id => id !== `bundle-${bundleId}`)));
        }
    };

    // Check if bundle is selected
    const isBundleChecked = (bundleId: number) => {
        return checkedItems.includes(`bundle-${bundleId}`);
    };

    const handleCheckAll = (checked: boolean) => {
        if (checked) {
            // Only select items that are not in cart
            const selectableIds = items
                .filter(item => !isItemInCart(item.id))
                .map(item => item.id);
            dispatch(setCheckedItems(selectableIds));
        } else {
            dispatch(setCheckedItems([]));
        }
    };

    // Check if item is selected
    const isItemChecked = (itemId: number) => {
        return checkedItems.includes(itemId);
    };

    // Get selected items count
    const selectedCount = checkedItems.length;
    const selectableItems = items.filter(item => !isItemInCart(item.id));
    const allItemsSelected = selectableItems.length > 0 && checkedItems.length === selectableItems.length;

    // Handle unit purchase
    const handleUnitPurchase = async (unitId: number, description: string) => {
        if (onPurchase) {
            onPurchase(unitId, description);
        }
    };

    // Handle data refresh
    const handleRefresh = () => {
        dispatch(clearError());

        const cleanFilters = { ...appliedFilters };
        Object.keys(cleanFilters).forEach(key => {
            if (cleanFilters[key as keyof SingleFeaturesFilters] === undefined || cleanFilters[key as keyof SingleFeaturesFilters] === "") {
                delete cleanFilters[key as keyof SingleFeaturesFilters];
            }
        });

        dispatch(fetchSingleFeatures({
            page: currentPage,
            limit: pageSize,
            filters: cleanFilters
        }));
    };

    // Get pagination info from Redux state
    const totalItems = total;
    const hasMoreData = currentPage < totalPages;

    // Convert PackageUnit to format expected by SingleFeatureCard
    const convertToSingleFeatureUnit = (unit: PackageUnit) => {
        return {
            code: unit.accessesJson?.pages?.[0]?.code,
            id: unit.id,
            name: unit.name,
            description: unit.description || '',
            price: unit.price,
            unitType: unit.unitType || 'single',
            unitModel: unit.unitModel,
            enabledDurationInDays: unit.enabledDurationInDays,
            showDurationInDays: unit.showDurationInDays,
            countUnit: unit.countUnit,
            currencyId: unit.currencyId,
            packageUnitLabelId: 1, // Default value
            currency: {
                id: unit.currency?.id || unit.currencyId,
                name: unit.currency?.name || 'تومان',
                description: unit.currency?.description || 'تومان ایران'
            },
            category: {
                id: unit.packageCategories?.[0]?.id || 1,
                name: unit.packageCategories?.[0]?.name || 'عمومی'
            },
            createdAt: unit.createdAt,
            updatedAt: unit.updatedAt,
        };
    };

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 text-lg mb-2">
                    خطا در بارگذاری داده‌ها
                </div>
                <div className="text-gray-400 text-sm mb-4">
                    {typeof error === 'string' ? error : 'خطای نامشخص'}
                </div>
                <Button onClick={handleRefresh} variant="outline">
                    تلاش مجدد
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters and Search Section */}
            <section className="bg-card rounded-lg p-6">
                <div className="gap-4 flex flex-col">
                    <div className="flex flex-row items-center justify-between">
                        {/* Filter Container */}
                        <FilterContainer
                            onFilterHandler={handleApplyFilters}
                            rangeItems={rangeItems}
                            filterItems={filterItems}
                            sortList={sortList}
                            onSortHandler={handleSort}
                            onCancleHandler={handleCancelFilter}
                        />

                        {/* Search Input */}
                        <div>
                            <FormMaker
                                form={searchFormik}
                                fields={[
                                    {
                                        key: "searchTerm",
                                        component: "input",
                                        placeholder: "جستجو در فیچرها...",
                                        icon: "/icons/search-icon.png",
                                        iconClassName: "w-4 h-4 right-3 top-3",
                                        labelClassName: "h-8 p-0",
                                        type: "text",
                                        className: "border rounded-md p-0 w-80",
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Active Filters Tags */}
            {((appliedFilters.categories?.length ?? 0) > 0 ||
                (appliedFilters.priceRanges?.length ?? 0) > 0 ||
                (appliedFilters.unitModels?.length ?? 0) > 0 ||
                (appliedFilters.featureTypes?.length ?? 0) > 0 ||
                (appliedFilters.calendarOptions?.length ?? 0) > 0 ||
                (appliedFilters.panelSettings?.length ?? 0) > 0 ||
                appliedFilters.minPrice !== undefined ||
                appliedFilters.maxPrice !== undefined ||
                appliedFilters.keyword ||
                actualSearchTerm ||
                sortBy !== "name") && (
                    <div className="bg-gray-50 rounded-lg p-4 hidden">
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* <span className="text-sm font-medium text-gray-700">فیلترهای فعال:</span> */}

                            {/* Search Tag */}
                            {/* {(appliedFilters.keyword || actualSearchTerm) && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    جستجو: "{appliedFilters.keyword || actualSearchTerm}"
                                    <button
                                        onClick={() => {
                                            searchFormik.setFieldValue("searchTerm", "");
                                            setActualSearchTerm("");
                                            // Remove keyword from applied filters
                                            const newFilters = { ...appliedFilters };
                                            delete newFilters.keyword;
                                            setAppliedFilters(newFilters);
                                            appliedFiltersRef.current = newFilters;

                                            // Clean up undefined values
                                            const cleanFilters = { ...newFilters };
                                            Object.keys(cleanFilters).forEach(key => {
                                                if (cleanFilters[key as keyof SingleFeaturesFilters] === undefined || cleanFilters[key as keyof SingleFeaturesFilters] === "") {
                                                    delete cleanFilters[key as keyof SingleFeaturesFilters];
                                                }
                                            });

                                            // Fetch data without search term
                                            dispatch(fetchSingleFeatures({
                                                page: 1,
                                                limit: pageSize,
                                                filters: cleanFilters
                                            }));
                                            dispatch(setCurrentPage(1));
                                        }}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            )} */}


                            {/* {appliedFilters.categories?.map((category: string) => (
                                <span key={category} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    دسته‌بندی: {category}
                                    <button
                                        onClick={() => {
                                            const newCategories = appliedFilters.categories?.filter((c: string) => c !== category) || [];
                                            const updatedFilters = {
                                                ...appliedFilters,
                                                categories: newCategories
                                            };
                                            setAppliedFilters(updatedFilters);
                                            appliedFiltersRef.current = updatedFilters;
                                        }}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))} */}

                            {/* Price Range Tags - Multiple */}
                            {/* {appliedFilters.minPrice !== undefined && appliedFilters.maxPrice !== undefined && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    قیمت: {appliedFilters.minPrice} - {appliedFilters.maxPrice}
                                    <button
                                        onClick={() => {
                                            const updatedFilters = {
                                                ...appliedFilters,
                                                minPrice: undefined,
                                                maxPrice: undefined
                                            };
                                            setAppliedFilters(updatedFilters);
                                            appliedFiltersRef.current = updatedFilters;
                                        }}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            )} */}

                            {/* Unit Model Tags - Multiple */}
                            {/* {appliedFilters.unitModels?.map((unitModel: string) => (
                                <span key={unitModel} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    مدل: {unitModelOptions.find(u => u.value === unitModel)?.label}
                                    <button
                                        onClick={() => {
                                            const newUnitModels = appliedFilters.unitModels?.filter((u: string) => u !== unitModel) || [];
                                            const updatedFilters = {
                                                ...appliedFilters,
                                                unitModels: newUnitModels
                                            };
                                            setAppliedFilters(updatedFilters);
                                            appliedFiltersRef.current = updatedFilters;
                                        }}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))} */}

                            {/* Feature Type Tags - Multiple */}
                            {/* {appliedFilters.featureTypes?.map((featureType: string) => (
                                <span key={featureType} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    نوع: {featureTypes.find(f => f.value === featureType)?.label}
                                    <button
                                        onClick={() => {
                                            const newFeatureTypes = appliedFilters.featureTypes?.filter((f: string) => f !== featureType) || [];
                                            const updatedFilters = {
                                                ...appliedFilters,
                                                featureTypes: newFeatureTypes
                                            };
                                            setAppliedFilters(updatedFilters);
                                            appliedFiltersRef.current = updatedFilters;
                                        }}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))} */}

                            {/* Calendar Options Tags */}
                            {/* {appliedFilters.calendarOptions?.map((option: string) => (
                                <span key={option} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    تقویم: {option}
                                    <button
                                        onClick={() => {
                                            const newOptions = appliedFilters.calendarOptions?.filter((o: string) => o !== option) || [];
                                            const updatedFilters = {
                                                ...appliedFilters,
                                                calendarOptions: newOptions
                                            };
                                            setAppliedFilters(updatedFilters);
                                            appliedFiltersRef.current = updatedFilters;
                                        }}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))} */}

                            {/* Panel Settings Tags */}
                            {/* {appliedFilters.panelSettings?.map((setting: string) => (
                                <span key={setting} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    پنل: {setting}
                                    <button
                                        onClick={() => {
                                            const newSettings = appliedFilters.panelSettings?.filter((s: string) => s !== setting) || [];
                                            const updatedFilters = {
                                                ...appliedFilters,
                                                panelSettings: newSettings
                                            };
                                            setAppliedFilters(updatedFilters);
                                            appliedFiltersRef.current = updatedFilters;
                                        }}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))} */}

                            {/* Sort Tag */}
                            {/* {sortBy !== "name" && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                    مرتب‌سازی: {sortOptions.find(s => s.value === sortBy)?.label}
                                    <button
                                        onClick={() => setSortBy("name")}
                                        className="ml-1 text-green-600 hover:text-green-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            )} */}

                            {/* Clear All Button */}
                            {/* <button
                                onClick={handleCancelFilter}
                                                                className="text-xs text-danger hover:text-danger/80 transition-colors"
                            >
                                پاک کردن همه
                            </button> */}
                        </div>
                    </div>
                )}

            {/* Results Summary */}
            <div className="flex justify-between items-center">
                {/* Select All Checkbox */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={allItemsSelected}
                        onChange={(e) => handleCheckAll(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
                        {selectedCount > 0 ? `${selectedCount} مورد انتخاب شده` : `انتخاب همه (${selectableItems.length} مورد قابل انتخاب)`}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                        نمایش {displayUnits.length} از {totalItems} مورد
                    </span>

                    {searchFormik.values.searchTerm && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => searchFormik.setFieldValue("searchTerm", "")}
                        >
                            پاک کردن جستجو
                        </Button>
                    )}
                </div>
            </div>
            {checkedItems.length > 0 && (
                <div className="fixed top-3 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-xl shadow-2xl border-2 border-blue-500 z-50 animate-in slide-in-from-bottom-5">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">
                            {checkedItems.length} مورد انتخاب شده
                        </span>
                        <Button
                            onClick={handleAddSelectedToCart}
                            variant="info"
                            size="lg"
                            className="px-6"
                            disabled={addToCartMutation.isPending}
                        >
                            {addToCartMutation.isPending ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
                        </Button>
                        <button
                            onClick={() => dispatch(setCheckedItems([]))}
                            className="text-gray-500 hover:text-gray-700 text-sm"
                            disabled={addToCartMutation.isPending}
                        >
                            لغو انتخاب
                        </button>
                    </div>
                </div>
            )}
            {/* Bundles Section */}
            {bundles.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        باندل‌ها ({bundles.length})
                    </h2>
                    <div className="space-y-4">
                        {bundles.map((bundle) => (
                            <BundleCard
                                convertToSingleFeatureUnit={convertToSingleFeatureUnit}
                                key={bundle.id}
                                bundle={bundle}
                                isChecked={isBundleChecked(bundle.id)}
                                onCheckChange={handleCheckBundle}
                                isSelectable={!isBundleInCart(bundle.id)}
                                onAddToCart={(bundleId, bundleName) => {
                                    if (chadcoCustomerId) {
                                        // Set bundle loading state
                                        setBundleLoadingItems(prev => new Set([...Array.from(prev), bundleId]));

                                        // Add all features in bundle to cart
                                        const featureIds = bundle.features.map(f => f.id);
                                        addToCartMutation.mutate({
                                            packageUnitIds: featureIds,
                                            chadcoCustomerId: chadcoCustomerId,
                                            requestMessage: `Bundle: ${bundleName}`
                                        });
                                    }
                                }}
                                onRemoveFromCart={(bundleId) => {
                                    if (chadcoCustomerId) {
                                        // Set bundle loading state
                                        setBundleLoadingItems(prev => new Set([...Array.from(prev), bundleId]));

                                        // Remove all features in bundle from cart
                                        const featureIds = bundle.features.map(f => f.id);
                                        removeFromCartMutation.mutate({
                                            packageUnitIds: featureIds,
                                            chadcoCustomerId: chadcoCustomerId
                                        });
                                    }
                                }}
                                isInCart={isBundleInCart(bundle.id)}
                                showCartActions={true}
                                cartLoading={bundleLoadingItems.has(bundle.id)}
                                bundleLoading={bundleLoadingItems.has(bundle.id)}
                                chadcoCustomerId={chadcoCustomerId}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Features Grid */}
            <section>
                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">
                            در حال بارگذاری...
                        </div>
                    </div>
                ) : displayUnits.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayUnits.map((unit) => {
                            // Check if this unit has the highlighted feature code
                            const isHighlighted = highlightCode! ? hasFeatureCode(unit.accessesJson, highlightCode!) : false;

                            return (
                                <SingleFeatureCard
                                    key={unit.id}
                                    unit={convertToSingleFeatureUnit(unit)}
                                    chadcoCustomerId={chadcoCustomerId}
                                    onPurchase={handleUnitPurchase}
                                    isInCart={isItemInCart(unit.id)}
                                    onAddToCart={(unitId, requestMessage) => {
                                        if (chadcoCustomerId) {
                                            addToCartMutation.mutate({
                                                packageUnitIds: [unitId],
                                                chadcoCustomerId: chadcoCustomerId,
                                                requestMessage: requestMessage
                                            });
                                        }
                                    }}
                                    onRemoveFromCart={(itemId) => {
                                        if (chadcoCustomerId) {
                                            removeFromCartMutation.mutate({
                                                packageUnitIds: [parseInt(itemId)],
                                                chadcoCustomerId: chadcoCustomerId
                                            });
                                        }
                                    }}
                                    showCartActions={true}
                                    isChecked={isItemChecked(unit.id)}
                                    onCheckChange={handleCheckItem}
                                    cartLoading={loadingItems.has(unit.id)}
                                    isSelectable={!isItemInCart(unit.id)}
                                    isHighlighted={isHighlighted}
                                    highlightCode={highlightCode! || ""}
                                    accessesJson={unit.accessesJson}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg mb-2">
                            هیچ فیچری یافت نشد
                        </div>
                        <div className="text-gray-400 text-sm">
                            لطفاً فیلترهای خود را تغییر دهید یا عبارت جستجوی دیگری امتحان کنید
                        </div>
                    </div>
                )}
            </section>

            {/* Infinite Scroll Trigger & Loading Indicator */}
            {hasMoreData && (
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

            {/* End of list indicator */}
            {!hasMoreData && displayUnits.length > 0 && (
                <div className="flex justify-center py-8">
                    <div className="text-sm text-gray-400">
                        همه موارد نمایش داده شد ({totalItems} مورد)
                    </div>
                </div>
            )}
        </div>
    );
}
