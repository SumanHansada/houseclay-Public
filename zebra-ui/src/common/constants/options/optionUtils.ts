import { ReactNode } from "react";

export type OptionValue = string | number | boolean;

export interface BaseOption<T extends OptionValue = string> {
  value: T;
  label: string;
}

export interface OptionWithIcon<T extends OptionValue = string>
  extends BaseOption<T> {
  icon: ReactNode;
}

interface NumericOptionConfig {
  min?: number;
  max: number;
  addZeroOption?: boolean;
  zeroOptionLabel?: string;
  prefix?: string;
  suffix?: string;
}

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
 * @param str - kebab-case string
 * @returns PascalCase string
 */
export const toPascalCase = (str: string): string => {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Get label for a given value from options array
 * Priority:
 * 1. Find exact match in options and return label
 * 2. If not found, convert value to PascalCase
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

  // Fallback to PascalCase conversion
  return toPascalCase(String(value));
};

/**
 * Get multiple labels for an array of values
 * @param options - Array of options
 * @param values - Array of values to find (can be null or undefined)
 * @returns Array of label strings
 */
export const getOptionLabels = <T extends OptionValue>(
  options: BaseOption<T>[],
  values: T[] | null | undefined,
): string[] => {
  if (!values || values.length === 0) {
    return [];
  }

  return values.map((value) => getOptionLabel(options, value));
};

/**
 * Check if a value exists in options
 * @param options - Array of options
 * @param value - Value to check
 * @returns Boolean indicating if value exists
 */
export const isValidOption = <T extends OptionValue>(
  options: BaseOption<T>[],
  value: T | null | undefined,
): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  return options.some((opt) => opt.value === value);
};

/**
 * Get all values from options array
 * @param options - Array of options
 * @returns Array of all values
 */
export const getOptionValues = <T extends OptionValue>(
  options: BaseOption<T>[],
): T[] => {
  return options.map((opt) => opt.value);
};
