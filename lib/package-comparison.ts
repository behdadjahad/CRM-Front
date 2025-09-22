import { UnitComparison, UnitVariant } from '@/types/packages';

/**
 * Find a unit variant for a specific package within a unit comparison
 * @param unitComparison - The unit comparison containing variants
 * @param packageId - The package ID to find the variant for
 * @returns The unit variant for the package, or undefined if not found
 */
export function findUnitVariant(unitComparison: UnitComparison, packageId: number): UnitVariant | undefined {
    return unitComparison.variants.find(variant => variant.packageId === packageId);
}

/**
 * Check if a package has a specific unit
 * @param unitComparison - The unit comparison containing variants
 * @param packageId - The package ID to check
 * @returns True if the package has the unit, false otherwise
 */
export function hasUnitInPackage(unitComparison: UnitComparison, packageId: number): boolean {
    return unitComparison.variants.some(variant => variant.packageId === packageId);
}

/**
 * Get all unique package IDs from a unit comparison
 * @param unitComparison - The unit comparison containing variants
 * @returns Array of unique package IDs
 */
export function getPackageIds(unitComparison: UnitComparison): number[] {
    return Array.from(new Set(unitComparison.variants.map(variant => variant.packageId)));
}

/**
 * Get unit details for display (count, duration, model)
 * @param variant - The unit variant to get details for
 * @returns Formatted string with unit details
 */
export function getUnitDetails(variant: UnitVariant): string {
    const details: string[] = [];

    if (variant.unitModel === 'perCount' && variant.countUnit) {
        details.push(`${variant.countUnit} count`);
    }

    if (variant.unitModel === 'perDuration' && variant.showDurationInDays) {
        details.push(`${variant.showDurationInDays} days`);
    }

    if (variant.unitModel === 'flat') {
        details.push('unlimited');
    }

    return details.join(', ') || 'available';
}
