import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { BASE_API_URL } from "@/common/constants";
import { logout as logoutAction } from "@/store/adminAuthSlice";

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
  baseUrl: BASE_API_URL,
  credentials: "include",
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

  // status can be number | "FETCH_ERROR" | "PARSING_ERROR" | "CUSTOM_ERROR"
  const statusCode =
    typeof res.error?.status === "number" ? res.error.status : undefined;

  if (statusCode === 401 || statusCode === 403) {
    // 1) Ask backend to clear the HttpOnly cookie (no throw; returns {data|error})
    await rawBaseQuery({ url: "/admin/logout", method: "POST" }, api, extra);

    // 2) Clear local UI state
    api.dispatch(logoutAction());

    // 3) Hard redirect to login
    if (typeof window !== "undefined") {
      const from = window.location.pathname + window.location.search;
      window.location.replace(`/login?from=${encodeURIComponent(from)}`);
    }
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
  "Admins",
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
