import { fetchService } from "@/boot/fetch-service";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface UserData {
  fullName: string;
  userRole: {
    role: {
      name: string;
    };
  }[];
}

const initialState: UserData = {
  fullName: "",
  userRole: [
    {
      role: {
        name: "",
      },
    },
  ],
};

export const fetchUserData = createAsyncThunk<UserData>(
  "user/fetchUserData",
  async (_, { dispatch }) => {
    try {
      const data = await fetchService("user");
      dispatch(setUser(data));
      return data;
    } catch (error) {}
  }
);
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserData>) {
      state.fullName = action.payload.fullName;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
