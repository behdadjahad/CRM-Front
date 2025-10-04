import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState } from '@/types/cart';

const initialState: CartState = {
  items: [
    {
      id: '1',
      name: 'ویرایش اطلاعات قرارداد',
      category: 'قرارداد',
      description: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ',
      price: 300000,
      quantity: 2,
      tag: 'best-selling',
      usageCount: 15,
    },
    {
      id: '2',
      name: 'سرویس هتل',
      category: 'سرویس هتل',
      description: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ',
      price: 320000,
      quantity: 1,
      tag: 'special',
      durationMonths: 3,
    },
    {
      id: '3',
      name: 'ثبت قرارداد',
      category: 'درخواست',
      description: 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ',
      price: 150000,
      quantity: 1,
      tag: 'suggested',
      usageCount: 15,
    },
  ],
  discountCode: null,
  discountAmount: 0,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload.id);
        }
      }
    },
    applyDiscount: (state, action: PayloadAction<{ code: string; amount: number }>) => {
      state.discountCode = action.payload.code;
      state.discountAmount = action.payload.amount;
    },
    removeDiscount: (state) => {
      state.discountCode = null;
      state.discountAmount = 0;
    },
    clearCart: (state) => {
      state.items = [];
      state.discountCode = null;
      state.discountAmount = 0;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addItem,
  removeItem,
  updateItemQuantity,
  applyDiscount,
  removeDiscount,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;