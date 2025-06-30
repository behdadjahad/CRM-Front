import { fetchService } from "@/boot/fetch-service";

import { limitForNotifications } from "@/lib/utils";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface NotificationState {
  items: any[];
  currentPage: number;
  totalPages: number;
  filters: any;
  limit: number;

  total: number;
}

const initialState: NotificationState = {
  items: [],
  currentPage: 1,
  totalPages: 0,
  filters: {},
  limit: limitForNotifications,
  total: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialState,
  reducers: {},

  extraReducers: (builder) => {
      builder.addCase(fetchNotifications.fulfilled, (state, action) => {
        
    });
  },
});

export const fetchNotifications = createAsyncThunk<any, any>(
  "notification/fetchNotifications",
  async ({ page, limit, filters }) => {
    try {
      const result = await fetchService(
        `notification/filter?page=${page}&limit=${limit}`,
        {
          method: "POST",
          body: filters,
        }
      );

      return result;
    } catch {
      return {};
    }
  }
);

export default notificationSlice.reducer;
