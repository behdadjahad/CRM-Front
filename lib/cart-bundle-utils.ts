import { CartItem, SatisfiedBundle } from "@/types/cart";

/**
 * Cart Bundle Group structure for rendering
 */
export interface CartBundleGroup {
    id: number;
    name: string;
    description: string;
    discountPercent: number;
    items: CartItem[];
    totalPrice: number;
    discountedPrice: number;
}

/**
 * Organizes cart items into bundles based on satisfiedBundles from API
 * Returns both bundled items and individual (non-bundled) items
 */
export const organizeCartItemsWithBundles = (
    cartItems: CartItem[],
    satisfiedBundles: SatisfiedBundle[]
) => {
    const bundleMap = new Map<number, CartBundleGroup>();
    const bundledItemIds = new Set<number>();

    // Create bundle groups from satisfied bundles
    satisfiedBundles.forEach(bundle => {
        const bundleItems = cartItems.filter(item =>
            bundle.packageUnitIds.includes(item.id)
        );

        if (bundleItems.length > 0) {
            // Calculate total price including quantities
            const totalPrice = bundleItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
            const discountAmount = totalPrice * (bundle.discountPercent.value / 100);
            const discountedPrice = totalPrice - discountAmount;

            bundleMap.set(bundle.id, {
                id: bundle.id,
                name: bundle.name,
                description: bundle.description,
                discountPercent: bundle.discountPercent.value,
                items: bundleItems,
                totalPrice,
                discountedPrice
            });

            // Track which items are in bundles
            bundleItems.forEach(item => bundledItemIds.add(item.id));
        }
    });

    // Separate individual items (not in any bundle)
    const individualItems = cartItems.filter(item => !bundledItemIds.has(item.id));

    return {
        bundles: Array.from(bundleMap.values()),
        individualItems,
        bundledItemIds
    };
};

/**
 * Checks if a cart item belongs to any bundle
 */
export const isCartItemInBundle = (
    itemId: number,
    satisfiedBundles: SatisfiedBundle[]
): boolean => {
    return satisfiedBundles.some(bundle =>
        bundle.packageUnitIds.includes(itemId)
    );
};

/**
 * Gets all bundle IDs that a cart item belongs to
 */
export const getCartItemBundleIds = (
    itemId: number,
    satisfiedBundles: SatisfiedBundle[]
): number[] => {
    return satisfiedBundles
        .filter(bundle => bundle.packageUnitIds.includes(itemId))
        .map(bundle => bundle.id);
};

/**
 * Gets bundle information for a specific cart item
 */
export const getCartItemBundleInfo = (
    itemId: number,
    satisfiedBundles: SatisfiedBundle[]
): SatisfiedBundle | null => {
    return satisfiedBundles.find(bundle =>
        bundle.packageUnitIds.includes(itemId)
    ) || null;
};

/**
 * Calculates bundle discount for display
 */
export const calculateBundleDiscount = (
    bundleGroup: CartBundleGroup
): {
    originalTotal: number;
    discountAmount: number;
    finalTotal: number;
    discountPercent: number;
} => {
    return {
        originalTotal: bundleGroup.totalPrice,
        discountAmount: bundleGroup.totalPrice - bundleGroup.discountedPrice,
        finalTotal: bundleGroup.discountedPrice,
        discountPercent: bundleGroup.discountPercent
    };
};


