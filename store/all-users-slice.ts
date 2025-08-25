import { fetchService } from "@/boot/fetch-service";
import { OptionType } from "@/components/shared/form-maker";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface currencyState {
  items: OptionType[];
}
const initialState: currencyState = {
  items: [],
};

const allUsersSlice = createSlice({
  name: "allUsers",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      const data = action?.payload?.data;
        state.items = data?.map((item: any) => ({
            label: item?.fullName,
            value:item?.id
      }));
    });
  },
});
export const fetchAllUsers = createAsyncThunk<any>(
  "allUsers/fetchAllUsers",
  async () => {
    try {
      const result = await fetchService(
        "user/all-users"
      );

      return result;
    } catch {
      return {};
    }
  }
);
export default allUsersSlice.reducer;