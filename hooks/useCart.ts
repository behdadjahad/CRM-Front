import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import {
    fetchCartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,

    clearCart,

} from '@/store/cart-slice';
import { useEffect } from 'react';
import { CartItem } from '@/types/cart';

export const useCart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const chadcoCustomerId = useSelector((state: RootState) => state.login.chadcoCustomerId);



    // Load cart items on mount
    useEffect(() => {
        if (chadcoCustomerId) {
            dispatch(fetchCartItems({ chadcoCustomerId: chadcoCustomerId }));
        }
    }, [dispatch, chadcoCustomerId]);

    const cartItems = useSelector((state: RootState) => state.cart?.items || []);
    const loading = useSelector((state: RootState) => state.cart?.loading || false);
    const error = useSelector((state: RootState) => state.cart?.error || null);
    const total = useSelector((state: RootState) => state.cart?.total || 0);
    const subtotal = useSelector((state: RootState) => state.cart?.subtotal || 0);
    const itemCount = useSelector((state: RootState) => state.cart?.items?.length || 0);

    const isItemInCart = (itemId: number): boolean => {
        // Ensure cartItems is an array before calling some()
        if (!Array.isArray(cartItems)) {
            return false;
        }
        return cartItems.some((item: any) => item.id === itemId);
    };

    // Add single item to cart
    const handleAddToCart = (unitId: number, requestMessage?: string) => {
        dispatch(addToCart({
            packageUnitIds: [unitId], // Single ID in array
            chadcoCustomerId: chadcoCustomerId,
        }));
    };

    // Add multiple items to cart
    const handleAddMultipleToCart = (unitIds: number[], requestMessage?: string) => {
        dispatch(addToCart({
            packageUnitIds: unitIds, // Multiple IDs in array
            chadcoCustomerId: chadcoCustomerId,
        }));
    };

    const handleRemoveFromCart = (itemId: string) => {
        if (chadcoCustomerId) {
            dispatch(removeFromCart({ itemId, chadcoCustomerId }));
        }
    };

    const handleUpdateQuantity = (itemId: string, quantity: number) => {
        if (chadcoCustomerId) {
            dispatch(updateCartItemQuantity({ itemId, quantity, chadcoCustomerId }));
        }
    };

    const handleClearCart = () => {
        if (chadcoCustomerId) {
            dispatch(clearCart(chadcoCustomerId));
        }
    };



    const refreshCart = () => {
        dispatch(fetchCartItems({ chadcoCustomerId: chadcoCustomerId }));
    };

    return {
        // State
        items: cartItems,
        loading,
        error,
        total,
        subtotal,
        itemCount,

        // Computed
        isItemInCart,

        // Actions
        addToCart: handleAddToCart,
        addMultipleToCart: handleAddMultipleToCart,
        removeFromCart: handleRemoveFromCart,
        updateQuantity: handleUpdateQuantity,
        clearCart: handleClearCart,
        refreshCart,
    };
};