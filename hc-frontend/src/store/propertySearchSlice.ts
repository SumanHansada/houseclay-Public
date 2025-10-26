import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PropertyCategory } from "@/common/enums";
import { Location } from "@/interfaces/Location";
import { PropertySearchFilter } from "@/interfaces/PropertySearchFilter";

const initialState: PropertySearchFilter = {
  location: null,
  propertyType: "",
  propertyCategory: PropertyCategory.RENT,
  propertyBhk: "",
  tenantType: "",
  availability: "Any",
  // New filter initial states
  lookingFor: "",
  propertyTypeFilter: "",
  tenant: "",
  foodPref: "",
  bathroomType: "",
  furnishing: "",
  amenities: [],
  parking: "",
  priceRangeForRent: [200000, 700000],
  priceRangeForBuy: [5000000, 70000000],
  bhkType: "",
  exclusive: false,
  sortFields: "",
  sortOrder: "",
};

const propertySearchSlice = createSlice({
  name: "propertySearch",
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<Location | null>) => {
      state.location = action.payload;
    },
    setPropertyCategory: (state, action: PayloadAction<PropertyCategory>) => {
      state.propertyCategory = action.payload;
    },
    setPropertyType: (
      state,
      action: PayloadAction<string | number | boolean>,
    ) => {
      state.propertyType = String(action.payload || "");
    },
    setPropertyBhk: (
      state,
      action: PayloadAction<string | number | boolean>,
    ) => {
      state.propertyBhk = String(action.payload || "");
    },
    setTenantType: (
      state,
      action: PayloadAction<string | number | boolean>,
    ) => {
      state.tenantType = String(action.payload || "");
    },
    setAvailability: (state, action: PayloadAction<string>) => {
      state.availability = String(action.payload || "Any");
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
    setBhkType: (state, action: PayloadAction<string>) => {
      state.bhkType = action.payload;
    },
    setExclusiveFilter: (state, action: PayloadAction<boolean>) => {
      state.exclusive = action.payload;
    },
    setSortFields: (state, action: PayloadAction<string>) => {
      state.sortFields = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<string>) => {
      state.sortOrder = action.payload;
    },
    resetPropertySearch: (state) => {
      state.location = null;
      state.propertyType = "";
      state.propertyCategory = PropertyCategory.RENT;
      state.propertyBhk = "";
      state.tenantType = "";
      state.availability = "";
      // Reset filter states to initial values
      state.lookingFor = "";
      state.propertyTypeFilter = "";
      state.tenant = "";
      state.foodPref = "";
      state.bathroomType = "";
      state.furnishing = "";
      state.amenities = [];
      state.parking = "";
      state.priceRangeForRent = [200000, 700000];
      state.priceRangeForBuy = [5000000, 70000000];
      state.bhkType = "";
      state.exclusive = false;
      state.sortFields = "";
      state.sortOrder = "";
    },
  },
});

export const {
  setLocation,
  setPropertyType,
  setPropertyCategory,
  setPropertyBhk,
  setTenantType,
  setAvailability,
  setLookingFor,
  setPropertyTypeFilter,
  setTenant,
  setFoodPref,
  setBathroomType,
  setFurnishing,
  setAmenities,
  setParking,
  setPriceRangeForRent,
  setPriceRangeForBuy,
  setBhkType,
  setExclusiveFilter,
  setSortFields,
  setSortOrder,
  resetPropertySearch,
} = propertySearchSlice.actions;

export default propertySearchSlice.reducer;
