import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

import { AuthStep } from "@/common/enums";

interface AuthState {
  token: string | null;
  authStep: AuthStep;
  phoneNo: string;
  emailID: string;
  name: string;
}

const initialState: AuthState = {
  token: null, // Initialize as null to avoid hydration issues
  authStep: AuthStep.EMPTY, // Default to login step
  phoneNo: "", // Initialize phoneNo as null
  emailID: "", // Initialize emailID as null
  name: "", // Initialize name as null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.name = "Suman";
      state.phoneNo = "919999988888";
      // Set cookie with 7 days expiry
      Cookies.set("token", action.payload, { expires: 7 });
    },
    clearToken: (state) => {
      state.token = null;
      Cookies.remove("token");
    },
    initializeToken: (state) => {
      const token = Cookies.get("token");
      if (token) {
        state.token = token;
        state.name = "Suman";
        state.phoneNo = "919999988888";
      }
    },
    setAuthStep: (state, action: PayloadAction<AuthStep>) => {
      state.authStep = action.payload;
    },
    clearAuthStep: (state) => {
      state.authStep = AuthStep.EMPTY;
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
  },
});

export const {
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
} = authSlice.actions;
export default authSlice.reducer;
