/* --------------------------------------------------------------------
   String helpers
   ------------------------------------------------------------------ */

/** Supported case styles for `formatCase`. */
export type CaseStyle = "upper" | "lower" | "pascal";

/**
 * formatCase
 * ----------
 * Transforms **any** string into the desired case.
 *
 *   formatCase("hello", "upper")   // "HELLO"
 *   formatCase("hello", "pascal")  // "Hello"
 */
export function formatCase(value: string, style: CaseStyle = "pascal"): string {
  switch (style) {
    case "upper":
      return value.toUpperCase();
    case "lower":
      return value.toLowerCase();
    case "pascal":
    default:
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}

/**
 * formatEnumValue
 * ---------------
 * Type‑safe wrapper for **string enums** or literal unions.
 *
 *   formatEnumValue(PropertyCategory.RENT, "lower");   // "rent"
 */
export function formatEnumValue<V extends string>(
  value: V,
  style: CaseStyle = "pascal",
): string {
  return formatCase(value, style);
}

/**
 * getInitials
 * -----------
 * Returns 1 – 2 capital letters that represent a person’s name.
 *
 *   getInitials("Amit Kumar")   // "AK"
 *   getInitials("Amit")         // "A"
 *   getInitials("")             // ""
 *
 * • If the name has **one word**, the first letter is returned.
 * • If the name has **two or more words**, the first letters of the
 *   first two words are returned.
 * • Whitespace is trimmed; `undefined` or empty input yields “”.
 */
export const getInitials = (fullName: string | undefined) => {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[1][0]).toUpperCase();
};

/* --------------------------------------------------------------------
   Enum helpers
   ------------------------------------------------------------------ */

type StringEnum = Record<string, string>;

interface EnsureEnumValueParams<E extends StringEnum> {
  enumObj: E;
  value: unknown;
  fallback: E[keyof E];
}

/** True iff `value` is a member of `enumObj`. */
export function isEnumValue<E extends StringEnum>(
  enumObj: E,
  value: unknown,
): value is E[keyof E] {
  return Object.values(enumObj).includes(value as string);
}

/**
 * ensureEnumValue
 * ---------------
 * Returns `value` when valid; otherwise returns `fallback`.
 *
 *   const tab = ensureEnumValue(UserTabEnum, fromUrl, UserTabEnum.PROFILE);
 */
export function ensureEnumValue<E extends StringEnum>({
  enumObj,
  value,
  fallback,
}: EnsureEnumValueParams<E>): E[keyof E] {
  return isEnumValue(enumObj, value) ? value : fallback;
}

/* --------------------------------------------------------------------
   File helpers
   ------------------------------------------------------------------ */

import { FileData } from "@/interfaces/FileData";

/**
 * fileDataFromUrl
 * ---------------
 * Extracts a lightweight `FileData` object from an S3/HTTP URL.
 *   – Deduces file name & extension
 *   – Maps common image extensions to MIME types
 */
export function fileDataFromUrl(url: string): FileData {
  const pathname = new URL(url).pathname;
  const name = pathname.split("/").pop()!;
  const ext = name.split(".").pop()!.toLowerCase();

  const mime =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  return { name, type: mime, webkitRelativePath: "" };
}

/* --------------------------------------------------------------------
   Date helpers
   ------------------------------------------------------------------ */

/**
 * formatDateVerbose
 * -----------------
 * Converts a JS `Date` (or ISO/epoch) to **“12 July, 2025”**.
 *
 *   formatDateVerbose("2025-07-12")  // "12 July, 2025"
 */
export function formatDateVerbose(
  date: Date | string | number,
  locale = "en-IN",
): string {
  const d = new Date(date);
  const parts = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(d);

  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";

  return `${day} ${month}, ${year}`;
}
