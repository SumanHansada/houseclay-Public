import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PropertyCategory } from "@/common/enums";

interface AppState {
  hideStickyNavBar: boolean;
  hideFooter: boolean;
  hideHeader: boolean;
  activeSearchTab: PropertyCategory;
}

const initialState: AppState = {
  hideStickyNavBar: false,
  hideFooter: false,
  hideHeader: false,
  activeSearchTab: PropertyCategory.RENT,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setActiveSearchTab: (state, action: PayloadAction<PropertyCategory>) => {
      state.activeSearchTab = action.payload;
    },
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
  setActiveSearchTab,
  setHideStickyNavBar,
  setHideFooter,
  setHideHeader,
  resetUIState,
} = appSlice.actions;

export default appSlice.reducer;
