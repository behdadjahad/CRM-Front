import { fetchService } from "@/boot/fetch-service";
import { convertDate } from "@/lib/date";
import { dateType, limitForHotels } from "@/lib/utils";

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
  limit: limitForHotels,
  editData: [],
};

const hotelSlice = createSlice({
  name: "hotel",
  initialState: initialState,
  reducers: {
    //  setData(state, action: PayloadAction<any>) {
    //     state.filters = action.payload;
    //     console.log(action.payload);
    //     state.currentPage = 1;
    //   },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHotels.fulfilled, (state, action) => {
      const data = action?.payload?.data;

      state.items = data?.flatMap((item: any) =>
        item?.country?.city?.flatMap((city: any) =>
          city?.hotel.map((hotel: any, index: number) => ({
            id: hotel.id,
            ردیف: index + 1,
            کشور: item?.country?.name,
            شهر: city?.name,
            هتل: hotel?.name, // fixed! previously you had `city?.name` here
            "نوع هتل": hotel?.AccommodationAcType?.accomodationType?.name,
            "تاریخ ثبت": hotel?.submitDateTime
              ? convertDate(hotel?.submitDateTime, dateType)
              : "",
            "ثبت کننده": hotel?.userSubmitter?.fullName,
          }))
        )
      );

      state.editData = data?.flatMap((item: any) =>
        item?.country?.city?.flatMap((city: any) =>
          city?.hotel.map((hotel: any) => ({
            id: hotel.id,
            country: item?.country?.id,
            city: city?.id,
            accommadationType: hotel?.AccommodationAcType?.accomodationType?.id,
            hotel: hotel?.name,
          }))
        )
      );

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

export const fetchHotels = createAsyncThunk<any, any>(
  "hotel/fetchHotels",
  async ({ page, limit, filters, keyword, sort }) => {
    try {
      const result = await fetchService(
        `accommodation?page=${page}&limit=${limit}&keyword=${keyword}&sortBy=${sort.field}&sortOrder=${sort.sortType}`,
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
export default hotelSlice.reducer;
