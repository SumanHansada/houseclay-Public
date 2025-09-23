import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserDetailsDTO } from "@/interfaces/User";

export interface UserDetailState {
  onWhatsApp: boolean;
  emailVerified: boolean;
  ownedProperties: UserDetailsDTO["ownedProperties"];
  shortlistedProperties: UserDetailsDTO["shortlistedProperties"];
  contactedProperties: UserDetailsDTO["contactedProperties"];
  externalPayments: UserDetailsDTO["externalPayments"];
}

export interface CheckUser {
  exists: boolean;
  message: string;
}

interface UserState {
  userDetail: UserDetailState | undefined;
  userDetailLoading: boolean;
  userDetailError: string | undefined;
  checkUser: CheckUser | undefined;
  checkUserLoading: boolean;
  checkUserError: string | undefined;
}

const initialState: UserState = {
  userDetail: undefined,
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
      state.userDetail = action.payload;
      state.userDetailLoading = false;
      state.userDetailError = undefined;
    },
    clearUser(state) {
      state.userDetail = undefined;
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
