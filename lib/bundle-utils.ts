import { BundleGroup, PackageUnit, CartBundleItem } from "@/types/single-features-api";

/**
 * Organizes features into bundles and returns both bundles and all features
 * Features appear in BOTH bundles AND the main feature list
 */
export const organizeFeaturesWithBundles = (features: PackageUnit[]) => {
    const bundleMap = new Map<number, BundleGroup>();

    // Single pass through features to organize into bundles
    features.forEach(feature => {
        // Check if feature has PackageBundle (note: API returns PackageBundle, not packageBundles)
        feature.PackageBundle?.forEach((bundle: any) => {
            if (!bundleMap.has(bundle.id)) {
                bundleMap.set(bundle.id, {
                    id: bundle.id,
                    name: bundle.name,
                    features: [],
                    totalPrice: 0,
                    currency: feature.currency
                });
            }

            const group = bundleMap.get(bundle.id)!;
            group.features.push(feature);
            group.totalPrice += feature.price;
        });
    });

    return {
        bundles: Array.from(bundleMap.values()),
        allFeatures: features // Keep original list intact - all features including bundled ones
    };
};

/**
 * Creates a cart bundle item from a bundle group
 */
export const createCartBundleItem = (bundle: BundleGroup): CartBundleItem => {
    return {
        id: bundle.id,
        bundleId: bundle.id,
        bundleName: bundle.name,
        features: bundle.features,
        totalPrice: bundle.totalPrice,
        currency: bundle.currency || {
            id: 1,
            name: 'تومان',
            description: 'تومان ایران'
        }
    };
};

/**
 * Checks if a feature belongs to any bundle
 */
export const isFeatureInBundle = (feature: PackageUnit): boolean => {
    return !!(feature.PackageBundle && feature.PackageBundle.length > 0);
};

/**
 * Gets all bundle IDs that a feature belongs to
 */
export const getFeatureBundleIds = (feature: PackageUnit): number[] => {
    return feature.PackageBundle?.map((bundle: any) => bundle.id) || [];
};