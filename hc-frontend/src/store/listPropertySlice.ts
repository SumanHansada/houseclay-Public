import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PropertyListingType } from "@/common/utils";
import { PropertyType } from "@/common/utils";

interface ListPropertyState {
  propertyType: PropertyType;
  listingType: PropertyListingType;
  showPropertyType: boolean;
}

const initialState: ListPropertyState = {
  propertyType: PropertyType.RENT,
  listingType: PropertyListingType.DIY,
  showPropertyType: false,
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
    setShowPropertyType: (state, action: PayloadAction<boolean>) => {
      state.showPropertyType = action.payload;
    },
  },
});

export const { setPropertyType, setListingType, setShowPropertyType } =
  listPropertySlice.actions;
export const listPropertyReducer = listPropertySlice.reducer;
