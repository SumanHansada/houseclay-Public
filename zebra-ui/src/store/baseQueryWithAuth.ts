import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { logout } from "./adminSlice";
import type { RootState } from "./store";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_HOUSECLAY_API_BASE_URL!,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).admin.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args, api, extra) => {
  const res = await rawBaseQuery(args, api, extra);

  if (res.error && (res.error.status === 401 || res.error.status === 403)) {
    api.dispatch(logout());
    if (typeof window !== "undefined") window.location.assign("/login");
  }

  return res;
};
