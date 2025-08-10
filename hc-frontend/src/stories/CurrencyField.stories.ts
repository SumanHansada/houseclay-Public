import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import CurrencyField from "../base-components/CurrencyField";

const meta = {
  title: "Base Components/CurrencyField",
  component: CurrencyField,
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
    currencyFormat: {
      control: { type: "select" },
      options: ["en-IN", "en-US"],
    },
    onChange: { action: "changed" },
    onBlur: { action: "blurred" },
  },
  args: {
    name: "currencyField",
    value: 0,
    onChange: fn(),
  },
} satisfies Meta<typeof CurrencyField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Currency Field",
    placeholder: "Enter amount",
  },
};

export const WithValue: Story = {
  args: {
    label: "Currency Field",
    value: 1500,
    placeholder: "Enter amount",
  },
};

export const Required: Story = {
  args: {
    label: "Required Currency Field",
    required: true,
    placeholder: "This field is required",
  },
};

export const WithError: Story = {
  args: {
    label: "Currency Field with Error",
    value: -100,
    error: "Amount must be positive",
    placeholder: "Enter a positive amount",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Currency Field",
    value: 5000,
    disabled: true,
    placeholder: "This field is disabled",
  },
};

export const INR: Story = {
  args: {
    label: "Indian Rupees",
    currencyFormat: "en-IN",
    value: 50000,
    placeholder: "Enter amount in INR",
  },
};

export const USD: Story = {
  args: {
    label: "US Dollars",
    currencyFormat: "en-US",
    value: 1000,
    placeholder: "Enter amount in USD",
  },
};

export const EUR: Story = {
  args: {
    label: "Euros",
    currencyFormat: "en-US",
    value: 750,
    placeholder: "Enter amount in EUR",
  },
};

export const GBP: Story = {
  args: {
    label: "British Pounds",
    currencyFormat: "en-US",
    value: 600,
    placeholder: "Enter amount in GBP",
  },
};

export const LargeAmount: Story = {
  args: {
    label: "Large Amount",
    value: 1000000,
    placeholder: "Enter a large amount",
  },
};

export const DecimalAmount: Story = {
  args: {
    label: "Decimal Amount",
    value: 1234.56,
    placeholder: "Enter amount with decimals",
  },
};
