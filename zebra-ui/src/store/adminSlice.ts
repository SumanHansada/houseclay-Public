import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("adminToken", action.payload);
    },
    initializeToken: (state) => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        state.token = token;
      }
    },
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("adminToken");
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = true;
      state.token = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  initializeToken,
  setToken,
} = adminSlice.actions;
export default adminSlice.reducer;
