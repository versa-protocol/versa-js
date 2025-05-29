import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  // Base JavaScript config
  js.configs.recommended,

  // Global settings for all files
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2022,
        React: "readonly", // For Next.js JSX
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },

  // TypeScript files configuration
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "prefer-const": "warn", // Downgrade to warning
      "no-unused-vars": [
        "warn", // Downgrade to warning
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": "warn",
      "no-debugger": "error",
    },
  },

  // JavaScript files
  {
    files: ["**/*.{js,jsx}"],
    rules: {
      "prefer-const": "warn", // Downgrade to warning
      "no-unused-vars": [
        "warn", // Downgrade to warning
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": "warn",
      "no-debugger": "error",
    },
  },

  // PDFGen package - needs DOM types
  {
    files: ["**/packages/pdfgen/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        HeadersInit: "readonly",
        RequestInit: "readonly",
        ResponseInit: "readonly",
      },
    },
  },

  // Test files - more lenient rules
  {
    files: ["**/*.{test,spec}.{js,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-console": "off",
    },
  },

  // Ignore patterns
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.next/**",
      "**/coverage/**",
      "**/storybook-static/**",
      "**/next-env.d.ts",
      "**/*.config.{js,ts}",
    ],
  },
];
