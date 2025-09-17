import { UserDetailsDTO } from "@/interfaces/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserDetailState {
  createdAt: string | null;
  blacklistedAt: string | null;
  blacklisted: boolean;
  broker: boolean;

  userUpdates: UserDetailsDTO["userUpdates"];

  ownedProperties: UserDetailsDTO["ownedProperties"];
  shortlistedProperties: UserDetailsDTO["shortlistedProperties"];
  viewedProperties: UserDetailsDTO["viewedProperties"];
  contactedProperties: UserDetailsDTO["contactedProperties"];

  externalPayments: UserDetailsDTO["externalPayments"];
  connectTransactions: UserDetailsDTO["connectTransactions"];
  reportProperties: UserDetailsDTO["reportProperties"];
}

export interface CheckUser {
  exists: boolean;
  message: string;
}

interface UserState {
  user: UserDetailState | undefined;
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
    setUser(state, action: PayloadAction<UserDetailState>) {
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

// Selectors
export const selectUserDetail = (s: any) =>
  s.user.user as UserDetailState | undefined;
export const selectUserLoading = (s: any) => s.user.loading as boolean;
export const selectUserError = (s: any) => s.user.error as string | undefined;
