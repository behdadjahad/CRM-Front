import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hashCode: null,
  code: "service",
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setHashCode(state, action) {
    
      state.hashCode = action.payload;
    },
  },
});
export const { setHashCode } = roleSlice.actions;
export default roleSlice.reducer;
