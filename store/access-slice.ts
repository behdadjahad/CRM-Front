import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PageAccess {
  url: string;
  code: string;
  show: boolean;
  title: string;
  pageId: number;
  enabled: boolean;
  features: string[];
}

export interface AccessJson {
  pages: Record<string, PageAccess>[];
}

export interface AccessState {
  accessJson: AccessJson | null;
  currentPageCode: string;
  hash: string;
  isLoading: boolean;
}

const initialState: AccessState = {
  accessJson: null,
  currentPageCode: "", // default page code
  hash: "",
  isLoading: false,
};

const accessSlice = createSlice({
  name: "access",
  initialState,
  reducers: {
    setAccessData: (state, action: PayloadAction<{ accessJson: AccessJson; hash: string }>) => {
      state.accessJson = action.payload.accessJson;
      state.hash = action.payload.hash;
      state.isLoading = false;
    },
    setCurrentPageCode: (state, action: PayloadAction<string>) => {
      state.currentPageCode = action.payload;
   
    },
    setHash: (state, action: PayloadAction<string>) => {
      state.hash = action.payload;
    },
    clearAccessData: (state) => {
      state.accessJson = null;
      state.hash = "";
      state.currentPageCode = "";
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setAccessData,
  setCurrentPageCode,
  setHash,
  clearAccessData,
  setLoading,
} = accessSlice.actions;

export default accessSlice.reducer;