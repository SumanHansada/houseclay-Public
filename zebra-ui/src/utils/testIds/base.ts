import { toSlug } from "@/utils/core";

/**
 * Creates a basic factory for generating consistent data-testid attributes.
 * Follows the conventions:
 * - `page-{feature}-{key}`
 * - `{type}-{feature}-{key}`
 *
 * @param featureName - The namespace for the feature (e.g., 'user-management').
 */
export default function createTestIdFactory(featureName: string) {
  const base = toSlug(featureName);

  return {
    /** ID for a page or view container */
    pageId: (key: string) => `page-${base}-${toSlug(key)}`,
    /** ID for a button */
    buttonId: (key: string) => `button-${base}-${toSlug(key)}`,
    /** ID for an input field */
    inputId: (key: string) => `input-${base}-${toSlug(key)}`,
    /** Generic ID for other elements */
    genericId: (prefix: string, key: string) =>
      `${toSlug(prefix)}-${base}-${toSlug(key)}`,
  };
}
