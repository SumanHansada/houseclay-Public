import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AdminState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    initializeToken: (state) => {
      const token = Cookies.get("adminToken");
      if (token) {
        state.isAuthenticated = true;
        state.token = token;
      } else {
        state.isAuthenticated = false;
        state.token = null;
      }
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.token = action.payload;
      state.loading = false;
      state.error = null;
      // Store token in cookie for 7 days
      Cookies.set("adminToken", action.payload, { expires: 7 });
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.loading = false;
      state.error = null;
      // Remove cookie
      Cookies.remove("adminToken");
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  initializeToken,
} = adminSlice.actions;
export default adminSlice.reducer;
