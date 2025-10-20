"use client";

import React from 'react';
import BundleCard from './bundle-card';
import { BundleGroup } from '@/types/single-features-api';
import { PackageUnit } from '@/types/single-features-api';
import { SingleFeatureUnit } from '@/data/single-features-mock-data';

interface BundleSectionProps {
    bundles: BundleGroup[];
    convertToSingleFeatureUnit: (unit: PackageUnit) => SingleFeatureUnit;
    isBundleChecked: (bundleId: number) => boolean;
    onBundleCheckChange: (bundleId: number, checked: boolean) => void;
    isBundleInCart: (bundleId: number) => boolean;
    areAllBundleFeaturesInCart: (features: PackageUnit[]) => boolean;
    onAddBundleToCart: (bundleId: number, bundleName: string, features: PackageUnit[]) => void;
    onRemoveBundleFromCart: (bundleId: number, features: PackageUnit[]) => void;
    bundleLoadingItems: Set<number>;
    chadcoCustomerId?: number;
}

export const BundleSection: React.FC<BundleSectionProps> = ({
    bundles,
    convertToSingleFeatureUnit,
    isBundleChecked,
    onBundleCheckChange,
    isBundleInCart,
    areAllBundleFeaturesInCart,
    onAddBundleToCart,
    onRemoveBundleFromCart,
    bundleLoadingItems,
    chadcoCustomerId,
}) => {
    if (bundles.length === 0) return null;

    return (
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
                        onCheckChange={onBundleCheckChange}
                        isSelectable={!isBundleInCart(bundle.id)}
                        onAddToCart={(bundleId, bundleName) => {
                            onAddBundleToCart(bundleId, bundleName, bundle.features);
                        }}
                        onRemoveFromCart={(bundleId) => {
                            onRemoveBundleFromCart(bundleId, bundle.features);
                        }}
                        isInCart={areAllBundleFeaturesInCart(bundle.features)}
                        showCartActions={true}
                        cartLoading={bundleLoadingItems.has(bundle.id)}
                        bundleLoading={bundleLoadingItems.has(bundle.id)}
                        chadcoCustomerId={chadcoCustomerId}
                    />
                ))}
            </div>
        </section>
    );
};

