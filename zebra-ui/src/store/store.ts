import { configureStore } from "@reduxjs/toolkit";

import adminReducer from "./adminSlice";
import { apiSlice } from "./apiSlice";
import appReducer from "./appSlice";
import listPropertyReducer from "./listPropertySlice";
import uploadToS3SliceReducer from "./uploadToS3Slice";
import { default as userReducer } from "./userSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    admin: adminReducer,
    user: userReducer,
    listProperty: listPropertyReducer,
    uploadToS3: uploadToS3SliceReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
