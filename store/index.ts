import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userReducer from "./user-slice";
import customerReducer from "./customer-slice";
import customerDetailContractReducer from "./customer-detail-contract-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    customer: customerReducer,
    customerDetailContract:customerDetailContractReducer,
  },
});

// Infer the RootState and AppDispatch types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hook to use dispatch with TypeScript
export const useAppDispatch: () => AppDispatch = useDispatch;

