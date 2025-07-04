import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { GetPropertyByIdResponse } from "@/interfaces/api";

type Status = "idle" | "loading" | "succeeded" | "failed";

interface PropertyDetailsState {
  data: GetPropertyByIdResponse | null;
  status: Status;
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

export const { setPending, setFulfilled, setRejected, patch, reset } =
  propertyDetailsSlice.actions;

export default propertyDetailsSlice.reducer;
