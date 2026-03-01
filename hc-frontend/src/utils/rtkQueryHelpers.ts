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

  if (statusCode === 401 && !isLogoutCall) {
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
 * Prioritizes backend response data (e.g., { message: "..." } or { error: "..." }), then plain-string bodies (PARSING_ERROR),
 * then status code, then serialized message, with safe fallbacks.
 * @param error - The RTK Query error object (unknown type, but handles FetchBaseQueryError | SerializedError).
 * @returns A formatted string message (e.g., "Invalid OTP Code" or "User not found").
 */
export function getErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Unknown error occurred";
  }

  // Handle "PARSING_ERROR" (When backend returns plain string instead of JSON)
  if ("status" in error && error.status === "PARSING_ERROR") {
    // We cast to a specific shape because RTK Query doesn't export a named type for this specific state
    const parsingError = error as {
      status: "PARSING_ERROR";
      originalStatus: number;
      data: string;
      error: string;
    };

    // Return the raw string (e.g., "Invalid OTP Code")
    return parsingError.data || "Request failed";
  }

  // Handle standard FetchBaseQueryError (JSON response with HTTP error status)
  // Handle standard FetchBaseQueryError
  if (
    "status" in error &&
    typeof (error as FetchBaseQueryError).status === "number"
  ) {
    const fetchError = error as FetchBaseQueryError;
    const data = fetchError.data;

    // Check if data itself is the error string
    if (typeof data === "string") {
      return data;
    }

    // Check if data is an object with message/error fields
    if (data && typeof data === "object") {
      const typedData = data as {
        data?: string;
        error?: string;
        message?: string;
      };
      if (typedData.data) return typedData.data;
      if (typedData.error) return typedData.error;
      if (typedData.message) return typedData.message;
    }

    // Fallback if JSON exists but has no message/error field
    return `HTTP error ${fetchError.status}`;
  }

  // Handle SerializedError (General async/network errors)
  if ("message" in error) {
    const serializedError = error as SerializedError;
    if (typeof serializedError.message === "string") {
      return serializedError.message;
    }
  }

  return "Request failed. Please try again.";
}
