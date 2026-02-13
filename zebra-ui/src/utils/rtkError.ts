import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Type guard to check if an error is a FetchBaseQueryError.
 */
export const isFetchBaseQueryError = (
  error: unknown,
): error is FetchBaseQueryError => {
  return typeof error === "object" && error !== null && "status" in error;
};

/**
 * Type guard to check if an error is a SerializedError.
 */
export const isSerializedError = (error: unknown): error is SerializedError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
};

/**
 * Universal error parser for RTK Query.
 * Handles:
 * 1. HTTP Errors (400, 404, 500) with various JSON shapes ({message}, {error}, {data})
 * 2. Parsing Errors (Non-JSON responses like 502/504 HTML bodies)
 * 3. Serialized Errors (Network timeouts, fetch failures)
 */
export function getErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error)) {
    // 1. Handle "PARSING_ERROR" (Text response instead of JSON)
    if (error.status === "PARSING_ERROR") {
      return typeof error.data === "string"
        ? error.data
        : "Server response could not be parsed";
    }

    // 2. Handle HTTP Errors (JSON)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = error.data as any;

    if (data) {
      // Priority 1: Direct String
      if (typeof data === "string") return data;

      // Priority 2: Common backend error fields
      if (typeof data.message === "string") return data.message;
      if (typeof data.error === "string") return data.error;
      if (typeof data.data === "string") return data.data;
    }

    // Fallback for HTTP errors with no meaningful payload
    return `Server Error (${error.status})`;
  }

  // 3. Handle Serialized Errors (Network issues, timeouts)
  if (isSerializedError(error)) {
    return error.message || "Network Error";
  }

  // 4. Handle standard JS Errors
  if (error instanceof Error) {
    return error.message;
  }

  // 5. Catch-all
  return "An unexpected error occurred.";
}
