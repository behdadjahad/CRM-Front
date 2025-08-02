import { fetchService } from "@/boot/fetch-service";
import { OptionType } from "@/components/shared/form-maker";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface cityState {
  items: OptionType[];
}
const initialState: cityState = {
  items: [],
};

const citySlice = createSlice({
  name: "city",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCities.fulfilled, (state, action) => {
      const data = action?.payload?.data;
      state.items = data?.map((item: any) => ({
        label: item?.name,
        value: item?.id,
        provinceId: item?.provinceId,
        countryId: item?.countryId,
      }));
    });
  },
});
export const fetchCities = createAsyncThunk<any>(
  "city/fetchCities",
  async () => {
    try {
      const result = await fetchService("city");

      return result;
    } catch {
      return {};
    }
  }
);
export default citySlice.reducer;
