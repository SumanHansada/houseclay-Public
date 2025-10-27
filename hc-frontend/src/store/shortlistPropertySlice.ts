import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PropertyCardWithImages } from "@/interfaces/User";

interface ShortlistState {
  shortlistedProperties: PropertyCardWithImages[];
}

const initialState: ShortlistState = {
  shortlistedProperties: [],
};

const shortlistSlice = createSlice({
  name: "shortlist",
  initialState,
  reducers: {
    addToShortlist: (state, action: PayloadAction<PropertyCardWithImages>) => {
      if (
        !state.shortlistedProperties.some(
          (p) => p.propertyID === action.payload.propertyID,
        )
      ) {
        state.shortlistedProperties.push(action.payload);
      }
    },

    removeFromShortlist: (state, action: PayloadAction<string>) => {
      const propertyId = action.payload;
      state.shortlistedProperties = state.shortlistedProperties.filter(
        (p) => p.propertyID !== propertyId,
      );
    },

    setShortlistedProperties: (
      state,
      action: PayloadAction<PropertyCardWithImages[]>,
    ) => {
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

export default shortlistSlice.reducer;
