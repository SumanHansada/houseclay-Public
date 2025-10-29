import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AdminAuthState {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  authError: string | null;
}

const initialState: AdminAuthState = {
  isAuthenticated: false,
  isAuthLoading: false,
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
  logout,
} = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
