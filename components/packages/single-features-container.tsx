"use client";
import { useCart } from '@/hooks/useCart';
import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";

import FilterContainer from "@/components/section/filter-container";
import FormMaker, { OptionType } from "@/components/shared/form-maker";
import SingleFeatureCard from "./single-feature-card";
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
    setCheckedItems,
    setFilters,
    setCurrentPage,
    clearError
} from "@/store/single-features-slice";

interface SingleFeaturesContainerInterface {
    onPurchase?: (unitId: number, description: string) => void;
}

export default function SingleFeaturesContainer({
    onPurchase
}: SingleFeaturesContainerInterface) {
    const dispatch = useDispatch<AppDispatch>();
    const [sortBy, setSortBy] = useState<string>("name");
    const [actualSearchTerm, setActualSearchTerm] = useState("");
    const [pageSize, setPageSize] = useState(limitForSingleFeatures); // Items per page
    const { isItemInCart, addToCart, removeFromCart, addMultipleToCart } = useCart();
    // Add multi-selection handler (around line 350, after other handlers)
    const handleAddSelectedToCart = () => {
        // Just pass the array of selected IDs
        addMultipleToCart(checkedItems, `Bulk request for ${checkedItems.length} features`);
    };

    // Get state from Redux store
    const {
        items,
        allItems,
        currentPage,
        totalPages,
        total,
        loading,
        error,
        filters: currentFilters,
        checkedItems
    } = useSelector((state: RootState) => state.singleFeatures);

    // Get customer ID from Redux store
    const chadcoCustomerId = useSelector((state: RootState) => state?.login?.chadcoCustomerId);

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
        if (checked) {
            dispatch(setCheckedItems([...checkedItems, itemId]));
        } else {
            dispatch(setCheckedItems(checkedItems.filter(id => id !== itemId)));
        }
    };

    const handleCheckAll = (checked: boolean) => {
        if (checked) {
            const allIds = items.map(item => item.id);
            dispatch(setCheckedItems(allIds));
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
    const allItemsSelected = items.length > 0 && checkedItems.length === items.length;

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

    // Pagination handlers - following contract pattern
    const handlePageChange = (page: number) => {
        const cleanFilters = { ...appliedFilters };
        Object.keys(cleanFilters).forEach(key => {
            if (cleanFilters[key as keyof SingleFeaturesFilters] === undefined || cleanFilters[key as keyof SingleFeaturesFilters] === "") {
                delete cleanFilters[key as keyof SingleFeaturesFilters];
            }
        });

        dispatch(fetchSingleFeatures({
            page: page,
            limit: pageSize,
            filters: cleanFilters
        }));
        dispatch(setCurrentPage(page));
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);

        const cleanFilters = { ...appliedFilters };
        Object.keys(cleanFilters).forEach(key => {
            if (cleanFilters[key as keyof SingleFeaturesFilters] === undefined || cleanFilters[key as keyof SingleFeaturesFilters] === "") {
                delete cleanFilters[key as keyof SingleFeaturesFilters];
            }
        });

        dispatch(fetchSingleFeatures({
            page: 1,
            limit: size,
            filters: cleanFilters
        }));
        dispatch(setCurrentPage(1));
    };

    // Get pagination info from Redux state
    const totalItems = total;
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    // Convert PackageUnit to format expected by SingleFeatureCard
    const convertToSingleFeatureUnit = (unit: PackageUnit) => {
        return {
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
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-gray-700">فیلترهای فعال:</span>

                            {/* Search Tag */}
                            {(appliedFilters.keyword || actualSearchTerm) && (
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
                            )}

                            {/* Category Tags - Multiple */}
                            {appliedFilters.categories?.map((category: string) => (
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
                            ))}

                            {/* Price Range Tags - Multiple */}
                            {appliedFilters.minPrice !== undefined && appliedFilters.maxPrice !== undefined && (
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
                            )}

                            {/* Unit Model Tags - Multiple */}
                            {appliedFilters.unitModels?.map((unitModel: string) => (
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
                            ))}

                            {/* Feature Type Tags - Multiple */}
                            {appliedFilters.featureTypes?.map((featureType: string) => (
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
                            ))}

                            {/* Calendar Options Tags */}
                            {appliedFilters.calendarOptions?.map((option: string) => (
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
                            ))}

                            {/* Panel Settings Tags */}
                            {appliedFilters.panelSettings?.map((setting: string) => (
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
                            ))}

                            {/* Sort Tag */}
                            {sortBy !== "name" && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                    مرتب‌سازی: {sortOptions.find(s => s.value === sortBy)?.label}
                                    <button
                                        onClick={() => setSortBy("name")}
                                        className="ml-1 text-green-600 hover:text-green-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}

                            {/* Clear All Button */}
                            <button
                                onClick={handleCancelFilter}
                                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                            >
                                پاک کردن همه
                            </button>
                        </div>
                    </div>
                )}

            {/* Results Summary */}
            <div className="flex justify-between items-center">


                <div className="flex items-center gap-2">
                    {/* Page Size Selector */}
                    <select
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                        <option value={10}>10 در صفحه</option>
                        <option value={20}>20 در صفحه</option>
                        <option value={50}>50 در صفحه</option>
                        <option value={100}>100 در صفحه</option>
                    </select>

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
                <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
                    <Button
                        onClick={handleAddSelectedToCart}
                        variant="info"
                    >
                        `Add ${checkedItems.length} Selected to Cart`
                    </Button>
                </div>
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
                        {displayUnits.map((unit) => (
                            <SingleFeatureCard
                                key={unit.id}
                                unit={convertToSingleFeatureUnit(unit)}
                                chadcoCustomerId={chadcoCustomerId}
                                onPurchase={handleUnitPurchase}
                                isInCart={isItemInCart(unit.id)}
                                onAddToCart={addToCart}
                                onRemoveFromCart={removeFromCart}
                                showCartActions={true}

                            />
                        ))}
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <section className="flex justify-center items-center space-x-2 pt-8">
                    <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!hasPrevPage || loading}
                        className="mx-1"
                    >
                        قبلی
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1 mx-4">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNumber;
                            if (totalPages <= 5) {
                                pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                                pageNumber = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNumber = totalPages - 4 + i;
                            } else {
                                pageNumber = currentPage - 2 + i;
                            }

                            return (
                                <Button
                                    key={pageNumber}
                                    variant={currentPage === pageNumber ? "default" : "outline"}
                                    onClick={() => handlePageChange(pageNumber)}
                                    disabled={loading}
                                    className="w-10 h-10 p-0 mx-0.5"
                                >
                                    {pageNumber}
                                </Button>
                            );
                        })}
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!hasNextPage || loading}
                        className="mx-1"
                    >
                        بعدی
                    </Button>
                </section>
            )}
        </div>
    );
}
