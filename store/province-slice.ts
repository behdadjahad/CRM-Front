import { fetchService } from "@/boot/fetch-service";
import { OptionType } from "@/components/shared/form-maker";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface provinceState {
  items: OptionType[];
}
const initialState: provinceState = {
  items: [],
};

const provinceSlice = createSlice({
  name: "province",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProvinces.fulfilled, (state, action) => {
      const data = action?.payload?.data;
      state.items = data?.map((item: any) => ({
        label: item?.name,
        value: item?.id,
        countryId: item?.countryId,
      }));
    });
  },
});
export const fetchProvinces = createAsyncThunk<any>(
  "province/fetchProvinces",
  async () => {
    try {
      const result = await fetchService("province");

      return result;
    } catch {
      return {};
    }
  }
);
export default provinceSlice.reducer;
