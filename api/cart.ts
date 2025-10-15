import { fetchService } from "@/boot/chadco-customer-service";
import { CartApiResponse } from "@/types/cart";

/**
 * Helper function to check API response and throw error if needed
 */
function checkApiResponse(result: any, defaultErrorMessage: string): void {
    if (result.status === "error" || result.httpStatus >= 400) {
        throw new Error(result.message || defaultErrorMessage);
    }
}

// Get cart items for a customer
export async function getCartItems(chadcoCustomerId: number): Promise<CartApiResponse> {
    try {
        const result = await fetchService(`cart?chadcoCustomerId=${chadcoCustomerId}`, {
            method: "GET",
        });

        checkApiResponse(result, 'خطا در دریافت سبد خرید');
        return result;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
}

// Add items to cart
export async function addToCart(
    unitIds: number[],
    chadcoCustomerId: number,

): Promise<CartApiResponse> {
    try {
        const result = await fetchService(`cart/add?chadcoCustomerId=${chadcoCustomerId}`, {
            method: "PATCH",
            body: { unitIds, },
        });

        checkApiResponse(result, 'خطا در افزودن به سبد خرید');
        return result;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}

// Remove items from cart
export async function removeFromCart(
    packageUnitIds: number[],
    chadcoCustomerId: number
): Promise<CartApiResponse> {
    try {
        const result = await fetchService(`cart/remove-from-cart?chadcoCustomerId=${chadcoCustomerId}`, {
            method: "PATCH",
            body: { unitIds: packageUnitIds },
        });

        checkApiResponse(result, 'خطا در حذف از سبد خرید');
        return result;
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
}

// Update cart item quantity
export async function updateCartItemQuantity(
    itemId: string,
    quantity: number,
    chadcoCustomerId: number
): Promise<CartApiResponse> {
    try {
        const result = await fetchService(`cart/update/${itemId}?chadcoCustomerId=${chadcoCustomerId}`, {
            method: "PATCH",
            body: { quantity },
        });

        checkApiResponse(result, 'خطا در به‌روزرسانی تعداد');
        return result;
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        throw error;
    }
}

// Clear entire cart
export async function clearCart(chadcoCustomerId: number): Promise<CartApiResponse> {
    try {
        const result = await fetchService(`cart/remove?chadcoCustomerId=${chadcoCustomerId}`, {
            method: "PATCH",
        });

        checkApiResponse(result, 'خطا در پاک کردن سبد خرید');
        return result;
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
}

// Pay for features in cart
export async function payFeatures(
    cartId: number,
    chadcoCustomerId: number
): Promise<CartApiResponse> {
    try {
        const result = await fetchService(`payment/features-pay?chadcoCustomerId=${chadcoCustomerId}`, {
            method: "PATCH",
        });

        checkApiResponse(result, 'خطا در پرداخت');
        return result;
    } catch (error) {
        console.error('Error paying features:', error);
        throw error;
    }
}
