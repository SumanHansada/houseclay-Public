import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserDetails } from "@/interfaces/User";

interface UserState {
  currentUser?: UserDetails;
}

const initialState: UserState = {
  currentUser: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserDetails>) {
      state.currentUser = action.payload;
    },
    clearUser(state) {
      state.currentUser = undefined;
    },
    toggleBlacklistedLocal(state, action: PayloadAction<boolean>) {
      if (state.currentUser) {
        state.currentUser.blacklisted = action.payload;
      }
    },
  },
});

export const { setUser, clearUser, toggleBlacklistedLocal } = userSlice.actions;
export default userSlice.reducer;
