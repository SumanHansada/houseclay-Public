export * from "./dialog";
export * from "./navigation";

export const BASE_API_URL =
  process.env.NEXT_PUBLIC_HOUSECLAY_API_BASE_URL ||
  "https://apis.houseclay.com/api";

export const WEBSITE_BASE_URL = "https://houseclay.com";
export const CDN_BASE_URL = "https://cdn.houseclay.com";
