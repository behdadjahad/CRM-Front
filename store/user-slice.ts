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
  registerationRequestId: null | number;
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
  registerationRequestId:null
};

export const fetchUserData = createAsyncThunk<UserData>(
  "user/fetchUserData",
  async (inputData, { dispatch }) => {
    try {
      const result = await fetchService("user");
  
      dispatch(setUser(result?.data))
      return result;
    } catch { }
  }
);
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserData>) {
      state.fullName = action.payload.fullName;
      state.id = action.payload.id;
      state.chadcoCustomerId = action.payload.chadcoCustomerId;
      state.registerationRequestId=action.payload.registerationRequestId
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
