import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PropertyListingType } from "@/common/utils";
import { PropertyType } from "@/common/utils";

interface ListPropertyState {
  propertyType: PropertyType;
  listingType: PropertyListingType;
}

const initialState: ListPropertyState = {
  propertyType: PropertyType.RENT,
  listingType: PropertyListingType.DIY,
};

const listPropertySlice = createSlice({
  name: "listProperty",
  initialState,
  reducers: {
    setPropertyType: (state, action: PayloadAction<PropertyType>) => {
      state.propertyType = action.payload;
    },
    setListingType: (state, action: PayloadAction<PropertyListingType>) => {
      state.listingType = action.payload;
    },
  },
});

export const { setPropertyType, setListingType } = listPropertySlice.actions;
export const listPropertyReducer = listPropertySlice.reducer;
