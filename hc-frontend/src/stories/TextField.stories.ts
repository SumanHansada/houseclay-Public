import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import TextField from "../base-components/TextField";

const meta = {
  title: "Base Components/TextField",
  component: TextField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    dataType: {
      control: { type: "select" },
      options: ["text", "number"],
    },
    required: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    onChange: { action: "changed" },
    onBlur: { action: "blurred" },
  },
  args: {
    name: "textField",
    value: "",
    onChange: fn(),
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Text Field",
    placeholder: "Enter text here",
  },
};

export const WithValue: Story = {
  args: {
    label: "Text Field",
    value: "Sample text",
    placeholder: "Enter text here",
  },
};

export const Required: Story = {
  args: {
    label: "Required Field",
    required: true,
    placeholder: "This field is required",
  },
};

export const WithError: Story = {
  args: {
    label: "Field with Error",
    value: "Invalid input",
    error: "This field has an error",
    placeholder: "Enter text here",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Field",
    value: "Cannot edit this",
    disabled: true,
    placeholder: "This field is disabled",
  },
};

export const NumberType: Story = {
  args: {
    label: "Number Field",
    dataType: "number",
    value: 1000,
    placeholder: "Enter a number",
  },
};

export const WithPrefix: Story = {
  args: {
    label: "Field with Prefix",
    prefix: "₹",
    value: "1000",
    placeholder: "Enter amount",
  },
};

export const WithSuffix: Story = {
  args: {
    label: "Field with Suffix",
    suffix: "kg",
    value: "50",
    placeholder: "Enter weight",
  },
};

export const WithPrefixAndSuffix: Story = {
  args: {
    label: "Field with Prefix and Suffix",
    prefix: "$",
    suffix: "USD",
    value: "100",
    placeholder: "Enter amount",
  },
};

export const CustomStyling: Story = {
  args: {
    label: "Custom Styled Field",
    value: "Custom styled input",
    placeholder: "Enter text here",
    className:
      "border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
  },
};

export const CompactStyle: Story = {
  args: {
    label: "Compact Field",
    value: "Compact input",
    placeholder: "Enter text here",
    className: "p-2 text-sm border border-gray-300 rounded-lg",
  },
};

export const LargeStyle: Story = {
  args: {
    label: "Large Field",
    value: "Large input",
    placeholder: "Enter text here",
    className: "p-4 text-lg border-2 border-gray-300 rounded-xl",
  },
};
