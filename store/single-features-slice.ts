import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchService } from "@/boot/fetch-service";
import {
    formatPrice,
    limitForSingleFeatures
} from "@/lib/utils";
import { convertDate } from "@/lib/date";
import {
    PackageUnit,
    SingleFeaturesFilters,
    SingleFeaturesApiResponse
} from "@/types/single-features-api";

export interface SingleFeaturesState {
    items: any[];
    currentPage: number;
    totalPages: number;
    filters: SingleFeaturesFilters;
    checkedItems: any[];
    total: number;
    allItems: any[];
    loading: boolean;
    error: string | null;
    dateTimeRange: {
        start: string;
        end: string;
    };
}

const initialState: SingleFeaturesState = {
    items: [],
    currentPage: 1,
    totalPages: 0,
    filters: {},
    checkedItems: [],
    total: 0,
    allItems: [],
    loading: false,
    error: null,
    dateTimeRange: {
        start: "",
        end: "",
    },
};

// Async thunk for fetching paginated single features
export const fetchSingleFeatures = createAsyncThunk<any, any>(
    "singleFeatures/fetchSingleFeatures",
    async ({ page, limit, filters }) => {
        try {
            const result = await fetchService(
                `package-unit?page=${page}&limit=${limit}`,
                {
                    method: "POST",
                    body: filters,
                }
            );
            return result;
        } catch {
            return {};
        }
    }
);

// Async thunk for fetching all single features (for export)
export const fetchAllSingleFeatures = createAsyncThunk<any, any>(
    "singleFeatures/fetchAllSingleFeatures",
    async ({ page, limit, filters }) => {
        try {
            const result = await fetchService(
                `package-unit?page=${page}&limit=${limit}`,
                {
                    method: "POST",
                    body: filters,
                }
            );
            return result;
        } catch {
            return {};
        }
    }
);

const singleFeaturesSlice = createSlice({
    name: "singleFeatures",
    initialState,
    reducers: {
        setCheckedItems(state, action) {
            state.checkedItems = action.payload;
        },
        setFilters(state, action) {
            state.filters = action.payload;
            state.currentPage = 1; // Reset to first page when filters change
        },
        setCurrentPage(state, action) {
            state.currentPage = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
        resetState(state) {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        // Handle fetchSingleFeatures
        builder
            .addCase(fetchSingleFeatures.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSingleFeatures.fulfilled, (state, action) => {
                state.loading = false;
                const response = action.payload;

                // Transform data for UI display
                state.items = response.data?.map((item: PackageUnit, index: number) => ({
                    id: item.id,
                    info: {
                        "نام ویژگی": item.name,
                        "توضیحات": item.description || "بدون توضیحات",
                        "قیمت": `${formatPrice(item.price)} ${item.currency?.name || 'تومان'}`,
                        "مدل واحد": getUnitModelLabel(item.unitModel),
                        "دسته‌بندی": item.packageCategories?.[0]?.name || "عمومی",
                        "وضعیت": item.deletedAt ? "غیرفعال" : "فعال",
                    },
                    subInfo: {
                        "مدت زمان فعال": item.enabledDurationInDays ? `${item.enabledDurationInDays} روز` : "نامحدود",
                        "مدت زمان نمایش": item.showDurationInDays ? `${item.showDurationInDays} روز` : "نامحدود",
                        "تعداد واحد": item.countUnit || "نامحدود",
                        "تاریخ ایجاد": convertDate(item.createdAt, "persian"),
                        "آخرین بروزرسانی": convertDate(item.updatedAt, "persian"),
                        "شناسه ارز": item.currencyId.toString(),
                    },
                    exportData: {
                        id: item.id,
                        ردیف: index + 1,
                        "نام ویژگی": item.name,
                        "توضیحات": item.description || "بدون توضیحات",
                        "قیمت": item.price,
                        "واحد ارز": item.currency?.name || 'تومان',
                        "مدل واحد": item.unitModel,
                        "مدل واحد (فارسی)": getUnitModelLabel(item.unitModel),
                        "دسته‌بندی": item.packageCategories?.[0]?.name || "عمومی",
                        "مدت زمان فعال (روز)": item.enabledDurationInDays,
                        "مدت زمان نمایش (روز)": item.showDurationInDays,
                        "تعداد واحد": item.countUnit,
                        "تاریخ ایجاد": item.createdAt,
                        "آخرین بروزرسانی": item.updatedAt,
                        "وضعیت": item.deletedAt ? "غیرفعال" : "فعال",
                        "شناسه ارز": item.currencyId,
                    },
                    rawData: item, // Keep original data for component usage
                })) || [];

                // Handle pagination
                const totalItems = response?.pagination?.total || response.total || response.data?.length || 0;
                state.totalPages = Math.ceil(totalItems / limitForSingleFeatures);
                state.total = totalItems;
                state.currentPage = action.meta.arg.page;
                state.filters = action.meta.arg.filters;
            })
            .addCase(fetchSingleFeatures.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "خطا در بارگذاری داده‌ها";
                state.items = [];
            });

        // Handle fetchAllSingleFeatures (for export)
        builder
            .addCase(fetchAllSingleFeatures.pending, (state) => {
                // Don't set loading for export operation to avoid UI interference
            })
            .addCase(fetchAllSingleFeatures.fulfilled, (state, action) => {
                const response = action.payload;

                // Transform all data for export
                state.allItems = response.data?.map((item: PackageUnit, index: number) => ({
                    id: item.id,
                    ردیف: index + 1,
                    "نام ویژگی": item.name,
                    "توضیحات": item.description || "بدون توضیحات",
                    "قیمت": item.price,
                    "واحد ارز": item.currency?.name || 'تومان',
                    "قیمت فرمت شده": `${formatPrice(item.price)} ${item.currency?.name || 'تومان'}`,
                    "مدل واحد": item.unitModel,
                    "مدل واحد (فارسی)": getUnitModelLabel(item.unitModel),
                    "دسته‌بندی": item.packageCategories?.[0]?.name || "عمومی",
                    "نوع واحد": item.unitType || "نامشخص",
                    "مدت زمان فعال (روز)": item.enabledDurationInDays || 0,
                    "مدت زمان نمایش (روز)": item.showDurationInDays || 0,
                    "تعداد واحد": item.countUnit || 0,
                    "تاریخ ایجاد": convertDate(item.createdAt, "persian"),
                    "آخرین بروزرسانی": convertDate(item.updatedAt, "persian"),
                    "وضعیت": item.deletedAt ? "غیرفعال" : "فعال",
                    "شناسه ارز": item.currencyId,
                    "تعداد دسته‌بندی‌ها": item.packageCategories?.length || 0,
                    "تعداد مجوزها": item.permissions?.length || 0,
                })) || [];
            })
            .addCase(fetchAllSingleFeatures.rejected, (state, action) => {
                state.error = action.error.message || "خطا در بارگذاری داده‌های صادرات";
            });
    },
});

// Helper function for unit model labels
function getUnitModelLabel(unitModel: string): string {
    switch (unitModel) {
        case "flat":
            return "ثابت";
        case "perCount":
            return "بر اساس تعداد";
        case "perDuration":
            return "بر اساس مدت زمان";
        default:
            return "نامشخص";
    }
}

export const {
    setCheckedItems,
    setFilters,
    setCurrentPage,
    clearError,
    resetState
} = singleFeaturesSlice.actions;

export default singleFeaturesSlice.reducer;
