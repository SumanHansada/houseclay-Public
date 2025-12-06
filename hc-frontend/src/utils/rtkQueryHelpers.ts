import { SerializedError } from "@reduxjs/toolkit";
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { BASE_API_URL } from "@/common/constants";

/**
 * Raw base query using fetchBaseQuery with base URL and credentials.
 * @returns The configured fetchBaseQuery instance.
 */
export const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_API_URL,
  credentials: "include",
});

/**
 * Enhanced base query that wraps rawBaseQuery with automatic logout handling on 401/403 errors.
 *
 * • Executes the request via rawBaseQuery.
 * • If the backend responds with 401 or 403 (and it's not a logout call), it calls the logout endpoint,
 *   clears the session, and redirects to /login with the current path as a query param.
 *
 * Use this as the baseQuery in createApi to apply auth handling to all endpoints.
 * @param args - The query arguments (string URL or FetchArgs object).
 * @param api - The RTK Query API utilities (for dispatch, etc.).
 * @param extra - Extra arguments passed to fetchBaseQuery.
 * @returns The response from rawBaseQuery (success or error).
 */
export const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args, api, extra) => {
  // Detect if this is a logout call (prevent recursion)
  const isLogoutCall =
    typeof args === "string"
      ? args.includes("/user/logout")
      : (args as FetchArgs).url?.includes("/user/logout");

  const res = await rawBaseQuery(args, api, extra);

  // status can be number | "FETCH_ERROR" | "PARSING_ERROR" | "CUSTOM_ERROR"
  const statusCode =
    typeof res.error?.status === "number" ? res.error.status : undefined;

  if ((statusCode === 401 || statusCode === 403) && !isLogoutCall) {
    // 1) Ask backend to clear the HttpOnly cookie (no throw; returns {data|error})
    await rawBaseQuery({ url: "/user/logout", method: "POST" }, api, extra);

    // 2) Hard redirect to login
    if (typeof window !== "undefined") {
      const from = window.location.pathname + window.location.search;
      window.location.replace(`/login?from=${encodeURIComponent(from)}`);
    }
  }

  return res;
};

/**
 * Extracts a human-readable error message from an RTK Query error (FetchBaseQueryError or SerializedError).
 * Prioritizes backend response data (e.g., { message: "..." } or { error: "..." }), then status code,
 * then serialized message, with safe fallbacks.
 * @param error - The RTK Query error object (unknown type, but handles FetchBaseQueryError | SerializedError).
 * @returns A formatted string message (e.g., "Invalid credentials" or "HTTP error 500").
 */
export function getErrorMessage(error: unknown): string {
  if (!error || !(error instanceof Object)) {
    return "Unknown error occurred";
  }

  // Check for FetchBaseQueryError (HTTP/network errors)
  if (
    "status" in error &&
    typeof (error as FetchBaseQueryError).status === "number"
  ) {
    const fetchError = error as FetchBaseQueryError;
    const status = fetchError.status;
    const data = fetchError.data;

    // Safely extract message from data (assume common shapes like { message: string } or { error: string })
    if (data && typeof data === "object") {
      const typedData = data as { message?: string; error?: string };
      if (typedData.message) return typedData.message;
      if (typedData.error) return typedData.error;
    }

    return `HTTP error ${status}`;
  }

  // Check for SerializedError (general async errors)
  if ("message" in error) {
    const serializedError = error as SerializedError;
    if (typeof serializedError.message === "string") {
      return serializedError.message; // TS now narrows to string (no undefined)
    }
  }

  // Fallback
  return "Request failed. Please try again.";
}
