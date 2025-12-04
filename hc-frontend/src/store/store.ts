// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { apiSlice } from "./apiSlice";
import authReducer from "./authSlice";
import deleteFromS3SliceReducer from "./deleteFromS3Slice";
import editPropertyReducer from "./editPropertySlice";
import listPropertyReducer from "./listPropertySlice";
import propertySearchReducer from "./propertySearchSlice";
import shortlistReducer from "./shortlistPropertySlice";
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

// Configure persistence for editProperty slice
const editPropertyPersistConfig = {
  key: "editProperty",
  storage,
  whitelist: [
    "form",
    "propertyCategory",
    "propertyID",
    "propertyImagesS3Url",
    "propertyImages",
  ],
};

// Configure persistence for propertySearch slice
const propertySearchPersistConfig = {
  key: "propertySearch",
  storage,
  whitelist: [
    "location",
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
    "exclusive",
    "sortFields",
    "sortOrder",
  ], // Persist all fields
};

// Configure persistence for shortlist slice
const shortlistPersistConfig = {
  key: "shortlist",
  storage,
  whitelist: ["shortlistedProperties"], // Persist shortlisted properties
};

// Configure persistence for auth slice
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["isAuthenticated", "authStep", "loginFromAddProperty"],
};

// Configure persistence for user slice (user data)
const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["userDetail"],
};

const persistedListPropertyReducer = persistReducer(
  listPropertyPersistConfig,
  listPropertyReducer,
);

const persistedEditPropertyReducer = persistReducer(
  editPropertyPersistConfig,
  editPropertyReducer,
);

const persistedPropertySearchReducer = persistReducer(
  propertySearchPersistConfig,
  propertySearchReducer,
);

const persistedShortlistReducer = persistReducer(
  shortlistPersistConfig,
  shortlistReducer,
);

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export function makeStore() {
  return configureStore({
    reducer: {
      auth: persistedAuthReducer,
      user: persistedUserReducer,
      listProperty: persistedListPropertyReducer,
      editProperty: persistedEditPropertyReducer,
      propertySearch: persistedPropertySearchReducer,
      shortlist: persistedShortlistReducer,
      uploadToS3: uploadToS3SliceReducer,
      deleteFromS3: deleteFromS3SliceReducer,
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
