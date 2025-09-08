import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userReducer from "./user-slice";
import customerReducer from "./customer-slice";
import customerDetailContractReducer from "./customer-detail-contract-slice";
import contractReducer from "./contract-slice";
import stationReducer from "./station-slice";
import hotelReducer from "./hotel-slice";
import airlineReducer from "./airline-slice";
import notificationReducer from "./notification-slice";
import currencyReducer from "./currency-slice";
import cityReducer from "./city-slice";
import countryReducer from "./country-slice";
import provinceReducer from "./province-slice";
import leadReducer from "./lead-slice";
import allUsersReducer from "./all-users-slice";
import accessReducer from "./access-slice";
import loginReducer from "./login-slice";
export const store = configureStore({
  reducer: {
    user: userReducer,
    currency: currencyReducer,
    city: cityReducer,
    province: provinceReducer,
    country: countryReducer,
    customer: customerReducer,
    customerDetailContract: customerDetailContractReducer,
    contract: contractReducer,
    station: stationReducer,
    hotel: hotelReducer,
    airline: airlineReducer,
    notification: notificationReducer,
    lead: leadReducer,
    allUsers: allUsersReducer,
    access: accessReducer,
    login:loginReducer
  },
});

// Infer the RootState and AppDispatch types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hook to use dispatch with TypeScript
export const useAppDispatch: () => AppDispatch = useDispatch;
