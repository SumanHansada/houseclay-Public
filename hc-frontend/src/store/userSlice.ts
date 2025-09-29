import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserDetail {
  name: string;
  emailID: string;
  phoneNo: string;
  connectBal: number;
  avatarUrl: string | null;
  onWhatsApp: boolean;
  emailVerified: boolean;
}

export interface CheckUser {
  exists: boolean;
  message: string;
}

interface UserState {
  // Single source of truth for user data
  userDetail: UserDetail;

  // Loading states for different operations
  userDetailLoading: boolean;
  userDetailError: string | undefined;

  // Check user state
  checkUser: CheckUser | undefined;
  checkUserLoading: boolean;
  checkUserError: string | undefined;
}

const initialState: UserState = {
  userDetail: {
    name: "",
    emailID: "",
    phoneNo: "",
    connectBal: 0,
    avatarUrl: null,
    onWhatsApp: false,
    emailVerified: false,
  },
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
    // Set complete user info (from any API - login, register, userDetails)
    // Accepts partial data - missing fields won't be overwritten
    setUserDetail(state, action: PayloadAction<Partial<UserDetail>>) {
      // Use Object.assign to merge, keeping existing values for missing fields
      Object.assign(state.userDetail, action.payload);
    },

    // Alternative: Complete replacement (if you want to reset everything)
    replaceUserDetail(state, action: PayloadAction<UserDetail>) {
      state.userDetail = action.payload;
    },

    // Individual field updates
    setConnectBal(state, action: PayloadAction<number>) {
      if (state.userDetail) {
        state.userDetail.connectBal = action.payload;
      }
    },

    setName(state, action: PayloadAction<string>) {
      if (state.userDetail) {
        state.userDetail.name = action.payload;
      }
    },

    setEmailID(state, action: PayloadAction<string>) {
      if (state.userDetail) {
        state.userDetail.emailID = action.payload;
      }
    },

    setPhoneNo(state, action: PayloadAction<string>) {
      if (state.userDetail) {
        state.userDetail.phoneNo = action.payload;
      }
    },

    setAvatarUrl(state, action: PayloadAction<string | null>) {
      state.userDetail.avatarUrl = action.payload;
    },

    setEmailVerified(state, action: PayloadAction<boolean>) {
      if (state.userDetail) {
        state.userDetail.emailVerified = action.payload;
      }
    },

    setOnWhatsApp(state, action: PayloadAction<boolean>) {
      if (state.userDetail) {
        state.userDetail.onWhatsApp = action.payload;
      }
    },

    // Clear user data (reset to initial values)
    clearUserDetail(state) {
      state.userDetail = initialState.userDetail;
    },

    // Loading states for userDetail operations
    // Useful when you need global state
    setUserDetailLoading(state, action: PayloadAction<boolean>) {
      state.userDetailLoading = action.payload;
    },

    setUserDetailError(state, action: PayloadAction<string | undefined>) {
      state.userDetailError = action.payload;
      state.userDetailLoading = false;
    },

    clearUserDetailError(state) {
      state.userDetailError = undefined;
    },

    // CheckUser management
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

    // Complete user data cleanup (for logout)
    clearAllUserData(state) {
      state.userDetail = initialState.userDetail;
      state.userDetailLoading = false;
      state.userDetailError = undefined;
      state.checkUser = undefined;
      state.checkUserLoading = false;
      state.checkUserError = undefined;
    },
  },
});

export const {
  setUserDetail,
  replaceUserDetail,
  setConnectBal,
  setName,
  setEmailID,
  setPhoneNo,
  setAvatarUrl,
  setEmailVerified,
  setOnWhatsApp,
  clearUserDetail,
  setUserDetailLoading,
  setUserDetailError,
  clearUserDetailError,
  setCheckUser,
  setCheckUserLoading,
  setCheckUserError,
  clearCheckUser,
  clearAllUserData,
} = userSlice.actions;

export default userSlice.reducer;
