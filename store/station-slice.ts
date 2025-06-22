import { fetchService } from "@/boot/fetch-service";
import { convertDate } from "@/lib/date";

import { dateType, limitForContracts, limitForStations } from "@/lib/utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface StationState {
  items: any[];
  currentPage: number;
  totalPages: number;
  filters: any;
  limit: number;
  editData: any[];
  total: number;
  totalItems: any[];
}

const initialState: StationState = {
  items: [],
  currentPage: 1,
  totalPages: 0,
  filters: {},
  limit: limitForStations,
  editData: [],
  total: 0,
  totalItems: [],
};

const stationSlice = createSlice({
  name: "station",
  initialState: initialState,
  reducers: {
    //  setData(state, action: PayloadAction<any>) {
    //     state.filters = action.payload;
    //     console.log(action.payload);
    //     state.currentPage = 1;
    //   },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStations.fulfilled, (state, action) => {
      state.currentPage = action.meta.arg.page;
      const limit = action?.payload?.pagination?.limit;
      state.limit = limit;
      state.items = action?.payload?.data?.map((item: any, index: number) => ({
        id: item.id,
        ردیف: (state.currentPage - 1) * state.limit + index + 1,

        کشور: item?.country?.name,
        شهر: item?.city?.name,
        فرودگاه: item?.name,
        "تاریخ ثبت": item?.submitDateTime
          ? convertDate(item?.submitDateTime, dateType)
          : "",
        "ثبت کننده": "",
        countryId: item.countryId,
        cityId: item.cityId,
      }));

      state.editData = action?.payload?.data?.map(
        (item: any, index: number) => ({
          id: item.id,
          airport: item.name,
          country: item.countryId,
          city: item.cityId,
        })
      );

      const totalItems = action?.payload?.pagination?.total;
      state.totalPages = Math.ceil(
        totalItems / action?.payload?.pagination?.limit
      );

      const filters = action.meta.arg.filters;
      state.filters = filters;

      state.total = action?.payload?.pagination?.total;
    });
    builder.addCase(fetchAllStations.fulfilled, (state, action) => {
      state.totalItems = action?.payload?.data?.map(
        (item: any, index: number) => ({
          id: item.id,
          ردیف: index + 1,
          کشور: item?.country?.name,
          شهر: item?.city?.name,
          فرودگاه: item?.name,
          "تاریخ ثبت": item?.submitDateTime
            ? convertDate(item?.submitDateTime, dateType)
            : "",
          "ثبت کننده": "",
          countryId: item.countryId,
          cityId: item.cityId,
        })
      );
    });
  },
});

export const fetchStations = createAsyncThunk<any, any>(
  "station/fetchStations",
  async ({ page, limit, filters, keyword, sort }) => {
    try {
      const result = await fetchService(
        `station/301?page=${page}&limit=${limit}&keyword=${keyword}&sortBy=${sort.field}&sortOrder=${sort.sortType}`,
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
export const fetchAllStations = createAsyncThunk<any, any>(
  "station/fetchAllStations",
  async ({ page, limit, filters, keyword, sort }) => {
    try {
      const result = await fetchService(
        `station/301?page=${page}&limit=${limit}&keyword=${keyword}&sortBy=${sort.field}&sortOrder=${sort.sortType}`,
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
export default stationSlice.reducer;
