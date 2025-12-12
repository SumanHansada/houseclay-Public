export type SortFields = "POSTED_ON" | "AVAILABLE_FROM" | "PRICE" | "DISTANCE";
export type SortOrder = "ASC" | "DESC";

export const SORT_OPTIONS = [
  // { value: "EXCLUSIVE", label: "Exclusive" },
  { value: "NONE", label: "None" },
  { value: "POSTED_DESC", label: "Posted (Latest First)" },
  { value: "POSTED_ASC", label: "Posted (Oldest First)" },
  { value: "AVAIL_ASC", label: "Availability (Early First)" },
  { value: "AVAIL_DESC", label: "Availability (Late First)" },
  { value: "PRICE_ASC", label: "Price (Lower First)" },
  { value: "PRICE_DESC", label: "Price (Higher First)" },
  { value: "DIST_ASC", label: "Distance (Closest First)" },
  { value: "DIST_DESC", label: "Distance (Farthest First)" },
];

export type SortToken = (typeof SORT_OPTIONS)[number]["value"];

export const tokenToState: Record<
  SortToken,
  { exclusive?: boolean; sortFields?: SortFields; sortOrder?: SortOrder }
> = {
  EXCLUSIVE: { exclusive: true },
  POSTED_DESC: { sortFields: "POSTED_ON", sortOrder: "DESC" },
  POSTED_ASC: { sortFields: "POSTED_ON", sortOrder: "ASC" },
  AVAIL_ASC: { sortFields: "AVAILABLE_FROM", sortOrder: "ASC" },
  AVAIL_DESC: { sortFields: "AVAILABLE_FROM", sortOrder: "DESC" },
  PRICE_ASC: { sortFields: "PRICE", sortOrder: "ASC" },
  PRICE_DESC: { sortFields: "PRICE", sortOrder: "DESC" },
  DIST_ASC: { sortFields: "DISTANCE", sortOrder: "ASC" },
  DIST_DESC: { sortFields: "DISTANCE", sortOrder: "DESC" },
  NONE: {},
};

export function stateToToken(params: {
  exclusive?: boolean | string | null;
  sortFields?: string | null;
  sortOrder?: string | null;
}): SortToken | undefined {
  const ex =
    params.exclusive === true ||
    params.exclusive === "true" ||
    params.exclusive === "1";

  if (ex) return "EXCLUSIVE";
  const field = params.sortFields || "";
  const order = params.sortOrder || "";
  if (field === "POSTED_ON" && order === "DESC") return "POSTED_DESC";
  if (field === "POSTED_ON" && order === "ASC") return "POSTED_ASC";
  if (field === "AVAILABLE_FROM" && order === "ASC") return "AVAIL_ASC";
  if (field === "AVAILABLE_FROM" && order === "DESC") return "AVAIL_DESC";
  if (field === "PRICE" && order === "ASC") return "PRICE_ASC";
  if (field === "PRICE" && order === "DESC") return "PRICE_DESC";
  if (field === "DISTANCE" && order === "ASC") return "DIST_ASC";
  if (field === "DISTANCE" && order === "DESC") return "DIST_DESC";
  return undefined;
}
