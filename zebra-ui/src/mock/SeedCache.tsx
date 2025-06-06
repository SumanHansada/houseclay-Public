"use client";

import { useEffect } from "react";

import { seedUsersCache } from "@/mock/testing";

export default function SeedCache() {
  useEffect(() => {
    // Only seed in development:
    if (process.env.NODE_ENV === "development") {
      seedUsersCache();
    }
  }, []);

  return null;
}
