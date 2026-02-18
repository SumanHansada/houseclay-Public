/* --------------------------------------------------------------------
  String helpers
   ------------------------------------------------------------------ */

/** Supported case styles for `formatCase`. */
export type CaseStyle = "upper" | "lower" | "pascal";

/**
 * Transforms any string into the desired case.
 *
 * @remarks
 * - `"upper"` → All caps
 * - `"lower"` → All lowercase
 * - `"pascal"` (default) → Capitalises the first letter, lowercases the rest
 *
 * @example
 * formatCase("hello", "upper");   // "HELLO"
 * formatCase("hello", "lower");   // "hello"
 * formatCase("hello", "pascal");  // "Hello"
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
 * Type-safe wrapper for `formatCase`, designed for string enums or literal unions.
 *
 * @remarks
 * Accepts a typed enum value and formats it using the specified case style.
 *
 * @example
 * formatEnumValue(PropertyCategory.RENT, "lower");   // "rent"
 */
export function formatEnumValue<V extends string>(
  value: V,
  style: CaseStyle = "pascal",
): string {
  return formatCase(value, style);
}

/**
 * Converts a label to a kebab-case slug.
 *
 * @remarks
 * Useful for:
 * - `data-testid` attributes
 * - anchor links and scroll targets
 * - URL-safe keys
 *
 * Strips special characters, trims whitespace, and lowercases the label.
 *
 * @example
 * toSlug("HouseClay Users")      // "houseclay-users"
 * toSlug("UI - Testing")         // "ui-testing"
 */
export function toSlug(label: string): string {
  return label
    .trim() // Remove leading/trailing whitespace
    .toLowerCase() // Convert to lowercase
    .replace(/[^\w\s-]/g, "") // Remove non-word characters (e.g. punctuation)
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
}

/**
 * Returns 1–2 capital letters representing a person’s name.
 *
 * @remarks
 * - If the name has one word, returns the first letter.
 * - If it has two or more words, returns the initials of the first two.
 * - Whitespace is trimmed; `undefined` or empty input yields `""`.
 *
 * @example
 * getInitials("Amit Kumar");   // "AK"
 * getInitials("Amit");         // "A"
 * getInitials("");             // ""
 */
export const getInitials = (fullName: string | undefined) => {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[1][0]).toUpperCase();
};

/**
 * Safely decodes a URL parameter (like a phone number or email).
 *
 * @remarks
 * - Wraps standard `decodeURIComponent` in a try-catch.
 * - Prevents app crashes if the URL contains malformed sequences (e.g. "%").
 * - Essential for parameters containing special chars like "+" (common in phone numbers).
 *
 * @example
 * safeUrlDecode("%2B919876543210"); // Returns "+919876543210"
 * safeUrlDecode("normal-string");   // Returns "normal-string"
 * safeUrlDecode("malformed-%");     // Returns "malformed-%" (doesn't crash)
 */
export function safeUrlDecode(value: string | undefined | null): string {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch (_e) {
    // If the string is malformed (e.g. ends in a single "%"), decodeURIComponent throws.
    // In that case, we return the raw value.
    return value;
  }
}

/* --------------------------------------------------------------------
  Enum helpers
   ------------------------------------------------------------------ */

type StringEnum = Record<string, string>;

interface EnsureEnumValueParams<E extends StringEnum> {
  enumObj: E;
  value: unknown;
  fallback: E[keyof E];
}

/**
 * Returns true if the provided value is a valid member of the string enum.
 *
 * @remarks
 * Used as a type guard for validating string enum values at runtime.
 *
 * @example
 * isEnumValue(PropertyCategory, "RENT"); // true
 * isEnumValue(PropertyCategory, "xyz");  // false
 */
export function isEnumValue<E extends StringEnum>(
  enumObj: E,
  value: unknown,
): value is E[keyof E] {
  return Object.values(enumObj).includes(value as string);
}

/**
 * Returns a valid enum value or the fallback if invalid.
 *
 * @remarks
 * Useful when parsing untrusted input (e.g. query strings).
 *
 * @example
 * const tab = ensureEnumValue({
 *   enumObj: UserTabEnum,
 *   value: fromUrl,
 *   fallback: UserTabEnum.PROFILE,
 * });
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
 * Extracts a `FileData` object from an image/file URL.
 *
 * @remarks
 * - Deduces file name from the URL path.
 * - Infers MIME type from common image extensions (`png`, `webp`, `jpeg`).
 *
 * @example
 * fileDataFromUrl("https://.../img.jpg");
 * // → { name: "img.jpg", type: "image/jpeg", webkitRelativePath: "" }
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
 * Formats a date into **“12 July, 2025”** style.
 *
 * @remarks
 * Accepts a JS `Date`, ISO string, or epoch timestamp. Localised using `en-IN` by default.
 *
 * @example
 * formatDateVerbose("2025-07-12");   // "12 July, 2025"
 * formatDateVerbose(1726051200000); // "12 July, 2025"
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
