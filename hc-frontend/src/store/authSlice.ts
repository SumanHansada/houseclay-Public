import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: null, // Initialize as null to avoid hydration issues
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("token", action.payload);
      }
    },
    clearToken: (state) => {
      state.token = null;
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("token");
      }
    },
    initializeToken: (state) => {
      if (typeof window !== "undefined") {
        state.token = window.localStorage.getItem("token");
      }
    },
  },
});

export const { setToken, clearToken, initializeToken } = authSlice.actions;
export default authSlice.reducer;
