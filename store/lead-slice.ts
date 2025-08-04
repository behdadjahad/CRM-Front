import { fetchService } from "@/boot/fetch-service";
import { limitForLeads } from "@/lib/utils";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface LeadState {
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
const initialState: LeadState = {
  items: [],
  currentPage: 1,
  totalPages: 0,
  filters: {},
  limit: limitForLeads,
  allItems: [],
  total: 0,
  checkedItems: [],
  dateTimeRange: {
    start: "",
    end: "",
  },
};
const leadSlice = createSlice({
  name: "lead",
  initialState: initialState,
  reducers: {
    setCheckedItems(state, action) {
      state.checkedItems = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLeads.fulfilled, (state, action) => {});
    builder.addCase(fetchAllLeads.fulfilled, (state, action) => {});
  },
});
export const fetchLeads = createAsyncThunk<any, any>(
  "laed/fetchLeads",
  async ({ page, limit, filters }) => {
    try {
      const result = await fetchService(`lead?page=${page}&limit=${limit}`, {
        method: "GET",
        //   body: filters,
      });

      return result;
    } catch {
      return {};
    }
  }
);
export const fetchAllLeads = createAsyncThunk<any, any>(
  "lead/fetchAllLeads",
  async ({ page, limit, filters }) => {
    try {
      const result = await fetchService(`lead?page=${page}&limit=${limit}`, {
        method: "GET",
        //   body: filters,
      });

      return result;
    } catch {
      return {};
    }
  }
);
export default leadSlice.reducer;