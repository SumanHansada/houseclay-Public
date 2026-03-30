import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

import { BASE_API_URL } from "@/common/constants";
import { logout as logoutAction } from "@/store/adminAuthSlice";

// Create a mutex to prevent multiple redirects if multiple queries fail simultaneously
const mutex = new Mutex();

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
  const result = await rawBaseQuery(args, api, extra);

  const status = result.error?.status;

  // Handle 401 (Token Expired / Invalid)
  if (status === 401) {
    // Check if we are already locking (to avoid spamming logout)
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        // Optional: Attempt to tell backend to clear cookie (fire and forget)
        // We don't await this or care if it fails, because we are nuking the session anyway
        rawBaseQuery({ url: "/admin/logout", method: "POST" }, api, extra);

        // Clear Redux State
        api.dispatch(logoutAction());

        // Hard Redirect to Login
        if (typeof window !== "undefined") {
          // Use window.location to ensure a full state flush
          window.location.href = `/login?clear_session=true&from=${encodeURIComponent(window.location.pathname)}`;
        }
      } finally {
        release();
      }
    }
  }

  // Handle 403 (Forbidden - Role Mismatch)
  if (status === 403) {
    // Do NOT logout. The user is authenticated, just unauthorized for this specific action.
    if (typeof window !== "undefined") {
      // Soft redirect using Next.js router would be better here if you can access it,
      // but window.location is safe for baseQuery.
      window.location.href = "/admin/unauthorized";
    }
  }

  return result;
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
  "AdminDetail",
  "Leads",
  "LeadDetail",
  "Properties",
  "PropertyDetail",
  "PropertiesToVerify",
  "PropertiesToReverify",
  "PropertiesToRoutineCheck",
  "CorporateDomains",
  "CorporateDomainDetail",
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
