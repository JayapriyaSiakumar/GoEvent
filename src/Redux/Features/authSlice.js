import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: localStorage.getItem("userId")
    ? localStorage.getItem("userId")
    : null,
  token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
  role: localStorage.getItem("role") ? localStorage.getItem("role") : null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },

    logout: (state) => {
      state.userId = null;
      state.token = null;
      state.role = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
