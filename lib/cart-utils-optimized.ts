import { CartItem, SatisfiedBundle } from '@/types/cart';

/**
 * Optimized cart utility functions
 * Centralized and efficient cart-related operations
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
 * Organize cart items into bundles and individual items
 * Optimized version with better performance
 */
export const organizeCartItemsWithBundles = (
    cartItems: CartItem[],
    satisfiedBundles: SatisfiedBundle[]
): {
    bundles: CartBundleGroup[];
    individualItems: CartItem[];
    bundledItemIds: Set<number>;
} => {
    const bundleMap = new Map<number, CartBundleGroup>();
    const bundledItemIds = new Set<number>();

    // Create bundle groups from satisfied bundles
    satisfiedBundles.forEach(bundle => {
        const bundleItems = cartItems.filter(item =>
            bundle.packageUnitIds.includes(item.id)
        );

        if (bundleItems.length > 0) {
            // Calculate total price including quantities
            const totalPrice = bundleItems.reduce((sum, item) =>
                sum + (item.price * (item.quantity || 1)), 0
            );
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

    // Get individual items (not in any bundle)
    const individualItems = cartItems.filter(item => !bundledItemIds.has(item.id));

    return {
        bundles: Array.from(bundleMap.values()),
        individualItems,
        bundledItemIds
    };
};

/**
 * Calculate cart totals efficiently
 */
export const calculateCartTotals = (
    cartItems: CartItem[],
    bundles: CartBundleGroup[],
    discountAmount: number = 0,
    discountAmountByDiscountCode: number = 0,
    taxAmount: number = 0
) => {
    const individualItemsTotal = cartItems.reduce((sum, item) =>
        sum + (item.price * (item.quantity || 1)), 0
    );

    const bundlesTotal = bundles.reduce((sum, bundle) =>
        sum + bundle.discountedPrice, 0
    );

    const originalTotal = individualItemsTotal + bundlesTotal;
    const finalTotal = originalTotal - discountAmount - discountAmountByDiscountCode + taxAmount;

    return {
        originalTotal,
        finalTotal,
        itemCount: cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
    };
};

/**
 * Check if item supports quantity updates
 */
export const canUpdateQuantity = (unitType?: string, unitModel?: string): boolean => {
    return unitType === 'perCount' || unitModel === 'flat';
};

/**
 * Get item quantity from cart data
 */
export const getItemQuantity = (
    itemId: number,
    cartItems: Array<{ count: number; unitId: number }>
): number => {
    const cartItem = cartItems.find(item => item.unitId === itemId);
    return cartItem?.count || 1;
};

/**
 * Create array of item IDs for API calls based on quantity
 */
export const createItemIdsArray = (itemId: number, quantity: number): number[] => {
    return Array(quantity).fill(itemId);
};

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
    return price.toLocaleString('fa-IR');
};

/**
 * Get item status (in cart, loading, etc.)
 */
export const getItemStatus = (
    itemId: number,
    cartItems: CartItem[],
    loadingItems: Set<number>
) => {
    const isInCart = cartItems.some(item => item.id === itemId);
    const isLoading = loadingItems.has(itemId);

    return {
        isInCart,
        isLoading,
        canAdd: !isInCart && !isLoading,
        canRemove: isInCart && !isLoading
    };
};

/**
 * Validate cart operation parameters
 */
export const validateCartOperation = (
    chadcoCustomerId: number | null,
    itemIds: number[]
): { isValid: boolean; error?: string } => {
    if (!chadcoCustomerId) {
        return { isValid: false, error: 'کاربر شناسایی نشده است' };
    }

    if (!itemIds || itemIds.length === 0) {
        return { isValid: false, error: 'لیست آیتم‌ها خالی است' };
    }

    return { isValid: true };
};

