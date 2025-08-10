import "../src/app/globals.css";

import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import type { Preview } from "@storybook/react";
import React from "react";

// Decorator to add Tailwind CSS class controls
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withTailwindClass = (Story: React.ComponentType, context: any) => {
  const { className = "" } = context.args;

  return React.createElement("div", { className }, React.createElement(Story));
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
    docs: {
      source: {
        state: "open",
      },
    },
  },
  decorators: [withTailwindClass],
  argTypes: {
    className: {
      control: "text",
      description: "Tailwind CSS classes to apply to the component wrapper",
      table: {
        category: "Styling",
        type: { summary: "string" },
        defaultValue: { summary: "" },
      },
    },
  },
};

export default preview;
