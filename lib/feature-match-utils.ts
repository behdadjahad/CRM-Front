/**
 * Utility functions for matching feature codes in package units
 */

import { AccessesJson } from "@/types/packages";

/**
 * Interface for feature details
 */
export interface FeatureDetail {
    code: string;
    name: string;
    description?: string;
    pageTitle: string;
    pageCode: string;
}

/**
 * Check if a package unit contains a feature with the given code
 * @param accessesJson - The accessesJson object from the package unit
 * @param featureCode - The feature code to search for
 * @returns true if the unit contains a feature with the matching code
 */
export function hasFeatureCode(accessesJson: AccessesJson | any, featureCode: string): boolean {
    if (!accessesJson || !featureCode) return false;

    // Check if accessesJson has pages
    const pages = accessesJson?.pages;
    if (!pages || !Array.isArray(pages)) return false;

    // Search through all pages and their features
    for (const page of pages) {
        const features = page?.features;
        if (features && Array.isArray(features)) {
            const hasMatch = features.some((feature: any) => feature?.code === featureCode);
            if (hasMatch) return true;
        }
    }

    return false;
}

/**
 * Get all feature codes from a package unit
 * @param accessesJson - The accessesJson object from the package unit
 * @returns Array of feature codes
 */
export function getAllFeatureCodes(accessesJson: AccessesJson | any): string[] {
    if (!accessesJson) return [];

    const pages = accessesJson?.pages;
    if (!pages || !Array.isArray(pages)) return [];

    const codes: string[] = [];

    for (const page of pages) {
        const features = page?.features;
        if (features && Array.isArray(features)) {
            features.forEach((feature: any) => {
                if (feature?.code) {
                    codes.push(feature.code);
                }
            });
        }
    }

    return codes;
}

/**
 * Get all features with details from a package unit
 * @param accessesJson - The accessesJson object from the package unit
 * @returns Array of feature details with page context
 */
export function getAllFeaturesWithDetails(accessesJson: AccessesJson | any): FeatureDetail[] {
    if (!accessesJson) return [];

    const pages = accessesJson?.pages;
    if (!pages || !Array.isArray(pages)) return [];

    const features: FeatureDetail[] = [];

    for (const page of pages) {
        const pageFeatures = page?.features;
        if (pageFeatures && Array.isArray(pageFeatures)) {
            pageFeatures.forEach((feature: any) => {
                if (feature?.code) {
                    features.push({
                        code: feature.code,
                        name: feature.name || feature.code,
                        description: feature.description,
                        pageTitle: page.title || page.code,
                        pageCode: page.code
                    });
                }
            });
        }
    }

    return features;
}

/**
 * Get the matched feature details for a given code
 * @param accessesJson - The accessesJson object from the package unit
 * @param featureCode - The feature code to search for
 * @returns The matched feature detail or null
 */
export function getMatchedFeature(accessesJson: AccessesJson | any, featureCode: string): FeatureDetail | null {
    if (!accessesJson || !featureCode) return null;

    const pages = accessesJson?.pages;
    if (!pages || !Array.isArray(pages)) return null;

    for (const page of pages) {
        const features = page?.features;
        if (features && Array.isArray(features)) {
            const matchedFeature = features.find((feature: any) => feature?.code === featureCode);
            if (matchedFeature) {
                return {
                    code: matchedFeature.code,
                    name: matchedFeature.name || matchedFeature.code,
                    description: matchedFeature.description,
                    pageTitle: page.title || page.code,
                    pageCode: page.code
                };
            }
        }
    }

    return null;
}

/**
 * Get feature codes as a comma-separated string
 * @param accessesJson - The accessesJson object from the package unit
 * @returns Comma-separated string of feature codes
 */
export function getFeatureCodesString(accessesJson: AccessesJson | any): string {
    const codes = getAllFeatureCodes(accessesJson);
    return codes.join(', ');
}

/**
 * Count total features in a package unit
 * @param accessesJson - The accessesJson object from the package unit
 * @returns Number of features
 */
export function countFeatures(accessesJson: AccessesJson | any): number {
    return getAllFeatureCodes(accessesJson).length;
}

