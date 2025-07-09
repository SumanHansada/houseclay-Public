import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { GetPropertyByIdResponse } from "@/interfaces/api";
import { PropertyCategoryEnum } from "@/common/enums";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface PropertyDetailsState {
  data: GetPropertyByIdResponse | null;
  propertyCategory: PropertyCategoryEnum;
  status: Status;
  error: string | null;
}

const initialState: PropertyDetailsState = {
  data: null,
  status: "idle",
  propertyCategory: PropertyCategoryEnum.NONE,
  error: null,
};

const propertyDetailsSlice = createSlice({
  name: "propertyDetails",
  initialState,
  reducers: {
    setPropertyCategory: (
      state,
      action: PayloadAction<PropertyCategoryEnum>,
    ) => {
      state.propertyCategory = action.payload;
    },
    setPending(state) {
      state.status = "loading";
      state.error = null;
    },
    setFulfilled(state, action: PayloadAction<GetPropertyByIdResponse>) {
      state.data = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    setRejected(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    /** optional field‑level patches while editing */
    patch(state, action: PayloadAction<Partial<GetPropertyByIdResponse>>) {
      if (state.data) Object.assign(state.data, action.payload);
    },
    reset: () => initialState,
  },
});

export const {
  setPropertyCategory,
  setPending,
  setFulfilled,
  setRejected,
  patch,
  reset,
} = propertyDetailsSlice.actions;

export default propertyDetailsSlice.reducer;
