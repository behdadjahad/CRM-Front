"use client";

import { fetchService } from "@/boot/chadco-customer-service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export interface InvoiceList {
  id: number;
}
export interface InvoiceState {
  items: InvoiceList[];
}
const initialState: InvoiceState = {
  items: [],
};
const invoiceSlice = createSlice({
  name: "invoice",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchInvoice.fulfilled, (state, action) => {
      console.log(action.payload);
      const data = action?.payload?.data;
      console.log(data);
      state.items = data?.map((item: any) => ({
        id: item.id,
        actions: [
          {
            label: "مشاهده",
            icon: "/icons/eye-icon.svg",
          },
          {
            label: "دانلود",
            icon: "/icons/download-icon.svg",
          },
        ],
      }));
    });
  },
});
export const fetchInvoice = createAsyncThunk<any, any>(
  "invoice/fetchInvoice",

  async ({ chadcoCustomerId }) => {
    try {
      const result = await fetchService(
        `invoice/chadco-customer/${chadcoCustomerId}`);
      console.log(result);
      return result;
    } catch {
      return {};
    }
  }
);

export default invoiceSlice.reducer;
