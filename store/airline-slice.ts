import { fetchService } from "@/boot/fetch-service";
import { convertDate } from "@/lib/date";
import { dateType, limitForAirlines } from "@/lib/utils";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface AirlineState {
  items: any[];
  currentPage: number;
  totalPages: number;
  filters: any;
  limit: number;
  editData: any[];
  totalItems: any[];
  total: number;
}

const initialState: AirlineState = {
  items: [],
  currentPage: 1,
  totalPages: 0,
  filters: {},
  limit: limitForAirlines,
  editData: [],
  totalItems: [],
  total:0
};

const airlineSlice = createSlice({
  name: "airline",
  initialState: initialState,
  reducers: {
    //  setData(state, action: PayloadAction<any>) {
    //     state.filters = action.payload;
    //     console.log(action.payload);
    //     state.currentPage = 1;
    //   },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAirlines.fulfilled, (state, action) => {
      state.currentPage = action.meta.arg.page;
      const limit = action?.payload?.pagination?.limit;
      state.limit = limit;
      const data = action?.payload?.data;

      state.items = data?.map((item: any, index: number) => ({
        id: item.id,
        ردیف: index + 1,
        کشور: item?.country?.name,
        شهر: item?.city?.name,
        ایرلاین: item?.name,
        "تاریخ ثبت": item?.submitDateTime
          ? convertDate(item?.submitDateTime, dateType)
          : "",
        "ثبت کننده": item?.userSubmitter?.fullName,
      }));
      console.log(state.items);
      state.editData = data?.map((item: any) => ({
        id: item.id,
        country: item?.country?.id,
        city: item?.city?.id,
        airline: item?.name,
      }));

      const totalItems = action?.payload?.pagination?.total;
      state.totalPages = Math.ceil(
        totalItems / action?.payload?.pagination?.limit
      );

      const filters = action.meta.arg.filters;
      state.filters = filters;

      state.limit = limit;
      state.total = action?.payload?.pagination?.total;
    });
    builder.addCase(fetchAllAirlines.fulfilled, (state, action) => {
      const data = action?.payload?.data;
      state.totalItems = data?.map((item: any, index: number) => ({
        id: item.id,
        ردیف: index + 1,
        کشور: item?.country?.name,
        شهر: item?.city?.name,
        ایرلاین: item?.name,
        "تاریخ ثبت": item?.submitDateTime
          ? convertDate(item?.submitDateTime, dateType)
          : "",
        "ثبت کننده": item?.userSubmitter?.fullName,
      }));
    });
  },
});

export const fetchAirlines = createAsyncThunk<any, any>(
  "airline/fetchAirlines",
  async ({ page, limit, filters, keyword, sort }) => {
    try {
      const result = await fetchService(
        `transportation-co/301?page=${page}&limit=${limit}&keyword=${keyword}&sortBy=${sort.field}&sortOrder=${sort.sortType}`,
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

export const fetchAllAirlines = createAsyncThunk<any, any>(
  "airline/fetchAllAirlines",
  async ({ page, limit, filters, keyword, sort }) => {
    try {
      const result = await fetchService(
        `transportation-co/301?page=${page}&limit=${limit}&keyword=${keyword}&sortBy=${sort.field}&sortOrder=${sort.sortType}`,
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
export default airlineSlice.reducer;
