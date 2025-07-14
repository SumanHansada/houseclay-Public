import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { PropertyResponseFormValues } from "@/interfaces/Property";

import { RootState } from "./store";

type Status = "idle" | "pending" | "fulfilled" | "rejected";

interface PropertyDetailsState {
  status: Status;
  error?: string;
  formData?: PropertyResponseFormValues;
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
    setFulfilled: (
      state,
      action: PayloadAction<PropertyResponseFormValues>,
    ) => {
      state.status = "fulfilled";
      state.error = undefined;
      state.formData = action.payload;
    },
    patchForm: (
      state,
      action: PayloadAction<Partial<PropertyResponseFormValues>>,
    ) => {
      if (state.formData)
        state.formData = { ...state.formData, ...action.payload };
    },
    reset: () => initialState,
  },
});
const base = (state: RootState) => state.propertyDetails;

export const selectStatus = createSelector(base, (state) => state.status);
export const selectFormData = createSelector(base, (state) => state.formData);
export const selectPropertyCategory = createSelector(
  selectFormData,
  (form) => form?.propertyCategory,
);
export const selectIsLoaded = createSelector(
  base,
  (s) => s.status === "fulfilled" && !!s.formData,
);

export const { setPending, setRejected, setFulfilled, patchForm, reset } =
  propertyDetailsSlice.actions;

export default propertyDetailsSlice.reducer;

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// import { PropertyCategoryEnum } from "@/common/enums";
// import { GetPropertyByIdResponse } from "@/interfaces/api";

// type Status = "idle" | "loading" | "succeeded" | "failed";

// interface PropertyDetailsState {
//   data: GetPropertyByIdResponse | null;
//   propertyCategory: PropertyCategoryEnum;
//   status: Status;
//   error: string | null;
// }

// const initialState: PropertyDetailsState = {
//   data: null,
//   status: "idle",
//   propertyCategory: PropertyCategoryEnum.NONE,
//   error: null,
// };

// const propertyDetailsSlice = createSlice({
//   name: "propertyDetails",
//   initialState,
//   reducers: {
//     setPropertyCategory: (
//       state,
//       action: PayloadAction<PropertyCategoryEnum>,
//     ) => {
//       state.propertyCategory = action.payload;
//     },
//     setPending(state) {
//       state.status = "loading";
//       state.error = null;
//     },
//     setFulfilled(state, action: PayloadAction<GetPropertyByIdResponse>) {
//       state.data = action.payload;
//       state.status = "succeeded";
//       state.error = null;
//     },
//     setRejected(state, action: PayloadAction<string>) {
//       state.status = "failed";
//       state.error = action.payload;
//     },
//     /** optional field‑level patches while editing */
//     patch(state, action: PayloadAction<Partial<GetPropertyByIdResponse>>) {
//       if (state.data) Object.assign(state.data, action.payload);
//     },
//     reset: () => initialState,
//   },
// });

// export const {
//   setPropertyCategory,
//   setPending,
//   setFulfilled,
//   setRejected,
//   patch,
//   reset,
// } = propertyDetailsSlice.actions;

// export default propertyDetailsSlice.reducer;
