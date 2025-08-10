import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import RadioGroup from "../base-components/RadioGroup";

const meta = {
  title: "Base Components/RadioGroup",
  component: RadioGroup,
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
    onChange: { action: "changed" },
    onBlur: { action: "blurred" },
  },
  args: {
    name: "radioGroup",
    value: "",
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
    onChange: fn(),
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Select One Option",
  },
};

export const WithSelectedValue: Story = {
  args: {
    label: "Select One Option",
    value: "option2",
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
    error: "Please select an option",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Selection",
    value: "option1",
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
      { value: "male", label: "Male", icon: "👨" },
      { value: "female", label: "Female", icon: "👩" },
      { value: "other", label: "Other", icon: "👤" },
    ],
  },
};

export const CustomColor: Story = {
  args: {
    label: "Custom Selected Color",
    selectedColor: "border-green-500",
    value: "option1",
  },
};

export const BooleanOptions: Story = {
  args: {
    label: "Yes/No Selection",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
    value: "yes",
  },
};
