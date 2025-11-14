import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AuthStep } from "@/common/enums";

interface AuthState {
  isAuthenticated: boolean;
  authStep: AuthStep;
  loginFromAddProperty: boolean;
  loginFromBuyConnects: boolean;
  loginFromLoginPage: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  authStep: AuthStep.NONE,
  loginFromAddProperty: false,
  loginFromBuyConnects: false,
  loginFromLoginPage: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    clearIsAuthenticated: (state) => {
      state.isAuthenticated = false;
    },
    setAuthStep: (state, action: PayloadAction<AuthStep>) => {
      state.authStep = action.payload;
    },
    clearAuthStep: (state) => {
      state.authStep = AuthStep.NONE;
    },
    setLoginFromAddProperty: (state, action: PayloadAction<boolean>) => {
      state.loginFromAddProperty = action.payload;
    },
    setLoginFromBuyConnects: (state, action: PayloadAction<boolean>) => {
      state.loginFromBuyConnects = action.payload;
    },
    setLoginFromLoginPage: (state, action: PayloadAction<boolean>) => {
      state.loginFromLoginPage = action.payload;
    },
    // Complete logout - clear all auth state
    logout: (state) => {
      state.isAuthenticated = false;
      state.authStep = AuthStep.NONE;
      state.loginFromAddProperty = false;
      state.loginFromBuyConnects = false;
    },
  },
});

export const {
  setAuthStep,
  clearAuthStep,
  setLoginFromAddProperty,
  setLoginFromBuyConnects,
  setLoginFromLoginPage,
  setIsAuthenticated,
  clearIsAuthenticated,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
