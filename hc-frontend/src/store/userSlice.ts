import { UserDetailsDTO } from "@/interfaces/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

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
  userDetailLoading: boolean;
  userDetailError: string | undefined;
  checkUser: CheckUser | undefined;
  checkUserLoading: boolean;
  checkUserError: string | undefined;
}

const initialState: UserState = {
  user: undefined,
  userDetailLoading: false,
  userDetailError: undefined,

  checkUser: undefined,
  checkUserLoading: false,
  checkUserError: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // userDetails
    setUser(state, action: PayloadAction<UserDetailState>) {
      state.user = action.payload;
      state.userDetailLoading = false;
      state.userDetailError = undefined;
    },
    clearUser(state) {
      state.user = undefined;
      state.userDetailLoading = false;
      state.userDetailError = undefined;
    },
    setUserDetailLoading(state, action: PayloadAction<boolean>) {
      state.userDetailLoading = action.payload;
    },
    setUserDetailError(state, action: PayloadAction<string | undefined>) {
      state.userDetailError = action.payload;
      state.userDetailLoading = false;
    },

    // checkUser
    setCheckUser(state, action: PayloadAction<CheckUser>) {
      state.checkUser = action.payload;
      state.checkUserLoading = false;
      state.checkUserError = undefined;
    },
    setCheckUserLoading(state, action: PayloadAction<boolean>) {
      state.checkUserLoading = action.payload;
    },
    setCheckUserError(state, action: PayloadAction<string | undefined>) {
      state.checkUserError = action.payload;
      state.checkUserLoading = false;
    },
    clearCheckUser(state) {
      state.checkUser = undefined;
      state.checkUserLoading = false;
      state.checkUserError = undefined;
    },
  },
});

export const {
  setUser,
  clearUser,
  setUserDetailLoading,
  setUserDetailError,
  setCheckUser,
  setCheckUserLoading,
  setCheckUserError,
  clearCheckUser,
} = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const selectUserDetail = (s: RootState) => s.user.user;
export const selectUserDetailLoading = (s: RootState) =>
  s.user.userDetailLoading;
export const selectUserDetailError = (s: RootState) => s.user.userDetailError;

export const selectCheckUser = (s: RootState) => s.user.checkUser;
export const selectCheckUserLoading = (s: RootState) => s.user.checkUserLoading;
export const selectCheckUserError = (s: RootState) => s.user.checkUserError;
