/**
 * Optimized cart-related type definitions
 * Clean, efficient, and well-organized types
 */

// Base cart item structure
export interface BaseCartItem {
    id: number;
    name: string;
    price: number;
    quantity?: number;
}

// Cart item with quantity information
export interface CartItemWithQuantity {
    count: number;
    unitId: number;
}

// Package unit (detailed cart item)
export interface CartItem extends BaseCartItem {
    accessesJson: AccessesJson;
    unitType?: string;
    unitModel: "flat" | "perDuration" | "perCount";
    enabledDurationInDays: number;
    showDurationInDays: number;
    countUnit: number;
    currencyId: number;
    createdAt: string;
    updatedAt: string;
    bundleId?: number;
}

// Access information structure
export interface AccessesJson {
    usageCount?: number;
    [key: string]: any;
}

// Bundle information
export interface SatisfiedBundle {
    id: number;
    name: string;
    description: string;
    discountPercent: {
        value: number;
    };
    packageUnitIds: number[];
}

// Cart data structure from API
export interface CartData {
    id: number;
    chadcoCustomerId: number;
    discountCodeId: number | null;
    originalTotal: number;
    discountAmount: number;
    discountPercent: number;
    discountAmountByDiscountCode: number | null;
    discountPercentByDiscountCode: number | null;
    taxAmount: number;
    taxPercent: number;
    finalTotal: number;
    createdAt: string;
    updatedAt: string;
    items: CartItemWithQuantity[];
    packageUnits: CartItem[];
    satisfiedBundles: SatisfiedBundle[];
}

// Cart API response
export interface CartApiResponse {
    status: string;
    data: CartData;
    message?: string;
}

// Cart operations types
export interface CartOperationResult {
    success: boolean;
    message?: string;
    data?: any;
}

export interface CartOperationParams {
    unitIds: number[];
    chadcoCustomerId: number;
}

// Quantity update types
export interface QuantityUpdateParams {
    itemId: number;
    currentQuantity: number;
    newQuantity: number;
}

export interface PendingQuantityUpdate {
    itemId: number;
    targetQuantity: number;
    originalQuantity: number;
}

// Cart summary types
export interface CartSummary {
    itemCount: number;
    originalTotal: number;
    discountAmount: number;
    discountPercent: number;
    discountAmountByDiscountCode: number | null;
    discountPercentByDiscountCode: number | null;
    taxAmount: number;
    taxPercent: number;
    finalTotal: number;
    cartId: number;
}

// Bundle group for display
export interface CartBundleGroup {
    id: number;
    name: string;
    description: string;
    discountPercent: number;
    items: CartItem[];
    totalPrice: number;
    discountedPrice: number;
}

// Cart state types
export interface CartState {
    items: CartItem[];
    bundles: CartBundleGroup[];
    individualItems: CartItem[];
    summary: CartSummary;
    loading: boolean;
    error: string | null;
}

// Component prop types
export interface CartItemProps {
    item: CartItem;
    onQuantityChange: (id: string, quantity: number) => void;
    onRemove: () => void;
    isUpdating: boolean;
    isRemoving?: boolean;
    isInBundle?: boolean;
    showPrice?: boolean;
    showRemoveButton?: boolean;
    getOptimisticQuantity?: (itemId: number, fallbackQuantity: number) => number;
    isItemUpdating?: (itemId: number) => boolean;
}

export interface CartBundleCardProps {
    bundle: CartBundleGroup;
    onQuantityChange: (id: string, quantity: number) => void;
    onRemoveBundle: (bundleId: number) => void;
    isUpdating: boolean;
    isRemoving?: boolean;
    getOptimisticQuantity?: (itemId: number, fallbackQuantity: number) => number;
    isItemUpdating?: (itemId: number) => boolean;
}

export interface OrderSummaryCardProps {
    cartId: number;
    itemCount: number;
    originalTotal: number;
    discountAmount: number;
    discountPercent: number;
    discountAmountByDiscountCode: number | null;
    discountPercentByDiscountCode: number | null;
    taxAmount: number;
    taxPercent: number;
    finalTotal: number;
    bundles: CartBundleGroup[];
    bundleDiscountPercent: number;
}

// Hook return types
export interface UseCartOperationsReturn {
    updateQuantity: (itemId: number, currentQuantity: number, newQuantity: number) => void;
    getOptimisticQuantity: (itemId: number, fallbackQuantity: number) => number;
    isItemUpdating: (itemId: number) => boolean;
    isUpdating: boolean;
    addToCart: (unitIds: number[]) => void;
    removeItem: (itemId: number, quantity: number) => void;
    removeBundle: (bundleItems: Array<{ id: number; quantity?: number }>) => void;
    isAddingToCart: boolean;
    isRemovingFromCart: boolean;
}

// Utility function types
export interface CartValidationResult {
    isValid: boolean;
    error?: string;
}

export interface ItemStatus {
    isInCart: boolean;
    isLoading: boolean;
    canAdd: boolean;
    canRemove: boolean;
}

