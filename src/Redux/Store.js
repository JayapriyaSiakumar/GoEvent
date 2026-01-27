import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Features/authSlice";
import eventReducer from "./Features/eventSlice";
import bookingReducer from "./Features/bookingSlice";

export const Store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    bookings: bookingReducer,
  },
});
