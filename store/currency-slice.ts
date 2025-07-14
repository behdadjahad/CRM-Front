import { fetchService } from "@/boot/fetch-service";
import { OptionType } from "@/components/shared/form-maker";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface currencyState {
  items: OptionType[];
}
const initialState: currencyState = {
  items: [],
};

const currencySlice = createSlice({
  name: "currency",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCurrencies.fulfilled, (state, action) => {
      const data = action?.payload?.data;
        state.items = data?.map((item: any) => ({
            label: item?.name,
            value:item?.id
      }));
    });
  },
});
export const fetchCurrencies = createAsyncThunk<any>(
  "currency/fetchCurrencies",
  async () => {
    try {
      const result = await fetchService(
        "currency"
      );

      return result;
    } catch {
      return {};
    }
  }
);
export default currencySlice.reducer;