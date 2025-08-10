import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import TextArea from "../base-components/TextArea";

const meta = {
  title: "Base Components/TextArea",
  component: TextArea,
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
    rows: {
      control: { type: "number", min: 1, max: 20 },
    },
    onChange: { action: "changed" },
    onBlur: { action: "blurred" },
  },
  args: {
    name: "textArea",
    value: "",
    onChange: fn(),
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Text Area",
    placeholder: "Enter your text here...",
  },
};

export const WithValue: Story = {
  args: {
    label: "Text Area",
    value: "This is some sample text that has been entered into the text area.",
    placeholder: "Enter your text here...",
  },
};

export const Required: Story = {
  args: {
    label: "Required Text Area",
    required: true,
    placeholder: "This field is required",
  },
};

export const WithError: Story = {
  args: {
    label: "Text Area with Error",
    value: "Invalid input",
    error: "This field has an error",
    placeholder: "Enter your text here...",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Text Area",
    value: "This text area is disabled and cannot be edited.",
    disabled: true,
    placeholder: "This field is disabled",
  },
};

export const CustomRows: Story = {
  args: {
    label: "Text Area with Custom Rows",
    rows: 8,
    placeholder: "This text area has 8 rows",
  },
};

export const LongText: Story = {
  args: {
    label: "Text Area with Long Text",
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    rows: 6,
    placeholder: "Enter your text here...",
  },
};
