/**
 * Custom hook for bundle detection and management
 * Handles bundle checking and organization
 */

import { useMemo } from 'react';
import { PackageUnit, BundleGroup } from '@/types/single-features-api';
import { CartItem, SatisfiedBundle } from '@/types/cart';

interface UseBundleDetectionProps {
    cartItems?: CartItem[];
    satisfiedBundles?: SatisfiedBundle[];
}

export const useBundleDetection = ({
    cartItems = [],
    satisfiedBundles = []
}: UseBundleDetectionProps) => {
    /**
     * Check if a specific item is in the cart
     */
    const isItemInCart = useMemo(() => {
        return (itemId: number): boolean => {
            if (!Array.isArray(cartItems)) {
                return false;
            }
            return cartItems.some((item: CartItem) => item.id === itemId);
        };
    }, [cartItems]);

    /**
     * Check if a bundle is satisfied/in cart
     */
    const isBundleInCart = useMemo(() => {
        return (bundleId: number): boolean => {
            if (!satisfiedBundles) {
                return false;
            }
            return satisfiedBundles.some(bundle => bundle.id === bundleId);
        };
    }, [satisfiedBundles]);

    /**
     * Check if all features of a bundle are in cart
     */
    const areAllBundleFeaturesInCart = useMemo(() => {
        return (bundleFeatures: PackageUnit[]): boolean => {
            if (!Array.isArray(cartItems)) {
                return false;
            }
            const featureIds = bundleFeatures.map(f => f.id);
            return featureIds.every(featureId =>
                cartItems.some((item: CartItem) => item.id === featureId)
            );
        };
    }, [cartItems]);

    /**
     * Get bundle information for a cart item
     */
    const getItemBundleInfo = useMemo(() => {
        return (itemId: number): SatisfiedBundle | null => {
            return satisfiedBundles.find(bundle =>
                bundle.packageUnitIds.includes(itemId)
            ) || null;
        };
    }, [satisfiedBundles]);

    /**
     * Check if item is part of any bundle
     */
    const isItemInBundle = useMemo(() => {
        return (itemId: number): boolean => {
            return satisfiedBundles.some(bundle =>
                bundle.packageUnitIds.includes(itemId)
            );
        };
    }, [satisfiedBundles]);

    /**
     * Get all bundle IDs that contain this item
     */
    const getItemBundleIds = useMemo(() => {
        return (itemId: number): number[] => {
            return satisfiedBundles
                .filter(bundle => bundle.packageUnitIds.includes(itemId))
                .map(bundle => bundle.id);
        };
    }, [satisfiedBundles]);

    return {
        isItemInCart,
        isBundleInCart,
        areAllBundleFeaturesInCart,
        getItemBundleInfo,
        isItemInBundle,
        getItemBundleIds,
    };
};

