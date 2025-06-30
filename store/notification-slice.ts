import { fetchService } from "@/boot/fetch-service";

import { limitForNotifications, notificationStatus } from "@/lib/utils";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface NotificationState {
  items: any[];
  currentPage: number;
  totalPages: number;
  filters: any;
  limit: number;
  drawerItems: any[];
  total: number;
  tabList: any[];
}

const initialState: NotificationState = {
  items: [],
  drawerItems: [],
  currentPage: 1,
  totalPages: 0,
  filters: {},
  limit: limitForNotifications,
  total: 0,
  tabList: [
    { label: "همه اعلان ها", value: notificationStatus.all, count: 0 },
    { label: "خوانده نشده ها", value: notificationStatus.unread, count: 0 },
    { label: "خوانده شده ها", value: notificationStatus.read, count: 0 },
  ],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(fetchAllNotifications.fulfilled, (state, action) => {
      state.items = action?.payload?.data?.map((item: any) => ({
        id: item?.id,
        heading: item?.title,
        content: item?.body,
      }));
      state.tabList = [
        { label: "همه اعلان ها", value: notificationStatus.all, count: 0 },
        { label: "خوانده نشده ها", value: notificationStatus.unread, count: 0 },
        { label: "خوانده شده ها", value: notificationStatus.read, count: 0 },
      ];
    });
    builder.addCase(fetchDrawerNotifications.fulfilled, (state, action) => {
      state.drawerItems = action?.payload?.data?.map((item: any) => ({
        id: item?.id,
        heading: item?.title,
        content: item?.body,
      }));
      state.tabList = [
        { label: "همه اعلان ها", value: notificationStatus.all, count: 0 },
        { label: "خوانده نشده ها", value: notificationStatus.unread, count: 0 },
        { label: "خوانده شده ها", value: notificationStatus.read, count: 0 },
      ];
    });
  },
});

export const fetchAllNotifications = createAsyncThunk<any, any>(
  "notification/fetchAllNotifications",
  async ({ page, limit, filters }) => {
    try {
      const result = await fetchService(
        `notification?page=${page}&limit=${limit}`,
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
export const fetchDrawerNotifications = createAsyncThunk<any, any>(
  "notification/fetchDrawerNotifications",
  async ({ page, limit, filters }) => {
    try {
      const result = await fetchService(
        `notification?page=${page}&limit=${limit}`,
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
