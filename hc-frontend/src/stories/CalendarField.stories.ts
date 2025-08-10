import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import CalendarField from "../base-components/CalendarField";

const meta = {
  title: "Base Components/CalendarField",
  component: CalendarField,
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
    showPrevNextYear: {
      control: { type: "boolean" },
    },
    dateFormat: {
      control: { type: "text" },
    },
    onChange: { action: "changed" },
    onBlur: { action: "blurred" },
  },
  args: {
    name: "calendarField",
    value: "",
    onChange: fn(),
  },
} satisfies Meta<typeof CalendarField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Select Date",
    placeholder: "YYYY-MM-DD",
  },
};

export const WithValue: Story = {
  args: {
    label: "Select Date",
    value: "2024-12-25",
    placeholder: "YYYY-MM-DD",
  },
};

export const Required: Story = {
  args: {
    label: "Required Date",
    required: true,
    placeholder: "This field is required",
  },
};

export const WithError: Story = {
  args: {
    label: "Date with Error",
    value: "invalid-date",
    error: "Please enter a valid date",
    placeholder: "YYYY-MM-DD",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Date Field",
    value: "2024-12-25",
    disabled: true,
    placeholder: "This field is disabled",
  },
};

export const CustomDateFormat: Story = {
  args: {
    label: "Custom Date Format",
    dateFormat: "MM/dd/yyyy",
    value: "12/25/2024",
    placeholder: "MM/DD/YYYY",
  },
};

export const WithYearNavigation: Story = {
  args: {
    label: "With Year Navigation",
    showPrevNextYear: true,
    placeholder: "YYYY-MM-DD",
  },
};

export const LongDateFormat: Story = {
  args: {
    label: "Long Date Format",
    dateFormat: "EEEE, MMMM do, yyyy",
    value: "2024-12-25",
    placeholder: "Day, Month Date, Year",
  },
};

export const ShortDateFormat: Story = {
  args: {
    label: "Short Date Format",
    dateFormat: "dd/MM/yy",
    value: "25/12/24",
    placeholder: "DD/MM/YY",
  },
};

export const FutureDate: Story = {
  args: {
    label: "Future Date",
    value: "2025-06-15",
    placeholder: "Select a future date",
  },
};

export const PastDate: Story = {
  args: {
    label: "Past Date",
    value: "2020-01-01",
    placeholder: "Select a past date",
  },
};
