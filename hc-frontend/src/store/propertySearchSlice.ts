import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PropertyCategory } from "@/common/enums";
import { Location } from "@/interfaces/Location";
import { PropertySearchFilter } from "@/interfaces/PropertySearchFilter";

const initialState: PropertySearchFilter = {
  // quick filters
  location: null,
  confirmedLocationName: "",
  propertyType: "",
  propertyCategory: PropertyCategory.RENT,
  bhkType: "",
  tenantType: "",
  availability: "Any",

  // filter dialog
  nonVegAllowed: "",
  preferredTenants: "",
  roomType: "",
  bathroomType: "",
  balconyType: "",
  furnishing: "",
  amenities: [],
  parking: "",
  priceRangeForRent: null,
  priceRangeForFlatmate: null,
  priceRangeForBuy: null,
  exclusive: false,

  // sorting
  sortFields: "",
  sortOrder: "",
};

// Helper function to reset all filters except location (reusable internally)
const onlyResetFilters = (state: PropertySearchFilter) => {
  // state.propertyCategory = PropertyCategory.RENT;

  // Reset quick filters except location
  state.propertyType = "";
  state.tenantType = "";
  state.bhkType = "";
  state.availability = "Any";

  // Reset filter dialog states to initial values
  state.nonVegAllowed = "";
  state.preferredTenants = "";
  state.roomType = "";
  state.bathroomType = "";
  state.balconyType = "";
  state.furnishing = "";
  state.amenities = [];
  state.parking = "";
  state.priceRangeForRent = null;
  state.priceRangeForFlatmate = null;
  state.priceRangeForBuy = null;
  state.exclusive = false;

  // Reset sorting based filters
  state.sortFields = "";
  state.sortOrder = "";
};

const propertySearchSlice = createSlice({
  name: "propertySearch",
  initialState,
  reducers: {
    // quick filters
    setLocation: (state, action: PayloadAction<Location | null>) => {
      state.location = action.payload;
    },
    setConfirmedLocationName: (state, action: PayloadAction<string>) => {
      state.confirmedLocationName = action.payload;
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
    setTenantType: (
      state,
      action: PayloadAction<string | number | boolean>,
    ) => {
      state.tenantType = String(action.payload || "");
    },
    setBhkType: (state, action: PayloadAction<string>) => {
      state.bhkType = action.payload;
    },
    setAvailability: (state, action: PayloadAction<string>) => {
      state.availability = String(action.payload || "Any");
    },

    // filter dialog
    setNonVegAllowed: (state, action: PayloadAction<string>) => {
      state.nonVegAllowed = action.payload;
    },
    setPreferredTenants: (state, action: PayloadAction<string>) => {
      state.preferredTenants = action.payload;
    },
    setRoomType: (state, action: PayloadAction<string>) => {
      state.roomType = action.payload;
    },
    setBathroomType: (state, action: PayloadAction<string>) => {
      state.bathroomType = action.payload;
    },
    setBalconyType: (state, action: PayloadAction<string>) => {
      state.balconyType = action.payload;
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
    setPriceRangeForRent: (
      state,
      action: PayloadAction<[number, number] | null>,
    ) => {
      state.priceRangeForRent = action.payload;
    },
    setPriceRangeForFlatmate: (
      state,
      action: PayloadAction<[number, number] | null>,
    ) => {
      state.priceRangeForFlatmate = action.payload;
    },
    setPriceRangeForBuy: (
      state,
      action: PayloadAction<[number, number] | null>,
    ) => {
      state.priceRangeForBuy = action.payload;
    },
    setExclusiveFilter: (state, action: PayloadAction<boolean>) => {
      state.exclusive = action.payload;
    },

    // sorting
    setSortFields: (state, action: PayloadAction<string>) => {
      state.sortFields = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<string>) => {
      state.sortOrder = action.payload;
    },

    // Reset actions
    resetPropertySearchFilters: (state) => {
      onlyResetFilters(state);
    },
    resetPropertySearchSlice: (state) => {
      state.location = null;
      state.confirmedLocationName = "";
      state.propertyCategory = PropertyCategory.RENT;
      onlyResetFilters(state);
    },
  },
});

export const {
  setLocation,
  setConfirmedLocationName,
  setPropertyType,
  setPropertyCategory,
  setTenantType,
  setPreferredTenants,
  setAvailability,
  setNonVegAllowed,
  setRoomType,
  setBathroomType,
  setBalconyType,
  setFurnishing,
  setAmenities,
  setParking,
  setPriceRangeForRent,
  setPriceRangeForFlatmate,
  setPriceRangeForBuy,
  setBhkType,
  setExclusiveFilter,
  setSortFields,
  setSortOrder,
  resetPropertySearchSlice,
  resetPropertySearchFilters,
} = propertySearchSlice.actions;

export default propertySearchSlice.reducer;
