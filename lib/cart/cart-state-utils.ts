/**
 * Cart state utilities
 * Helper functions for cart state management
 */

import { CartItem } from '@/types/cart';

/**
 * Calculate total price of cart items
 */
export const calculateCartTotal = (items: CartItem[]): number => {
    return items.reduce((sum, item) => sum + item.price, 0);
};

/**
 * Calculate final price with discounts and taxes
 */
export const calculateFinalPrice = (
    originalTotal: number,
    discountAmount: number,
    taxAmount: number
): number => {
    return originalTotal - discountAmount + taxAmount;
};

/**
 * Check if cart is empty
 */
export const isCartEmpty = (items: CartItem[]): boolean => {
    return !items || items.length === 0;
};

/**
 * Get cart item count
 */
export const getCartItemCount = (items: CartItem[]): number => {
    return items?.length || 0;
};

/**
 * Find cart item by ID
 */
export const findCartItem = (items: CartItem[], itemId: number): CartItem | undefined => {
    return items.find(item => item.id === itemId);
};

/**
 * Check if item exists in cart
 */
export const isItemInCart = (items: CartItem[], itemId: number): boolean => {
    return items.some(item => item.id === itemId);
};

