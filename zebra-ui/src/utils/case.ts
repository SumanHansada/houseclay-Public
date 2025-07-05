export type CaseStyle = "upper" | "lower" | "pascal";

/** Works for **ANY** string */
export function formatCase(value: string, style: CaseStyle = "pascal"): string {
  switch (style) {
    case "upper":
      return value.toUpperCase();
    case "lower":
      return value.toLowerCase();
    case "pascal":
    default:
      return value.charAt(0).toUpperCase + value.slice(1).toLowerCase();
  }
}

/**
 * Type‑safe wrapper for **string enums** or string literal unions.
 *
 *   formatEnum(PropertyCategory.RENT, 'lower');        // "rent"
 *   formatEnum(UserStatus.ACTIVE, 'pascal');           // "Active"
 */
export function formatEnumValue<V extends string>(
  value: V,
  style: CaseStyle = "pascal",
): string {
  return formatCase(value, style);
}
