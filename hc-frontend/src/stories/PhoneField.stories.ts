import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import PhoneField from "../base-components/PhoneField";

const meta = {
  title: "Base Components/PhoneField",
  component: PhoneField,
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
    onChange: { action: "changed" },
    onBlur: { action: "blurred" },
  },
  args: {
    name: "phoneField",
    value: "",
    onChange: fn(),
  },
} satisfies Meta<typeof PhoneField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Phone Number",
    placeholder: "Enter phone number",
  },
};

export const WithValue: Story = {
  args: {
    label: "Phone Number",
    value: "+91 98765 43210",
    placeholder: "Enter phone number",
  },
};

export const Required: Story = {
  args: {
    label: "Required Phone Number",
    required: true,
    placeholder: "This field is required",
  },
};

export const WithError: Story = {
  args: {
    label: "Phone Number with Error",
    value: "123",
    error: "Please enter a valid phone number",
    placeholder: "Enter a valid phone number",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Phone Number",
    value: "+91 98765 43210",
    disabled: true,
    placeholder: "This field is disabled",
  },
};

export const InternationalFormat: Story = {
  args: {
    label: "International Phone Number",
    value: "+1 555 123 4567",
    placeholder: "Enter international phone number",
  },
};

export const IndianFormat: Story = {
  args: {
    label: "Indian Phone Number",
    value: "+91 98765 43210",
    placeholder: "Enter Indian phone number",
  },
};

export const ShortNumber: Story = {
  args: {
    label: "Short Phone Number",
    value: "9876543210",
    placeholder: "Enter phone number without country code",
  },
};
