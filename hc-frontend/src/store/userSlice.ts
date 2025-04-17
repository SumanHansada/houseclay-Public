import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// src/store/userSlice.ts
export interface User {
  phoneNo: string;
  name: string;
  emailID: string;
  connectBal: number;
  createdAt: string;
  blacklistedAt: string | undefined;
  deletedAt: string | undefined;
  admin: string | undefined;
  ownedProperties: string[] | undefined;
  shortlistedProperties: string[] | undefined;
  contactedProperties: string[] | undefined;
  viewedProperties: string[] | undefined;
  reportedProperties: string[] | undefined;
  externalPayments: string[] | undefined;
  connectTransactions: string[] | undefined;
  userLogins: string[] | undefined;
  blacklisted: boolean;
  deleted: boolean;
}

export interface CheckUser {
  exists: boolean;
  message: string;
}

interface UserState {
  user: User | undefined;
  checkUser: CheckUser | undefined;
  loading: boolean;
  error: string | undefined;
}

const initialState: UserState = {
  user: undefined,
  checkUser: undefined,
  loading: false,
  error: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.loading = false;
      state.error = undefined;
    },
    clearUser(state) {
      state.user = undefined;
      state.loading = false;
      state.error = undefined;
    },
    setCheckUser(state, action: PayloadAction<CheckUser>) {
      state.checkUser = action.payload;
      state.loading = false;
      state.error = undefined;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setCheckUser, setLoading, setError } =
  userSlice.actions;
export default userSlice.reducer;
