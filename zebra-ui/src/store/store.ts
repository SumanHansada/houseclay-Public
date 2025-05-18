import { configureStore } from "@reduxjs/toolkit";

import adminReducer from "./adminSlice";
import addPropertyReducer from "./addPropertySlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    addProperty: addPropertyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
