/**
 * Feature transformation utilities
 * Converts API data to UI-friendly formats
 */

import { PackageUnit } from '@/types/single-features-api';
import { SingleFeatureUnit } from '@/data/single-features-mock-data';

/**
 * Convert PackageUnit to SingleFeatureUnit format expected by SingleFeatureCard
 */
export const convertToSingleFeatureUnit = (unit: PackageUnit): SingleFeatureUnit => {
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
        packageUnitLabelId: 1,
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

/**
 * Get unit model label in Persian
 */
export const getUnitModelLabel = (unitModel?: "perCount" | "perDuration" | "flat" | null): string => {
    switch (unitModel) {
        case "flat":
            return "بدون محدودیت";
        case "perCount":
            return "بر اساس تعداد";
        case "perDuration":
            return "بر اساس مدت زمان";
        default:
            return "نامشخص";
    }
};

/**
 * Extract unique categories from package units
 */
export const extractCategories = (units: PackageUnit[]): string[] => {
    const uniqueCategories = Array.from(
        new Set(units.flatMap(unit =>
            unit.packageCategories?.map((cat) => cat.name) || []
        ).filter(Boolean))
    );
    return uniqueCategories.sort();
};

/**
 * Get feature type label in Persian
 */
export const getFeatureTypeLabel = (type: string): string => {
    switch (type) {
        case 'sale':
            return 'فروش';
        case 'rent':
            return 'اجاره';
        default:
            return type;
    }
};

