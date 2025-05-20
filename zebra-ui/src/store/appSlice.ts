import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  hideStickyNavBar: boolean;
  hideFooter: boolean;
  hideHeader: boolean;
}

const initialState: AppState = {
  hideStickyNavBar: false,
  hideFooter: false,
  hideHeader: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setHideStickyNavBar: (state, action: PayloadAction<boolean>) => {
      state.hideStickyNavBar = action.payload;
    },
    setHideFooter: (state, action: PayloadAction<boolean>) => {
      state.hideFooter = action.payload;
    },
    setHideHeader: (state, action: PayloadAction<boolean>) => {
      state.hideHeader = action.payload;
    },
    resetUIState: (state) => {
      state.hideStickyNavBar = false;
      state.hideFooter = false;
      state.hideHeader = false;
    },
  },
});

export const {
  setHideStickyNavBar,
  setHideFooter,
  setHideHeader,
  resetUIState,
} = appSlice.actions;

export default appSlice.reducer;
