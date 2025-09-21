"use client";

import { fetchService } from "@/boot/chadco-customer-service";
import { getPaymentStatus } from "@/constants/invoice-constants";
import { convertDate } from "@/lib/date";
import {
  buildQueryString,
  dateType,
  formatPrice,
  limitForAdminInvoices,
} from "@/lib/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export interface InvoiceList {
  id: number;
  title: { label: string; value: string };
  invoiceNumber: {
    label: string;
    value: string;
  };
  description: {
    label: string;
    value: string;
  };
  paymentDates: { label: string; value: string }[];
  status: { label: string; className?: string };
  price: { amount: string; currency: string };
  actions: { label: string; icon: string }[];
}
export interface InvoiceState {
  items: InvoiceList[];
  allItems: InvoiceList[];
  limit?: number;
  currentPage: number;
  totalPages: number;
  filters: any;
  total: number;
}
const initialState: InvoiceState = {
  items: [],
  allItems: [],
  limit: limitForAdminInvoices,
  currentPage: 1,
  totalPages: 0,
  filters: {},
  total: 0,
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
        title: { label: "عنوان سفارش", value: "پکیج طلایی" },
        invoiceNumber: { label: "شماره فاکتور", value: item.invoiceNumber },
        paymentDates: [
          {
            label: "تاریخ سفارش",

            value: item?.issuedAt ? convertDate(item?.issuedAt, dateType) : "",
          },
          {
            label: "مهلت پرداخت",

            value: item?.dueAt ? convertDate(item?.dueAt, dateType) : "",
          },
          {
            label: "تاریخ پرداخت",

            value: item?.paidAt ? convertDate(item?.dueAt, dateType) : "",
          },
        ],
        price: {
          amount: item?.finalTotal ? formatPrice(item?.finalTotal) : "",
          currency: item?.currency?.name,
        },
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
        description: { label: "توضیحات سفارش", value: item?.requestMessage },
        status: {
          label: getPaymentStatus(item?.paymentStatus)?.label,
          className: getPaymentStatus(item?.paymentStatus)?.className,
        },
      }));
      const totalItems = action?.payload?.pagination?.total;
      const limit = action?.payload?.pagination?.limit;
      state.totalPages = Math.ceil(totalItems / limit);
      state.total = action?.payload?.pagination?.total;
      state.currentPage = action.meta.arg.page;
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
  "invoice/fetchInvoice",

  async ({ chadcoCustomerId, page, limit, filters }) => {
    console.log(filters);
    const queryParams = buildQueryString({
      ...filters, // spread your filters into the query params
    });
    try {
      const result = await fetchService(
        `invoice/chadco-customer/${chadcoCustomerId}?page=${page}&limit=${limit}&${queryParams}`
      );
      console.log(result);
      return result;
    } catch {
      return {};
    }
  }
);
export const fetchAllInvoices = createAsyncThunk<any, any>(
  "invoice/fetchAllInvoices",

  async ({ chadcoCustomerId, page, limit, filters }) => {
    console.log(filters);
    const queryParams = buildQueryString({
      ...filters,
    });
    try {
      const result = await fetchService(
        `invoice/chadco-customer/${chadcoCustomerId}?page=${page}&limit=${limit}&${queryParams}`
      );
      console.log(result);
      return result;
    } catch {
      return {};
    }
  }
);

export default invoiceSlice.reducer;
