import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { tailwindPresets } from "../../.storybook/tailwind-utils";

// Sample component for Tailwind playground
interface TailwindPlaygroundComponentProps {
  className?: string;
  text?: string;
  children?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const TailwindPlaygroundComponent: React.FC<
  TailwindPlaygroundComponentProps
> = ({ className = "", text = "Sample Text", children, ...props }) => {
  return (
    <div className={className} {...props}>
      <h3 className="text-lg font-semibold mb-2">{text}</h3>
      {children || (
        <p>This is a playground component to test Tailwind CSS classes.</p>
      )}
    </div>
  );
};

const meta = {
  title: "Tailwind CSS/Playground",
  component: TailwindPlaygroundComponent,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A playground component to test and experiment with Tailwind CSS classes directly in Storybook controls.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description:
        "Tailwind CSS classes to apply (you can type any Tailwind classes here)",
      table: {
        category: "Styling",
        type: { summary: "string" },
        defaultValue: { summary: "" },
      },
    },
    text: {
      control: "text",
      description: "Text to display in the component",
      table: {
        category: "Content",
      },
    },
    // Preset controls for quick styling
    presetLayout: {
      control: { type: "select" },
      options: Object.keys(tailwindPresets.layouts),
      description: "Quick layout presets",
      table: {
        category: "Presets",
      },
    },
    presetBackground: {
      control: { type: "select" },
      options: Object.keys(tailwindPresets.background),
      description: "Background color presets",
      table: {
        category: "Presets",
      },
    },
    presetBorder: {
      control: { type: "select" },
      options: Object.keys(tailwindPresets.border),
      description: "Border color presets",
      table: {
        category: "Presets",
      },
    },
    presetRounded: {
      control: { type: "select" },
      options: Object.keys(tailwindPresets.rounded),
      description: "Border radius presets",
      table: {
        category: "Presets",
      },
    },
    presetSpacing: {
      control: { type: "select" },
      options: Object.keys(tailwindPresets.spacing),
      description: "Padding presets",
      table: {
        category: "Presets",
      },
    },
    presetText: {
      control: { type: "select" },
      options: Object.keys(tailwindPresets.text),
      description: "Text color presets",
      table: {
        category: "Presets",
      },
    },
  },
  args: {
    text: "Tailwind Playground",
    className: "",
  },
} satisfies Meta<typeof TailwindPlaygroundComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "Default Component",
  },
};

export const WithCustomClasses: Story = {
  args: {
    text: "Custom Styled Component",
    className: "p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-sm",
  },
};

export const InteractivePlayground: Story = {
  args: {
    text: "Interactive Playground",
    className: "p-4 bg-white border border-gray-300 rounded-lg",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use the controls panel to modify Tailwind classes in real-time. Try different combinations of presets or type custom classes directly.",
      },
    },
  },
};

export const PresetExamples: Story = {
  render: (args) => {
    const presetClasses: string[] = [
      tailwindPresets.layouts["Basic Card"],
      tailwindPresets.layouts["Colored Card"],
      tailwindPresets.layouts["Error Card"],
      tailwindPresets.layouts["Success Card"],
      tailwindPresets.layouts["Compact"],
      tailwindPresets.layouts["Spacious"],
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
        {presetClasses.map((classes: string, index: number) => (
          <TailwindPlaygroundComponent
            key={index}
            {...args}
            className={classes}
            text={`Preset ${index + 1}`}
          />
        ))}
      </div>
    );
  },
  parameters: {
    layout: "padded",
  },
};

export const ColorExamples: Story = {
  render: (args) => {
    const colorClasses: string[] = [
      "p-4 bg-white border border-gray-300 rounded-lg",
      "p-4 bg-blue-50 border border-blue-200 rounded-lg",
      "p-4 bg-green-50 border border-green-200 rounded-lg",
      "p-4 bg-red-50 border border-red-200 rounded-lg",
      "p-4 bg-yellow-50 border border-yellow-200 rounded-lg",
      "p-4 bg-purple-50 border border-purple-200 rounded-lg",
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
        {colorClasses.map((classes: string, index: number) => (
          <TailwindPlaygroundComponent
            key={index}
            {...args}
            className={classes}
            text={`Color ${index + 1}`}
          />
        ))}
      </div>
    );
  },
  parameters: {
    layout: "padded",
  },
};

export const ResponsiveExample: Story = {
  args: {
    text: "Responsive Design",
    className:
      "p-4 md:p-6 lg:p-8 bg-white border border-gray-300 rounded-lg md:rounded-xl lg:rounded-2xl text-sm md:text-base lg:text-lg",
  },
  parameters: {
    docs: {
      description: {
        story:
          "This example shows responsive Tailwind classes. Resize the viewport to see the changes.",
      },
    },
  },
};

export const HoverEffects: Story = {
  args: {
    text: "Hover Effects",
    className:
      "p-6 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer",
  },
  parameters: {
    docs: {
      description: {
        story: "Hover over this component to see the transition effects.",
      },
    },
  },
};
