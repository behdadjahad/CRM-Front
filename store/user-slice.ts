import { fetchService } from "@/boot/fetch-service";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export interface UserData {
  fullName: string;
  id: number;
  chadcoCustomerId: number;
  userRole: {
    role: {
      name: string;
    };
  }[];
  registerationRequestId: number;
  status: string;
}

const initialState: UserData = {
  fullName: "",
  id: 0,
  chadcoCustomerId: 0,
  userRole: [
    {
      role: {
        name: "",
      },
    },
  ],
  registerationRequestId: 0,
  status: "initial",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      const data = action?.payload?.data;
      state.fullName = data?.fullName;
      state.id = data?.id;
      state.chadcoCustomerId = data?.chadcoCustomerId;
      state.registerationRequestId = data?.registerationRequestId;
      state.status = data?.registerationRequest?.status;
    });
  },
});
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async () => {
    try {
      const result = await fetchService("user");

      return result;
    } catch {
      return {};
    }
  }
);
// export const fetchUserData = createAsyncThunk<any, any>(
//   "user/fetchUserData",
//   async (inputData, { dispatch }) => {
//     try {
//       const result = await fetchService("user");

//       // dispatch(setUser(result?.data))
//       return result;
//     } catch { }
//   }
// );

export default userSlice.reducer;
