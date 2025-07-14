import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { logout } from "@/store/adminSlice";
import { RootState } from "@/store/store";

/**
 * A thin wrapper around RTK Query’s `fetchBaseQuery`.
 *
 * • Sets the API base‑URL from **NEXT_PUBLIC_HOUSECLAY_API_BASE_URL**.
 * • Automatically adds `Authorization: Bearer <token>` if an admin token
 *   exists in Redux (`state.admin.token`).
 *
 * Use this when you need the plain `BaseQueryFn` (e.g. composing other
 * bespoke base queries); otherwise prefer `baseQueryWithAuth`.
 */
export const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_HOUSECLAY_API_BASE_URL!,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).admin.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

/**
 * `rawBaseQuery` **+** automatic logout on `401/403`.
 *
 * • Executes the request via `rawBaseQuery`.
 * • If the back‑end responds `401` or `403`, it dispatches
 *   `adminSlice.logout()` **and** redirects to `/login`.
 *
 * Drop this into `createApi({ baseQuery: baseQueryWithAuth, … })`
 * so every endpoint inherits the behavior.
 */
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

/**
 * Central list of every RTK Query cache tag your app uses.
 *
 * Add or remove a tag once here; TypeScript propagates the change
 * everywhere else via `Tag`, `listTag`, and `invalidateAllTags`.
 */
export const TAGS = [
  "Users",
  "UserDetail",
  "Leads",
  "LeadDetail",
  "Properties",
  "PropertyDetail",
  "PropertiesToVerify",
  "PropertiesToReverify",
] as const;

/** Union of all tag names, e.g. `"Users" | "Leads" | …`. */
export type Tag = (typeof TAGS)[number];

/**
 * Shorthand for providing a “LIST” cache entry for a tag.
 *
 * ```ts
 * providesTags: listTag("Users");  // -> [{ type: "Users", id: "LIST" }]
 * ```
 */
export const listTag = <T extends Tag>(tag: T) =>
  [{ type: tag, id: "LIST" }] as const;

/**
 * Invalidates the “LIST” entry of **every** declared tag.
 *
 * Ideal for actions like `logout` that should wipe every cached query.
 *
 * ```ts
 * invalidatesTags: invalidateAllTags
 * ```
 */
export const invalidateAllTags = () =>
  TAGS.map((t) => ({ type: t, id: "LIST" }) as const);
