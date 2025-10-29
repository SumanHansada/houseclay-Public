import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Type guard to check if an error is a FetchBaseQueryError.
 */
export const isFetchBaseQueryError = (
  err: unknown,
): err is FetchBaseQueryError => {
  return typeof err === "object" && err !== null && "status" in err;
};

/**
 * Type guard to check if an error is a SerializedError.
 */
export const isSerializedError = (err: unknown): err is SerializedError => {
  return typeof err === "object" && err !== null && "message" in err;
};

/**
 * Internal type guard to safely check for a { message: string }
 * structure in an unknown 'data' payload.
 */
const isErrorDataWithMessage = (data: unknown): data is { message: string } => {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof (data as { message: unknown }).message === "string"
  );
};

/**
 * Converts any 'unknown' error into a human-readable string.
 * This is fully type-safe and handles all RTK error structures.
 */
export const toErrorMessage = (err: unknown): string => {
  // Handle RTK FetchBaseQueryError
  if (isFetchBaseQueryError(err)) {
    // Handle network/client-side errors (status is a string)
    if (typeof err.status === "string") {
      return `Request failed (${err.status}): ${err.error}`;
    }

    // Handle backend HTTP errors (status is a number)
    const status = `Status ${err.status}`;
    let details = "";

    if (isErrorDataWithMessage(err.data)) {
      details = err.data.message;
    } else if (typeof err.data === "string") {
      details = err.data;
    }

    return `Request failed (${status})${details ? `: ${details}` : ""}`;
  }

  // Handle RTK SerializedError
  if (isSerializedError(err)) {
    return err.message ?? "An unknown serialized error occurred";
  }

  // Handle standard JavaScript Error objects
  if (err instanceof Error) {
    return err.message;
  }

  // Fallback for everything else
  return "An unknown error occurred";
};
