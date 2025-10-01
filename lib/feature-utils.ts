import { Unit } from "@/types/packages";

   export const getDurationText = (durationUnit: string): string => {
        switch (durationUnit) {
            case 'month':
                return 'در ماه';
            case 'year':
                return 'در سال';
            case 'day':
                return 'در روز';
            default:
                return 'در ماه';
        }
    };

export const getFeatureDurationText = (feature: Unit, useSmartDisplay: boolean = true): string => {
    return getDurationText(
        feature.unitModel!,
    );
};


export const getUnitModelText = (unitModel?: "perCount" | "perDuration" | "flat" | null): string => {
    switch (unitModel) {
        case "perDuration":
            return "زمانی";
        case "perCount":
            return "تعدادی";
        case "flat":
            return "ثابت";
        default:
            return "";
    }
};


export const getUnitTypeText = (unitType?: string | null): string => {
    switch (unitType) {
        case "rent":
            return "اجاره";
        case "sale":
            return "خرید";
        default:
            return "";
    }
};


export const formatFeaturePrice = (price?: number, currencyName?: string): string => {
    if (price === 0) return "رایگان";
    if (!price) return "";

    const formattedPrice = price.toLocaleString('fa-IR');
    return `${formattedPrice} ${currencyName || 'تومان'}`;
};


