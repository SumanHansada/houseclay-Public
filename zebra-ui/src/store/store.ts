import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import type { WebStorage } from "redux-persist/es/types";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import { default as adminAuthReducer } from "./adminAuthSlice";
import { apiSlice } from "./apiSlice";
import { default as appReducer } from "./appSlice";
import { default as listPropertyReducer } from "./listPropertySlice";
import { default as propertyDetailsReducer } from "./propertyDetailsSlice";
import { default as propertySearchReducer } from "./propertySearchSlice";
import { default as uploadToS3SliceReducer } from "./uploadToS3Slice";
import { default as userReducer } from "./userSlice";

function createNoopStorage(): WebStorage {
  return {
    async getItem(_key: string) {
      return null;
    },
    async setItem(_key: string, _value: string) {
      // return void to satisfy Promise<void>
    },
    async removeItem(_key: string) {
      // return void to satisfy Promise<void>
    },
  };
}

const storage =
  typeof window === "undefined"
    ? createNoopStorage()
    : createWebStorage("local");

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

// Configure persistence for propertySearch slice
const propertySearchPersistConfig = {
  key: "propertySearch",
  storage,
  whitelist: [
    "propertyType",
    "propertyCategory",
    "propertyBhk",
    "tenantType",
    "lookingFor",
    "propertyTypeFilter",
    "tenant",
    "foodPref",
    "bathroomType",
    "furnishing",
    "availability",
    "amenities",
    "parking",
    "priceRangeForRent",
    "priceRangeForBuy",
  ], // Persist all fields
};

const adminAuthPersistConfig = {
  key: "adminAuth",
  storage,
  whitelist: ["isAuthenticated"],
};

const persistedAdminAuthReducer = persistReducer(
  adminAuthPersistConfig,
  adminAuthReducer,
);

const persistedListPropertyReducer = persistReducer(
  listPropertyPersistConfig,
  listPropertyReducer,
);

const persistedPropertySearchReducer = persistReducer(
  propertySearchPersistConfig,
  propertySearchReducer,
);

export function makeStore() {
  return configureStore({
    reducer: {
      app: appReducer,
      adminAuth: persistedAdminAuthReducer,
      listProperty: persistedListPropertyReducer,
      propertyDetails: propertyDetailsReducer,
      propertySearch: persistedPropertySearchReducer,
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
