import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import NumberField from "../base-components/NumberField";

const meta = {
  title: "Base Components/NumberField",
  component: NumberField,
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
    min: {
      control: { type: "number" },
    },
    max: {
      control: { type: "number" },
    },
    step: {
      control: { type: "number" },
    },
    onChange: { action: "changed" },
    onBlur: { action: "blurred" },
  },
  args: {
    name: "numberField",
    value: 0,
    onChange: fn(),
  },
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Number Field",
  },
};

export const WithValue: Story = {
  args: {
    label: "Number Field",
    value: 42,
  },
};

export const Required: Story = {
  args: {
    label: "Required Number Field",
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: "Number Field with Error",
    value: -5,
    error: "Value must be positive",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Number Field",
    value: 100,
    disabled: true,
  },
};

export const WithMinMax: Story = {
  args: {
    label: "Number Field with Min/Max",
    min: 0,
    max: 100,
    value: 50,
  },
};

export const WithStep: Story = {
  args: {
    label: "Number Field with Step",
    step: 0.5,
    value: 10.5,
  },
};

export const Decimal: Story = {
  args: {
    label: "Decimal Number Field",
    step: 0.01,
    value: 3.14,
  },
};

export const LargeNumber: Story = {
  args: {
    label: "Large Number Field",
    value: 1000000,
  },
};
