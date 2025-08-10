// Common Tailwind CSS class presets for Storybook controls
export const tailwindPresets = {
  // Spacing
  spacing: {
    "p-0": "p-0",
    "p-1": "p-1",
    "p-2": "p-2",
    "p-3": "p-3",
    "p-4": "p-4",
    "p-6": "p-6",
    "p-8": "p-8",
    "p-12": "p-12",
    "p-16": "p-16",
  },

  // Margins
  margin: {
    "m-0": "m-0",
    "m-1": "m-1",
    "m-2": "m-2",
    "m-3": "m-3",
    "m-4": "m-4",
    "m-6": "m-6",
    "m-8": "m-8",
    "m-12": "m-12",
    "m-16": "m-16",
  },

  // Background colors
  background: {
    "bg-white": "bg-white",
    "bg-gray-50": "bg-gray-50",
    "bg-gray-100": "bg-gray-100",
    "bg-gray-200": "bg-gray-200",
    "bg-blue-50": "bg-blue-50",
    "bg-blue-100": "bg-blue-100",
    "bg-green-50": "bg-green-50",
    "bg-green-100": "bg-green-100",
    "bg-red-50": "bg-red-50",
    "bg-red-100": "bg-red-100",
  },

  // Border colors
  border: {
    "border-gray-200": "border-gray-200",
    "border-gray-300": "border-gray-300",
    "border-gray-400": "border-gray-400",
    "border-blue-300": "border-blue-300",
    "border-blue-500": "border-blue-500",
    "border-green-300": "border-green-300",
    "border-green-500": "border-green-500",
    "border-red-300": "border-red-300",
    "border-red-500": "border-red-500",
  },

  // Border radius
  rounded: {
    "rounded-none": "rounded-none",
    "rounded-sm": "rounded-sm",
    rounded: "rounded",
    "rounded-md": "rounded-md",
    "rounded-lg": "rounded-lg",
    "rounded-xl": "rounded-xl",
    "rounded-2xl": "rounded-2xl",
    "rounded-full": "rounded-full",
  },

  // Text colors
  text: {
    "text-gray-900": "text-gray-900",
    "text-gray-700": "text-gray-700",
    "text-gray-500": "text-gray-500",
    "text-blue-600": "text-blue-600",
    "text-blue-700": "text-blue-700",
    "text-green-600": "text-green-600",
    "text-green-700": "text-green-700",
    "text-red-600": "text-red-600",
    "text-red-700": "text-red-700",
  },

  // Width
  width: {
    "w-auto": "w-auto",
    "w-full": "w-full",
    "w-fit": "w-fit",
    "w-1/2": "w-1/2",
    "w-1/3": "w-1/3",
    "w-2/3": "w-2/3",
    "w-1/4": "w-1/4",
    "w-3/4": "w-3/4",
  },

  // Layout combinations
  layouts: {
    "Basic Card": "p-6 bg-white border border-gray-300 rounded-xl shadow-sm",
    "Hover Card":
      "p-6 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition-shadow",
    "Colored Card": "p-6 bg-blue-50 border border-blue-200 rounded-xl",
    "Error Card": "p-6 bg-red-50 border border-red-200 rounded-xl",
    "Success Card": "p-6 bg-green-50 border border-green-200 rounded-xl",
    Compact: "p-3 bg-white border border-gray-300 rounded-lg",
    Spacious: "p-8 bg-white border border-gray-300 rounded-2xl",
  },
};

// Helper function to create argTypes for className controls
export const createClassNameArgTypes = (
  presetKey?: keyof typeof tailwindPresets,
) => {
  const baseArgType = {
    control: "text",
    description: "Tailwind CSS classes to apply",
    table: {
      category: "Styling",
      type: { summary: "string" },
      defaultValue: { summary: "" },
    },
  };

  if (presetKey && tailwindPresets[presetKey]) {
    return {
      ...baseArgType,
      control: { type: "select" },
      options: Object.values(tailwindPresets[presetKey]),
    };
  }

  return baseArgType;
};

// Helper function to combine multiple Tailwind classes
export const combineClasses = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};
