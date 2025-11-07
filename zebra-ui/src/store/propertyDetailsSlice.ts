import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PropertyForm } from "@/interfaces/PropertyForm";

type Status = "idle" | "pending" | "fulfilled" | "rejected";

interface PropertyDetailsState {
  status: Status;
  error?: string;
  formData?: PropertyForm;
}

const initialState: PropertyDetailsState = { status: "idle" };

const propertyDetailsSlice = createSlice({
  name: "propertyDetails",
  initialState,
  reducers: {
    setPending: (state) => {
      state.status = "pending";
      state.error = undefined;
    },
    setRejected: (state, action: PayloadAction<string>) => {
      state.status = "rejected";
      state.error = action.payload;
    },
    setFulfilled: (state, action: PayloadAction<PropertyForm>) => {
      state.status = "fulfilled";
      state.error = undefined;
      state.formData = action.payload;
    },
    patchForm: (state, action: PayloadAction<Partial<PropertyForm>>) => {
      if (state.formData)
        state.formData = { ...state.formData, ...action.payload };
    },
    reset: () => initialState,
  },
});

export default propertyDetailsSlice.reducer;
