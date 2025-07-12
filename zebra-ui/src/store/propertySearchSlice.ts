import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PropertyCategoryEnum } from "@/common/enums";
import { PropertySearchFilter } from "@/interfaces/PropertySearchFilter";

const initialState: PropertySearchFilter = {
  propertyType: "",
  propertyCategory: PropertyCategoryEnum.RENT,
  propertyBhk: "",
  tenantType: "",
  // New filter initial states
  lookingFor: "",
  propertyTypeFilter: "",
  tenant: "",
  foodPref: "",
  bathroomType: "",
  furnishing: "",
  availability: "",
  amenities: [],
  parking: "",
  priceRangeForRent: [200000, 700000],
  priceRangeForBuy: [5000000, 70000000],
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
    setPropertyCategory: (
      state,
      action: PayloadAction<PropertyCategoryEnum>,
    ) => {
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
    // New filter actions
    setLookingFor: (state, action: PayloadAction<string>) => {
      state.lookingFor = action.payload;
    },
    setPropertyTypeFilter: (state, action: PayloadAction<string>) => {
      state.propertyTypeFilter = action.payload;
    },
    setTenant: (state, action: PayloadAction<string>) => {
      state.tenant = action.payload;
    },
    setFoodPref: (state, action: PayloadAction<string>) => {
      state.foodPref = action.payload;
    },
    setBathroomType: (state, action: PayloadAction<string>) => {
      state.bathroomType = action.payload;
    },
    setFurnishing: (state, action: PayloadAction<string>) => {
      state.furnishing = action.payload;
    },
    setAvailability: (state, action: PayloadAction<string>) => {
      state.availability = action.payload;
    },
    setAmenities: (state, action: PayloadAction<string[]>) => {
      state.amenities = action.payload;
    },
    setParking: (state, action: PayloadAction<string>) => {
      state.parking = action.payload;
    },
    setPriceRangeForRent: (state, action: PayloadAction<[number, number]>) => {
      state.priceRangeForRent = action.payload;
    },
    setPriceRangeForBuy: (state, action: PayloadAction<[number, number]>) => {
      state.priceRangeForBuy = action.payload;
    },
    resetPropertySearch: (state) => {
      state.propertyType = "";
      state.propertyCategory = PropertyCategoryEnum.RENT;
      state.propertyBhk = "";
      state.tenantType = "";
      // Reset filter states to initial values
      state.lookingFor = "";
      state.propertyTypeFilter = "";
      state.tenant = "";
      state.foodPref = "";
      state.bathroomType = "";
      state.furnishing = "";
      state.availability = "";
      state.amenities = [];
      state.parking = "";
      state.priceRangeForRent = [200000, 700000];
      state.priceRangeForBuy = [5000000, 70000000];
    },
  },
});

export const {
  setPropertyType,
  setPropertyCategory,
  setPropertyBhk,
  setTenantType,
  setLookingFor,
  setPropertyTypeFilter,
  setTenant,
  setFoodPref,
  setBathroomType,
  setFurnishing,
  setAvailability,
  setAmenities,
  setParking,
  setPriceRangeForRent,
  setPriceRangeForBuy,
  resetPropertySearch,
} = propertySearchSlice.actions;

export default propertySearchSlice.reducer;
