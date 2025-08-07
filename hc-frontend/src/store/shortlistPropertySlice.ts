import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "./store";

interface ShortlistState {
  shortlistedProperties: string[];
}

const initialState: ShortlistState = {
  shortlistedProperties: [],
};

const shortlistSlice = createSlice({
  name: "shortlist",
  initialState,
  reducers: {
    addToShortlist: (state, action: PayloadAction<string>) => {
      const propertyId = action.payload;
      if (!state.shortlistedProperties.includes(propertyId)) {
        state.shortlistedProperties.push(propertyId);
      }
    },
    removeFromShortlist: (state, action: PayloadAction<string>) => {
      const propertyId = action.payload;
      state.shortlistedProperties = state.shortlistedProperties.filter(
        (id: string) => id !== propertyId,
      );
    },
    setShortlistedProperties: (state, action: PayloadAction<string[]>) => {
      state.shortlistedProperties = action.payload;
    },
    clearShortlist: (state) => {
      state.shortlistedProperties = [];
    },
  },
});

export const {
  addToShortlist,
  removeFromShortlist,
  setShortlistedProperties,
  clearShortlist,
} = shortlistSlice.actions;

// Selectors
export const selectShortlistedProperties = (state: RootState) =>
  state.shortlist.shortlistedProperties;

export const selectIsPropertyShortlisted = (
  state: RootState,
  propertyId: string,
) => state.shortlist.shortlistedProperties.includes(propertyId);

export default shortlistSlice.reducer;
