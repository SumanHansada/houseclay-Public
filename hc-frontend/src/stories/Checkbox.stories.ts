import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import Checkbox from "../base-components/Checkbox";

const meta = {
  title: "Base Components/Checkbox",
  component: Checkbox,
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
    columns: {
      control: { type: "select" },
      options: [1, 2, 3, 4],
    },
    withIcons: {
      control: { type: "boolean" },
    },
    alignment: {
      control: { type: "select" },
      options: ["start", "center", "end"],
    },
    onChange: { action: "changed" },
    onBlur: { action: "blurred" },
  },
  args: {
    name: "checkbox",
    value: [],
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
    onChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Select Options",
  },
};

export const WithSelectedValues: Story = {
  args: {
    label: "Select Options",
    value: ["option1", "option3"],
  },
};

export const Required: Story = {
  args: {
    label: "Required Selection",
    required: true,
  },
};

export const WithError: Story = {
  args: {
    label: "Selection with Error",
    error: "Please select at least one option",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Selection",
    value: ["option1"],
    disabled: true,
  },
};

export const SingleColumn: Story = {
  args: {
    label: "Single Column Layout",
    columns: 1,
  },
};

export const TwoColumns: Story = {
  args: {
    label: "Two Column Layout",
    columns: 2,
  },
};

export const FourColumns: Story = {
  args: {
    label: "Four Column Layout",
    columns: 4,
  },
};

export const StartAlignment: Story = {
  args: {
    label: "Start Alignment",
    alignment: "start",
  },
};

export const EndAlignment: Story = {
  args: {
    label: "End Alignment",
    alignment: "end",
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
    ],
    columns: 4,
  },
};

export const WithIcons: Story = {
  args: {
    label: "Options with Icons",
    withIcons: true,
    options: [
      { value: "home", label: "Home", icon: "🏠" },
      { value: "work", label: "Work", icon: "💼" },
      { value: "school", label: "School", icon: "🎓" },
    ],
  },
};

export const CustomColor: Story = {
  args: {
    label: "Custom Selected Color",
    selectedColor: "border-blue-500",
    value: ["option1"],
  },
};
