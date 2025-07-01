import { fetchService } from "@/boot/fetch-service";
import { convertDate } from "@/lib/date";

import {
  dateType,
  limitForNotifications,
  notificationEntityName,
  notificationStatus,
} from "@/lib/utils";

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
        status: item?.status,
        link:
          item.entityName === notificationEntityName.flight
            ? `/contract/service/${item?.entityId}`
            : item.entityName === notificationEntityName.customer
            ? `/customer/${item?.entityId}`
            : item.entityName === notificationEntityName.contract
            ? `/contract/service/${item?.entityId}`
            : "",
        time: item?.createdAt ? convertDate(item?.createdAt, dateType) : "",
      }));

      const totalItems = action?.payload?.pagination?.total;
      state.totalPages = Math.ceil(
        totalItems / action?.payload?.pagination?.limit
      );

      const filters = action.meta.arg.filters;
      state.filters = filters;
      state.currentPage = action.meta.arg.page;
      const limit = action?.payload?.pagination?.limit;
      state.limit = limit;
      state.total = action?.payload?.pagination?.total;
      state.tabList = [
        {
          label: "همه اعلان ها",
          value: notificationStatus.all,
          count: action?.payload?.meta?.totalNotifications,
        },
        {
          label: "خوانده نشده ها",
          value: notificationStatus.unread,
          count: action?.payload?.meta?.totalUnread,
        },
        {
          label: "خوانده شده ها",
          value: notificationStatus.read,
          count: action?.payload?.meta?.totalRead,
        },
      ];
    });
    builder.addCase(fetchDrawerNotifications.fulfilled, (state, action) => {
      state.drawerItems = action?.payload?.data?.map((item: any) => ({
        id: item?.id,
        heading: item?.title,
        content: item?.body,
        status: item?.status,
        link:
          item.entityName === notificationEntityName.flight
            ? `/contract/service/${item?.entityId}`
            : item.entityName === notificationEntityName.customer
            ? `/customer/${item?.entityId}`
            : item.entityName === notificationEntityName.contract
            ? `/contract/service/${item?.entityId}`
            : "",
        time: item?.createdAt ? convertDate(item?.createdAt, dateType) : "",
      }));
      state.tabList = [
        {
          label: "همه اعلان ها",
          value: notificationStatus.all,
          count: action?.payload?.meta?.totalNotifications,
        },
        {
          label: "خوانده نشده ها",
          value: notificationStatus.unread,
          count: action?.payload?.meta?.totalUnread,
        },
        {
          label: "خوانده شده ها",
          value: notificationStatus.read,
          count: action?.payload?.meta?.totalRead,
        },
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
