import { fetchService } from "@/boot/fetch-service";
import { OptionType } from "@/components/shared/form-maker";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface countryState {
  items: OptionType[];
}
const initialState: countryState = {
  items: [],
};

const countrySlice = createSlice({
  name: "country",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCountries.fulfilled, (state, action) => {
      const data = action?.payload?.data;
        state.items = data?.map((item: any) => ({
            label: item?.name,
            value:item?.id
      }));
    });
  },
});
export const fetchCountries = createAsyncThunk<any>(
  "country/fetchCountries",
  async () => {
    try {
      const result = await fetchService(
        "country"
      );

      return result;
    } catch {
      return {};
    }
  }
);
export default countrySlice.reducer;