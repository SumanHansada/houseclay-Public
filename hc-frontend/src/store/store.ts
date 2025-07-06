// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { apiSlice } from "./apiSlice";
import appReducer from "./appSlice";
import authReducer from "./authSlice";
import listPropertyReducer from "./listPropertySlice";
import propertySearchReducer from "./propertySearchSlice";
import uploadToS3SliceReducer from "./uploadToS3Slice";
import userReducer from "./userSlice";

// Configure persistence for listProperty slice
const listPropertyPersistConfig = {
  key: "listProperty",
  storage,
  whitelist: [
    "form",
    "propertyCategory",
    "propertyID",
    "propertyImagesS3Url",
    "propertyImages",
  ], // Only persist these fields
};

const persistedListPropertyReducer = persistReducer(
  listPropertyPersistConfig,
  listPropertyReducer,
);

export function makeStore() {
  return configureStore({
    reducer: {
      app: appReducer,
      auth: authReducer,
      listProperty: persistedListPropertyReducer,
      propertySearch: propertySearchReducer,
      user: userReducer,
      uploadToS3: uploadToS3SliceReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }).concat(apiSlice.middleware),
  });
}

// Create a store instance
export const store = makeStore();

// Create persistor
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
