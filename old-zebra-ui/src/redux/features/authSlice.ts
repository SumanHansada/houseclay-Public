import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginCredentials, LoginResponse } from "../../types/auth.types";
import authService from "../../services/auth.service";

// Async Thunk
export const login = createAsyncThunk<LoginResponse, LoginCredentials>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Login failed");
    }
  }
);

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("access_token"),
  isAuthenticated: !!localStorage.getItem("access_token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.error = null;
      localStorage.removeItem("access_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.access_token;
        state.error = null;
        localStorage.setItem("access_token", action.payload.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.error = action.payload as string;
        localStorage.removeItem("access_token");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
