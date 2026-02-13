import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AdminRole } from "@/interfaces/AdminAuth";

interface AdminAuthState {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  role: AdminRole | null;
  username?: string;
  name?: string;
  authError: string | null;
}

const initialState: AdminAuthState = {
  isAuthenticated: false,
  isAuthLoading: false,
  role: null,
  username: undefined,
  authError: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    authStarted: (state) => {
      state.isAuthLoading = true;
      state.authError = null;
    },
    authSuccess: (state) => {
      state.isAuthenticated = true;
      state.isAuthLoading = false;
      state.authError = null;
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.isAuthLoading = false;
      state.authError = action.payload;
    },
    setAdminInfo: (
      state,
      action: PayloadAction<{ name: string; username: string }>,
    ) => {
      state.name = action.payload.name;
      state.username = action.payload.username;
    },
    setAdminRole: (state, action: PayloadAction<AdminRole | null>) => {
      state.role = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isAuthLoading = false;
      state.authError = null;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    clearIsAuthenticated: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const {
  setIsAuthenticated,
  clearIsAuthenticated,
  authStarted,
  authSuccess,
  authFailure,
  setAdminInfo,
  setAdminRole,
  logout,
} = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
