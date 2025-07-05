"use client";

import React from "react";

interface AsyncFallbackProps {
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  loadingMessage?: string;
  errorMessage?: string;
  heightClass?: string;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "string") return error;
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return fallback;
};

const AsyncFallback: React.FC<AsyncFallbackProps> = ({
  isLoading,
  isError,
  error,
  loadingMessage = "Loading…",
  errorMessage = "Something went wrong.",
  heightClass = "h-[calc(100vh-4rem)]",
}) => {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${heightClass}`}>
        <span className="text-gray-500">{loadingMessage}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`flex items-center justify-center ${heightClass}`}>
        <span className="text-red-500">
          {getErrorMessage(error, errorMessage)}
        </span>
      </div>
    );
  }

  return null;
};

export default AsyncFallback;
