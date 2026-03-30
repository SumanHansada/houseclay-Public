import {
  BaseOption,
  NumericOptionConfig,
  OptionValue,
} from "@/interfaces/Options";

export const generateNumericOptions = (
  config: NumericOptionConfig,
): BaseOption<number>[] => {
  const {
    min = 1,
    max,
    addZeroOption = false,
    zeroOptionLabel = "None",
    prefix = "",
    suffix = "",
  } = config;

  const options: BaseOption<number>[] = [];

  // Add ground option if needed
  if (addZeroOption) {
    options.push({ value: 0, label: zeroOptionLabel });
  }

  // Generate numeric options
  for (let i = min; i <= max; i++) {
    options.push({
      value: i,
      label: `${prefix}${i}${suffix}`,
    });
  }

  return options;
};

/**
 * Convert kebab-case to PascalCase
 * @param str - kebab-case string (e.g., "floor-type")
 * @returns PascalCase string (e.g., "Floor Type")
 */
export const kebabToPascalCase = (str: string): string => {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Get label for a given value from options array
 * Priority:
 * 1. Find exact match in options and return label
 * 2. If not found, convert value to PascalCase (assumes kebab-case input)
 * 3. If value is null/undefined, return "N/A"
 *
 * @param options - Array of options
 * @param value - Value to find (can be null or undefined)
 * @returns Label string, PascalCase of value, or "N/A"
 */
export const getOptionLabel = <T extends OptionValue>(
  options: BaseOption<T>[],
  value: T | null | undefined,
): string => {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return "N/A";
  }

  // Try to find exact match
  const option = options.find((opt) => opt.value === value);
  if (option) {
    return option.label;
  }

  // Fallback to kebab-case to PascalCase conversion
  return kebabToPascalCase(String(value));
};
