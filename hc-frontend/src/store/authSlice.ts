// src/store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token:
    typeof window !== "undefined" ? window.localStorage.getItem("token") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      // Also add the token to the local storage
      if (typeof window !== "undefined") {
        window.localStorage.getItem("token");
      }
    },
    clearToken: (state) => {
      state.token = null;
      // Remove the token from the local storage
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("token");
      }
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
