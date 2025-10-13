import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchService } from '@/boot/chadco-customer-service';
import { CartItem, CartState, AddToCartPayload, UpdateCartItemPayload, CartApiResponse } from '@/types/cart';

const initialState: CartState = {
  items: [],
  discountCode: null,
  discountAmount: 0,
  loading: false,
  error: null,
  total: 0,
  subtotal: 0,
  lastUpdated: new Date().toISOString(),
};

// Async thunk for fetching cart items
export const fetchCartItems = createAsyncThunk<CartApiResponse, { chadcoCustomerId: number }>(
  'cart/fetchCartItems',
  async ({ chadcoCustomerId }) => {
    try {
      const result = await fetchService(`cart?chadcoCustomerId=${chadcoCustomerId}`, {
        method: 'GET',
      });
      return result;
    } catch (error) {
      throw error;
    }
  },
);

// Async thunk for adding item(s) to cart - handles both single and multiple

export const addToCart = createAsyncThunk<CartApiResponse, AddToCartPayload & { chadcoCustomerId: number }>(
  'cart/addToCart',
  async ({ packageUnitIds, requestMessage, chadcoCustomerId }) => {
    try {
      const result = await fetchService(`cart/add?chadcoCustomerId=${chadcoCustomerId}`, {
        method: 'PATCH',
        body: {
          packageUnitIds,
          requestMessage,
        },
      });
      
      return result;
    } catch (error) {
      throw error;
    }
  }
);


// Async thunk for removing item from cart
export const removeFromCart = createAsyncThunk<CartApiResponse, AddToCartPayload & { chadcoCustomerId: number }>(
  'cart/removeFromCart',
  async ({ packageUnitIds, requestMessage, chadcoCustomerId }) => {
    try {
      const result = await fetchService(`cart/remove/?chadcoCustomerId=${chadcoCustomerId}`, {
        method: 'PATCH',
        body: {
          packageUnitIds,

        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk for updating item quantity
export const updateCartItemQuantity = createAsyncThunk<CartApiResponse, UpdateCartItemPayload & { chadcoCustomerId: number }>(
  'cart/updateCartItemQuantity',
  async ({ itemId, quantity, chadcoCustomerId }) => {
    try {
      const result = await fetchService(`cart/update/${itemId}?chadcoCustomerId=${chadcoCustomerId}`, {
        method: 'PATCH',
        body: { quantity },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
);


// Async thunk for clearing cart
export const clearCart = createAsyncThunk<CartApiResponse, number>(
  'cart/clearCart',
  async (chadcoCustomerId) => {
    try {
      const result = await fetchService(`cart/remove?chadcoCustomerId=${chadcoCustomerId}`, {
        method: 'PATCH',
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk for payment
export const payFeatures = createAsyncThunk<CartApiResponse, { cartId: number; chadcoCustomerId: number }>(
  'cart/payFeatures',
  async ({ cartId, chadcoCustomerId }) => {
    try {
      const result = await fetchService(`cart/pay?chadcoCustomerId=${chadcoCustomerId}`, {
        method: 'POST',
        body: { cartId },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
);



const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setDiscountCode: (state, action: PayloadAction<string | null>) => {
      state.discountCode = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch cart items
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data?.packageUnits || [];
        state.total = action.payload.data?.packageUnits?.reduce((sum: number, item: any) => sum + item.price, 0) || 0;
        state.subtotal = state.total;
        state.discountAmount = 0;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart items';
      });

    // Add to cart (handles both single and multiple)
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data?.packageUnits || [];
        state.total = action.payload.data?.packageUnits?.reduce((sum: number, item: any) => sum + item.price, 0) || 0;
        state.subtotal = state.total;
        state.discountAmount = 0;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add item(s) to cart';
      });

    // Remove from cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data?.packageUnits || [];
        state.total = action.payload.data?.packageUnits?.reduce((sum: number, item: any) => sum + item.price, 0) || 0;
        state.subtotal = state.total;
        state.discountAmount = 0;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove item from cart';
      });


    builder
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data?.packageUnits || [];
        state.total = action.payload.data?.packageUnits?.reduce((sum: number, item: any) => sum + item.price, 0) || 0;
        state.subtotal = state.total;
        state.discountAmount = 0;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update item quantity';
      });



    // Clear cart
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
        state.subtotal = 0;
        state.discountAmount = 0;
        state.discountCode = null;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to clear cart';
      });
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setDiscountCode,
} = cartSlice.actions;

export default cartSlice.reducer;