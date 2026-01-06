import { FlatCompat } from "@eslint/eslintrc";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
  ),
  {
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "simple-import-sort": simpleImportSortPlugin,
      "unused-imports": unusedImportsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Remove unused variables and imports
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Ensure correct hook usage
      "react-hooks/exhaustive-deps": "warn",

      // Sort imports and exports
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // Circular dependency check
      "import/no-cycle": ["error", { maxDepth: Infinity }],

      "react/react-in-jsx-scope": "off", // Disable the error for missing React in scope
      "react/prop-types": "off", // Disable prop-types rule since TypeScript handles it
      "prettier/prettier": "error", // Enable prettier errors
    },
    ignores: [
      ".next/",
      "./storybook/",
      "node_modules/",
      "storybook-static/",
      "dist/",
      "build/",
      "out/",
    ],
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];

export default eslintConfig;
