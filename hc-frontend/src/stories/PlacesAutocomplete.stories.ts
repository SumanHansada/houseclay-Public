import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import PlacesAutocomplete from "../base-components/PlacesAutocomplete";

const meta = {
  title: "Base Components/PlacesAutocomplete",
  component: PlacesAutocomplete,
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
    onLocationSelect: { action: "location selected" },
  },
  args: {
    name: "placesAutocomplete",
    id: "placesAutocomplete",
    value: "",
    onChange: fn(),
  },
} satisfies Meta<typeof PlacesAutocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Location",
    placeholder: "Search for a place",
  },
};

export const WithValue: Story = {
  args: {
    label: "Location",
    value: "Bangalore, Karnataka, India",
    placeholder: "Search for a place",
  },
};

export const Required: Story = {
  args: {
    label: "Required Location",
    required: true,
    placeholder: "This field is required",
  },
};

export const WithError: Story = {
  args: {
    label: "Location with Error",
    value: "Invalid location",
    error: "Please select a valid location",
    placeholder: "Search for a place",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Location Field",
    value: "Bangalore, Karnataka, India",
    disabled: true,
    placeholder: "This field is disabled",
  },
};

export const CustomPlaceholder: Story = {
  args: {
    label: "Enter Address",
    placeholder: "Type your address here...",
  },
};

export const WithLocationCallback: Story = {
  args: {
    label: "Location with Callback",
    placeholder: "Search for a place",
    onLocationSelect: fn(),
  },
};

export const CustomStyling: Story = {
  args: {
    label: "Custom Styled Location",
    placeholder: "Search for a place",
    containerClassName: "w-full relative",
    labelClassName: "block text-sm font-medium text-blue-700 mb-1",
    inputClassName:
      "w-full p-3 border-2 border-blue-300 rounded-xl focus:border-blue-500",
    dropdownClassName:
      "absolute z-10 mt-1 py-1 w-full bg-white border-2 border-blue-300 rounded-xl shadow-lg max-h-60 overflow-auto",
    dropdownItemClassName:
      "py-2 px-3 hover:bg-blue-100 cursor-pointer flex items-center",
    errorClassName: "mt-1 text-sm text-red-600",
  },
};

export const Compact: Story = {
  args: {
    label: "Compact Location Field",
    placeholder: "Search places",
    inputClassName: "w-full p-2 border rounded-lg text-sm",
    dropdownClassName:
      "absolute z-10 mt-1 py-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-auto",
    dropdownItemClassName:
      "py-1 px-2 hover:bg-gray-100 cursor-pointer flex items-center text-sm",
  },
};

export const Large: Story = {
  args: {
    label: "Large Location Field",
    placeholder: "Search for a place",
    inputClassName: "w-full p-4 border-2 border-gray-300 rounded-xl text-lg",
    dropdownClassName:
      "absolute z-10 mt-1 py-2 w-full bg-white border-2 border-gray-300 rounded-xl shadow-lg max-h-80 overflow-auto",
    dropdownItemClassName:
      "py-3 px-4 hover:bg-gray-100 cursor-pointer flex items-center text-lg",
  },
};
