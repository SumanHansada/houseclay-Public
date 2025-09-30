import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

import { AuthStep } from "@/common/enums";

interface AuthState {
  token: string;
  authStep: AuthStep;
  loginFromAddProperty: boolean;
}

const initialState: AuthState = {
  token: "",
  authStep: AuthStep.NONE,
  loginFromAddProperty: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      // Set cookie with 7 days expiry
      Cookies.set("token", action.payload, { expires: 7 });
    },
    clearToken: (state) => {
      state.token = "";
      Cookies.remove("token");
    },
    initializeToken: (state) => {
      const token = Cookies.get("token");
      if (token) {
        state.token = token;
      }
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
    // Complete logout - clear all auth state
    logout: (state) => {
      state.token = "";
      state.authStep = AuthStep.NONE;
      state.loginFromAddProperty = false;
      Cookies.remove("token");
    },
  },
});

export const {
  setToken,
  clearToken,
  initializeToken,
  setAuthStep,
  clearAuthStep,
  setLoginFromAddProperty,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
