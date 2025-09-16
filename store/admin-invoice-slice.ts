import { fetchService } from "@/boot/fetch-service";
import { limitForAdminInvoices } from "@/lib/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface AdminInvoiceState {
  items: any[];
  currentPage: number;
  totalPages: number;
  filters: any;
  limit: number;
  allItems: any[];
  total: number;
  checkedItems: any[];
  dateTimeRange: {
    start: string;
    end: string;
  };
}

const initialState: AdminInvoiceState = {
  items: [],
  currentPage: 1,
  totalPages: 0,
  filters: {},
  limit: limitForAdminInvoices,
  allItems: [],
  total: 0,
  checkedItems: [],
  dateTimeRange: {
    start: "",
    end: "",
  },
};
const adminInvoiceSlice = createSlice({
  name: "adminInvoice",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchInvoices.fulfilled, (state, action) => {
      state.items = action?.payload?.data?.map((item: any, index: number) => ({
        id: item.id,
      }));
    });
  },
});

export const fetchInvoices = createAsyncThunk<any, any>(
  "adminInvoice/fetchInvoices",
  async ({ page, limit, filters }) => {
    try {
      const result = await fetchService(`?page=${page}&limit=${limit}`, {
        method: "GET",
      });

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
      const result = await fetchService(`page=${page}&limit=${limit}`, {
        method: "GET",
      });

      return result;
    } catch {
      return {};
    }
  }
);
export default adminInvoiceSlice.reducer;
