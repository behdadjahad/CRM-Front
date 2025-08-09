import { fetchService } from "@/boot/fetch-service";
import { buildQueryString, limitForLeads } from "@/lib/utils";

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
    builder.addCase(fetchLeads.fulfilled, (state, action) => {
      const data = action?.payload?.data;
      state.items = data?.map((item: any, index: number) => ({
        id: item.id,
        list: [
          {
            label: "نام و نام خانوادگی",
            value: item.customer?.person?.fullName,
          },
          {
            label: "نوع درخواست",
            value: item.leadType?.title,
          },
          {
            label: "علاقه مندی",
            value: item?.temperature,
          },
          {
            label: "وضعیت",
            value: item?.status,
          },
        ],
        exportData: {
          id: item.id,
          ردیف: index + 1,
          "نام و نام خانوادگی": item.customer?.person?.fullName,
          "نوع درخواست": item.leadType?.title,
          "علاقه مندی": item?.temperature,
          وضعیت: item?.status,
        },
      }));
      const totalItems = action?.payload?.pagination?.total;
      const limit = action?.payload?.pagination?.limit;
      state.totalPages = Math.ceil(totalItems / limit);
      state.total = action?.payload?.pagination?.total;
      state.currentPage = action.meta.arg.page;

      state.dateTimeRange.start = action?.payload?.meta?.startRangeTime;
      state.dateTimeRange.end = action?.payload?.meta?.endRangeTime;
    });
    builder.addCase(fetchAllLeads.fulfilled, (state, action) => {
      const data = action?.payload?.data;
      state.allItems = data?.map((item: any, index: number) => ({
        ردیف: index + 1,
        "نام و نام خانوادگی": item.customer?.person?.fullName,
        "نوع درخواست": item.leadType?.title,
        "علاقه مندی": item?.temperature,
        وضعیت: item?.status,
      }));
    });
  },
});
export const fetchLeads = createAsyncThunk<any, any>(
  "laed/fetchLeads",
  async ({ page, limit, filters }) => {
    const queryParams = buildQueryString({
      ...filters, // spread your filters into the query params
    });
    console.log(filters);
    try {
      const result = await fetchService(
        `lead?page=${page}&limit=${limit}&${queryParams}`,
        {
          method: "GET",
          //   body: filters,
        }
      );

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
export const { setCheckedItems } = leadSlice.actions;
