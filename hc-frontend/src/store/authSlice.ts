import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

import { AuthStep } from "@/common/enums";

export interface AuthUserDetails {
  token: string;
  name: string;
  emailID: string;
  phoneNo: string;
  connectBal: number;
  avatarUrl: string | null;
}

interface AuthState extends AuthUserDetails {
  authStep: AuthStep;
  loginFromAddProperty: boolean;
}

const initialState: AuthState = {
  token: "", // Initialize as null to avoid hydration issues
  authStep: AuthStep.NONE, // Default to login step
  phoneNo: "", // Initialize phoneNo as null
  emailID: "", // Initialize emailID as null
  name: "", // Initialize name as null
  connectBal: 0, // Initialize connectBal as null
  avatarUrl: "", // Initialize avatarUrl as null
  loginFromAddProperty: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (
      state,
      action: PayloadAction<{ authUserDetails: AuthUserDetails }>,
    ) => {
      const { authUserDetails } = action.payload;
      // Direct mutation - Redux Toolkit handles immutability internally
      Object.assign(state, authUserDetails);
    },
    clearAuthUser: (state) => {
      state.token = "";
      state.name = "";
      state.phoneNo = "";
      state.emailID = "";
      state.connectBal = 0;
      state.avatarUrl = "";
    },
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
        state.name = "Suman";
        state.phoneNo = "";
      }
    },
    setAuthStep: (state, action: PayloadAction<AuthStep>) => {
      state.authStep = action.payload;
    },
    clearAuthStep: (state) => {
      state.authStep = AuthStep.NONE;
    },
    setPhoneNo: (state, action: PayloadAction<string>) => {
      state.phoneNo = action.payload;
    },
    clearPhoneNo: (state) => {
      state.phoneNo = "";
    },
    setEmailID: (state, action: PayloadAction<string>) => {
      state.emailID = action.payload;
    },
    clearEmailID: (state) => {
      state.emailID = "";
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    clearName: (state) => {
      state.name = "";
    },
    setLoginFromAddProperty: (state, action: PayloadAction<boolean>) => {
      state.loginFromAddProperty = action.payload;
    },
  },
});

export const {
  setAuthUser,
  clearAuthUser,
  setToken,
  clearToken,
  initializeToken,
  setAuthStep,
  clearAuthStep,
  setPhoneNo,
  clearPhoneNo,
  setEmailID,
  clearEmailID,
  setName,
  clearName,
  setLoginFromAddProperty,
} = authSlice.actions;
export default authSlice.reducer;
