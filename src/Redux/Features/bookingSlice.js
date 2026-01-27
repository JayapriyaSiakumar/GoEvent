import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
  },
  reducers: {
    setMyBookings: (state, action) => {
      state.bookings = action.payload;
    },
    cancelBookingSuccess: (state, action) => {
      state.bookings = state.bookings.map((b) =>
        b._id === action.payload ? { ...b, bookingStatus: "cancelled" } : b,
      );
    },
  },
});

export const { setMyBookings, cancelBookingSuccess } = bookingSlice.actions;
export default bookingSlice.reducer;
