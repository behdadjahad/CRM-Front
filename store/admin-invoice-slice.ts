"use client";

import { fetchService } from "@/boot/chadco-customer-service";
import { limitForAdminInvoices } from "@/lib/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface InvoiceList {
  id: number;
}
export interface InvoiceState {
  items: InvoiceList[];
  limit: number;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  filters: any;
  allItems: InvoiceList[];
}
const initialState: InvoiceState = {
  items: [],
  limit: limitForAdminInvoices,
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
  filters: {},
  allItems: [],
};
const adminInvoiceSlice = createSlice({
  name: "adminInvoice",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchInvoice.fulfilled, (state, action) => {
      console.log(action.payload);
      const data = action?.payload?.data;
      console.log(data);
      state.items = data?.map((item: any, index: number) => ({
        id: item.id,
        list: [
          {
            label: "ردیف",
            value: index + 1,
          },
          {
            label: "شماره فاکتور",
            value: item.invoiceNumber,
          },
        ],
      }));
      const totalItems = action?.payload?.pagination?.total;
      const limit = action?.payload?.pagination?.limit;
      state.limit = limit;
      state.totalPages = Math.ceil(totalItems / limit);
    });
    builder.addCase(fetchAllInvoices.fulfilled, (state, action) => {
      const data = action?.payload?.data;
      state.allItems = data?.map((item: any, index: number) => ({
        ردیف: index + 1,
        "توضیحات سفارش": item?.requestMessage,
      }));
    });
  },
});
export const fetchInvoice = createAsyncThunk<any, any>(
  "adminInvoice/fetchInvoice",

  async ({ page, limit, filters }) => {
    try {
      const result = await fetchService(`invoice?page=${page}&limit=${limit}`);
      console.log(result);
      return result;
    } catch {
      return {};
    }
  }
);
export const fetchAllInvoices = createAsyncThunk<any, any>(
  "adminInvoice/fetchAllInvoices",

  async ({ page, limit, filters }) => {
    try {
      const result = await fetchService(`invoice?page=${page}&limit=${limit}`);
      console.log(result);
      return result;
    } catch {
      return {};
    }
  }
);

export default adminInvoiceSlice.reducer;
