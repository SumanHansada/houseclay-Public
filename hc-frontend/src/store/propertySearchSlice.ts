import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PropertyCategory } from "@/common/enums";

export interface PropertySearchState {
  propertyType: string | number | boolean;
  propertyCategory: PropertyCategory;
  propertyBhk: string | number | boolean;
  tenantType: string | number | boolean;
}

const initialState: PropertySearchState = {
  propertyType: "",
  propertyCategory: PropertyCategory.RENT,
  propertyBhk: "",
  tenantType: "",
};

const propertySearchSlice = createSlice({
  name: "propertySearch",
  initialState,
  reducers: {
    setPropertyType: (
      state,
      action: PayloadAction<string | number | boolean>,
    ) => {
      state.propertyType = action.payload;
    },
    setPropertyCategory: (state, action: PayloadAction<PropertyCategory>) => {
      state.propertyCategory = action.payload;
    },
    setPropertyBhk: (
      state,
      action: PayloadAction<string | number | boolean>,
    ) => {
      state.propertyBhk = action.payload;
    },
    setTenantType: (
      state,
      action: PayloadAction<string | number | boolean>,
    ) => {
      state.tenantType = action.payload;
    },
    resetPropertySearch: (state) => {
      state.propertyType = "";
      state.propertyCategory = PropertyCategory.RENT;
      state.propertyBhk = "";
      state.tenantType = "";
    },
  },
});

export const {
  setPropertyType,
  setPropertyCategory,
  setPropertyBhk,
  setTenantType,
  resetPropertySearch,
} = propertySearchSlice.actions;

export default propertySearchSlice.reducer;
