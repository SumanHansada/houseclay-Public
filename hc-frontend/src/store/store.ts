// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";

import { apiSlice } from "./apiSlice";
import appReducer from "./appSlice";
import authReducer from "./authSlice";
import listPropertyReducer from "./listPropertySlice";
import uploadToS3SliceReducer from "./uploadToS3Slice";
import userReducer from "./userSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      app: appReducer,
      auth: authReducer,
      listProperty: listPropertyReducer,
      user: userReducer,
      uploadToS3: uploadToS3SliceReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
}

// Create a store instance
export const store = makeStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
