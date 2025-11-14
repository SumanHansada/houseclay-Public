import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { GetPropertyByIdResponse } from "@/interfaces/api";
import { PropertyUpdate } from "@/interfaces/PropertyUpdate";
import { UserInfo } from "@/interfaces/User";

export interface PropertyDetails {
  title: string | null;
  premium: boolean;
  managed: boolean;
  propertyState: string;
  propertyUpdates: PropertyUpdate[];
  owner: UserInfo | null;
  viewUsers: UserInfo[];
  shortlistUsers: UserInfo[];
  contactUsers: UserInfo[];
  reportUsers: UserInfo[];
}

interface PropertyDetailsState {
  propertyDetails: PropertyDetails;

  propertyDetailsLoading: boolean;
  propertyDetailsError?: string;
}

const initialState: PropertyDetailsState = {
  propertyDetails: {
    title: null,
    premium: false,
    managed: false,
    propertyState: "",
    propertyUpdates: [],
    owner: null,
    viewUsers: [],
    shortlistUsers: [],
    contactUsers: [],
    reportUsers: [],
  },
  propertyDetailsLoading: false,
  propertyDetailsError: undefined,
};

const propertyDetailsSlice = createSlice({
  name: "propertyDetails",
  initialState,
  reducers: {
    reset: () => initialState,
    setPropertyDetailsLoading: (state, action: PayloadAction<boolean>) => {
      state.propertyDetailsLoading = action.payload;
      if (action.payload) state.propertyDetailsError = undefined;
    },

    setPropertyDetailsError: (
      state,
      action: PayloadAction<string | undefined>,
    ) => {
      state.propertyDetailsError = action.payload;
      state.propertyDetailsLoading = false;
    },

    setPropertyMeta: (
      state,
      action: PayloadAction<{
        title: string | null;
        premium: boolean;
        managed: boolean;
        propertyState: string;
      }>,
    ) => {
      state.propertyDetails = {
        ...state.propertyDetails,
        ...action.payload,
      };
    },

    setPropertyUpdates: (state, action: PayloadAction<PropertyUpdate[]>) => {
      state.propertyDetails.propertyUpdates = action.payload;
    },

    setOwner: (state, action: PayloadAction<UserInfo | null>) => {
      state.propertyDetails.owner = action.payload;
    },

    setViewUsers: (state, action: PayloadAction<UserInfo[]>) => {
      state.propertyDetails.viewUsers = action.payload;
    },

    setShortlistUsers: (state, action: PayloadAction<UserInfo[]>) => {
      state.propertyDetails.shortlistUsers = action.payload;
    },

    setContactUsers: (state, action: PayloadAction<UserInfo[]>) => {
      state.propertyDetails.contactUsers = action.payload;
    },

    setReportUsers: (state, action: PayloadAction<UserInfo[]>) => {
      state.propertyDetails.reportUsers = action.payload;
    },

    // Convenience: one-shot mapper from the API response to this slice.
    setPropertyDetailsFromApi: (
      state,
      action: PayloadAction<GetPropertyByIdResponse>,
    ) => {
      const {
        property,
        propertyUpdates,
        owner,
        viewUsers,
        shortlistUsers,
        contactUsers,
        reportUsers,
      } = action.payload;

      state.propertyDetails = {
        title: property.title,
        premium: property.premium,
        managed: property.managed,
        propertyState: property.propertyState,

        propertyUpdates,
        owner: owner ?? null,
        viewUsers,
        shortlistUsers,
        contactUsers,
        reportUsers,
      };

      state.propertyDetailsLoading = false;
      state.propertyDetailsError = undefined;
    },
  },
});

export const {
  reset,
  setPropertyDetailsLoading,
  setPropertyDetailsError,
  setPropertyMeta,
  setPropertyUpdates,
  setOwner,
  setViewUsers,
  setShortlistUsers,
  setContactUsers,
  setReportUsers,
  setPropertyDetailsFromApi,
} = propertyDetailsSlice.actions;

export default propertyDetailsSlice.reducer;
