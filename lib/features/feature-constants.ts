/**
 * Feature-related constants
 * Centralized filter options and configurations
 */

export const PRICE_RANGES = [
    { value: "all", label: "همه قیمت‌ها" },
    { value: "free", label: "رایگان" },
    { value: "0-50", label: "کمتر از ۵۰ هزار تومان" },
    { value: "50-200", label: "۵۰ تا ۲۰۰ هزار تومان" },
    { value: "200+", label: "بیشتر از ۲۰۰ هزار تومان" },
];

export const UNIT_MODEL_OPTIONS = [
    { value: "all", label: "همه مدل‌ها" },
    { value: "flat", label: "بدون محدودیت" },
    { value: "perCount", label: "بر اساس تعداد" },
    { value: "perDuration", label: "بر اساس مدت" },
];

export const FEATURE_TYPES = [
    { value: "sale", label: "فروش" },
    { value: "rent", label: "اجاره" },
];

export const SORT_OPTIONS = [
    { value: "name", label: "نام" },
    { value: "price-low", label: "قیمت (کم به زیاد)" },
    { value: "price-high", label: "قیمت (زیاد به کم)" },
    { value: "newest", label: "جدیدترین" },
];

