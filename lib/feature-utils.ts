import { Unit } from "@/types/packages";
import { getFeatureDurationText as getDurationText } from "./duration-utils";

/**
 * Get duration text based on unit model and data
 * Now uses smart duration conversion (days to months/years)
 */
export const getFeatureDurationText = (feature: Unit, useSmartDisplay: boolean = true): string => {
    return getDurationText(
        feature.unitModel,
        feature.showDurationInDays,
        feature.countUnit,
        useSmartDisplay
    );
};

/**
 * Get unit model display text in Persian
 */
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

/**
 * Get unit type display text in Persian
 */
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

/**
 * Format feature price with Persian numbers and currency
 */
export const formatFeaturePrice = (price?: number, currencyName?: string): string => {
    if (price === 0) return "رایگان";
    if (!price) return "";

    const formattedPrice = price.toLocaleString('fa-IR');
    return `${formattedPrice} ${currencyName || 'تومان'}`;
};

/**
 * Get complete feature description with all details
 */
export const getFeatureDetails = (feature: Unit) => {
    const durationText = getFeatureDurationText(feature);
    const unitModelText = getUnitModelText(feature.unitModel);
    const unitTypeText = getUnitTypeText(feature.unitType);
    const priceText = formatFeaturePrice(feature.price, feature.currency?.name);

    return {
        duration: durationText,
        unitModel: unitModelText,
        unitType: unitTypeText,
        price: priceText,
        fullDescription: [durationText, unitModelText, unitTypeText].filter(Boolean).join(' - ')
    };
};
