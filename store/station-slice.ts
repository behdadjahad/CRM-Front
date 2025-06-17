import { fetchService } from "@/boot/fetch-service";

import { limitForContracts, limitForStations } from "@/lib/utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface StationState {
  items: any[];
  currentPage: number;
  totalPages: number;
  filters: any;
  limit: number;
  editData: any[];
}

const initialState: StationState = {
  items: [],
  currentPage: 1,
  totalPages: 0,
  filters: {},
  limit: limitForStations,
  editData: [],
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
      state.items = action?.payload?.data?.map((item: any, index: number) => ({
        id: item.id,
        ردیف: index + 1,
        کشور: item.country.name,
        شهر: item.city.name,
        فرودگاه: item.name,
        "تاریخ ثبت": "",
        "ثبت کننده": "",
        countryId: item.countryId,
        cityId: item.cityId,
      }));

      state.editData = action?.payload?.data?.map((item: any, index: number) => ({
        id: item.id,
        airport: item.name,
        country: item.countryId,
        city: item.cityId,
      }));

      const totalItems = action?.payload?.pagination?.total;
      state.totalPages = Math.ceil(
        totalItems / action?.payload?.pagination?.limit
      );
      state.currentPage = action.meta.arg.page;
      const filters = action.meta.arg.filters;
      state.filters = filters;
      const limit = action?.payload?.pagination?.limit;
      state.limit = limit;
    });
  },
});

export const fetchStations = createAsyncThunk<any, any>(
  "station/fetchStations",
  async ({ page, limit, filters }) => {
    try {
      const result = await fetchService(`station?page=${page}&limit=${limit}`, {
        method: "GET",
        //   body: filters,
      });

      return result;
    } catch {
      return {};
    }
  }
);
export default stationSlice.reducer;
