import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import SelectDropdown from "../base-components/SelectDropdown";

const meta = {
  title: "Base Components/SelectDropdown",
  component: SelectDropdown,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    required: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "outline"],
    },
    dropdownWidth: {
      control: { type: "select" },
      options: ["auto", "full", "fit"],
    },
    containerClassName: {
      control: "text",
      description: "Container CSS classes",
    },
    labelClassName: {
      control: "text",
      description: "Label CSS classes",
    },
    buttonClassName: {
      control: "text",
      description: "Button CSS classes",
    },
    dropdownClassName: {
      control: "text",
      description: "Dropdown CSS classes",
    },
    onChange: { action: "changed" },
    onBlur: { action: "blurred" },
  },
  args: {
    name: "selectDropdown",
    id: "selectDropdown",
    value: "",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
    onChange: fn(),
  },
} satisfies Meta<typeof SelectDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Select Option",
    placeholder: "Choose an option",
  },
};

export const WithValue: Story = {
  args: {
    label: "Select Option",
    value: "option2",
    placeholder: "Choose an option",
  },
};

export const Required: Story = {
  args: {
    label: "Required Selection",
    required: true,
    placeholder: "This field is required",
  },
};

export const WithError: Story = {
  args: {
    label: "Selection with Error",
    error: "Please select an option",
    placeholder: "Choose an option",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Selection",
    value: "option1",
    disabled: true,
    placeholder: "This field is disabled",
  },
};

export const Small: Story = {
  args: {
    label: "Small Dropdown",
    size: "sm",
    placeholder: "Small dropdown",
  },
};

export const Large: Story = {
  args: {
    label: "Large Dropdown",
    size: "lg",
    placeholder: "Large dropdown",
  },
};

export const Secondary: Story = {
  args: {
    label: "Secondary Variant",
    variant: "secondary",
    placeholder: "Secondary style",
  },
};

export const Outline: Story = {
  args: {
    label: "Outline Variant",
    variant: "outline",
    placeholder: "Outline style",
  },
};

export const ManyOptions: Story = {
  args: {
    label: "Many Options",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
      { value: "option4", label: "Option 4" },
      { value: "option5", label: "Option 5" },
      { value: "option6", label: "Option 6" },
      { value: "option7", label: "Option 7" },
      { value: "option8", label: "Option 8" },
      { value: "option9", label: "Option 9" },
      { value: "option10", label: "Option 10" },
    ],
    placeholder: "Choose from many options",
  },
};

export const BooleanOptions: Story = {
  args: {
    label: "Boolean Options",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
    value: true,
    placeholder: "Select Yes or No",
  },
};

export const NumberOptions: Story = {
  args: {
    label: "Number Options",
    options: [
      { value: 1, label: "One" },
      { value: 2, label: "Two" },
      { value: 3, label: "Three" },
    ],
    value: 2,
    placeholder: "Select a number",
  },
};

export const CustomStyling: Story = {
  args: {
    label: "Custom Styled Dropdown",
    placeholder: "Choose an option",
    containerClassName: "w-full relative",
    labelClassName: "text-blue-700 font-semibold mb-2",
    buttonClassName:
      "flex justify-between items-center w-full p-3 border-2 border-blue-300 rounded-xl text-left hover:border-blue-400 focus:border-blue-500",
    dropdownClassName:
      "absolute z-10 mt-1 bg-white border-2 border-blue-300 rounded-xl shadow-lg max-h-60 overflow-auto",
  },
};

export const CompactStyle: Story = {
  args: {
    label: "Compact Dropdown",
    placeholder: "Choose an option",
    buttonClassName:
      "flex justify-between items-center w-full p-2 border border-gray-300 rounded-lg text-sm",
    dropdownClassName:
      "absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-md max-h-40 overflow-auto",
  },
};

export const LargeStyle: Story = {
  args: {
    label: "Large Dropdown",
    placeholder: "Choose an option",
    buttonClassName:
      "flex justify-between items-center w-full p-4 border-2 border-gray-300 rounded-xl text-lg",
    dropdownClassName:
      "absolute z-10 mt-1 bg-white border-2 border-gray-300 rounded-xl shadow-xl max-h-80 overflow-auto",
  },
};
