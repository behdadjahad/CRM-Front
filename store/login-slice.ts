import { fetchService } from "@/boot/fetch-service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export interface loginState {
  fullName: string
}

const initialState: loginState = {
  fullName: "" ,
};


const loginSlice = createSlice({
  name: "login",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLogin.fulfilled, (state, action) => {
      const data = action?.payload?.data;
        state.fullName = data?.fullName;
       
    
    });
  },
});

export const fetchLogin = createAsyncThunk<any>(
  "login/fetchLogin",

  async () => {
    try {
      const result = await fetchService("user");
   
      return result;
    } catch {
      return {};
    }
  }
);
export default loginSlice.reducer;