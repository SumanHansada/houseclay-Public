import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "./store";
import { GetPropertyByIdResponse } from "@/interfaces/api";

interface PropertyDetailsState {
  data: GetPropertyByIdResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PropertyDetailsState = {
  data: null,
  status: "idle",
  error: null,
};

const propertyDetailsSlice = createSlice({
  name: "propertyDetails",
  initialState,
  reducers: {
    setPropertyData: (
      state,
      action: PayloadAction<GetPropertyByIdResponse>,
    ) => {
      state.data = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    setPropertyLoading: (state) => {
      state.status = "loading";
    },
    setPropertyError: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const { setPropertyData, setPropertyLoading, setPropertyError } =
  propertyDetailsSlice.actions;

export const selectPropertyDetails = (state: RootState) =>
  state.propertyDetails.data;
export const selectUserDetails = (state: RootState) =>
  state.propertyDetails.data;
export const selectPropertyStatus = (state: RootState) =>
  state.propertyDetails.status;

export default propertyDetailsSlice.reducer;
