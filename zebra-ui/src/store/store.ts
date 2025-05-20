import { configureStore } from "@reduxjs/toolkit";

import adminReducer from "./adminSlice";
import { apiSlice } from "./apiSlice";
import appReducer from "./appSlice";
import listPropertyReducer from "./listPropertySlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    admin: adminReducer,
    listProperty: listPropertyReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
