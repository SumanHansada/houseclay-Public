import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{token: string; refreshToken?: string}>,
    ) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken ?? null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
    },
  },
});

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;
