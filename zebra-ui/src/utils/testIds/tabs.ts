import { toSlug } from "@/utils/core";
import createTestIdFactory from "./base";

type StringEnum = Record<string, string>;

export interface TabbedFeatureConfig<EnumType extends StringEnum> {
  featureName: string;
  enumObject: EnumType;
  labelMap: Record<EnumType[keyof EnumType], string>;
}

/**
 * Creates an enhanced test ID factory specifically for tabbed interfaces.
 * It composes the base factory and adds tab-specific helper methods.
 */
export default function createTabbedTestIdFactory<EnumType extends StringEnum>(
  config: TabbedFeatureConfig<EnumType>,
) {
  const { featureName, enumObject, labelMap } = config;

  // 1. Get an instance of the base factory for common IDs
  const baseFactory = createTestIdFactory(featureName);

  // 2. Define tab-specific helper functions
  const getTabButtonId = (tabValue: EnumType[keyof EnumType]) =>
    `tab-${toSlug(featureName)}-${toSlug(labelMap[tabValue])}-button`;

  // 3. Reuse the base page generator for tab pages for consistency
  const getTabPageId = (tabValue: EnumType[keyof EnumType]) =>
    baseFactory.pageId(tabValue);

  // 4. Generate all tab metadata for easy iteration
  const allTabs = (
    Object.values(enumObject) as Array<EnumType[keyof EnumType]>
  ).map((value) => ({
    value,
    label: labelMap[value],
    buttonTestId: getTabButtonId(value),
    pageTestId: getTabPageId(value),
  }));

  // 5. Return a combined object with all base methods AND tab-specific ones
  return {
    ...baseFactory,
    getTabButtonId,
    getTabPageId,
    getTabLabel: (tabValue: EnumType[keyof EnumType]) => labelMap[tabValue],
    allTabs,
  };
}
