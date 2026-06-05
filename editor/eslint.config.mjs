import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

/**
 * This file's extension is updated to .mjs to workaround ESLint's MODULE_TYPELESS_PACKAGE_JSON warning.
 * We could use a package.json with "type": "module" (https://nodejs.org/api/packages.html#type) but this
 * is a project-wide change that needs more evaluation.
 */

export default tseslint.config(
  {
    ignores: [
      "build",
      "dist",
      "coverage",
      "node_modules",
      "**/*.test.{js,jsx,ts,tsx}",
      "**/test/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      /* Flag anything that violates the rules of hooks */
      reactHooks.configs.flat.recommended,
      /* Flag anything that could break Vite's HMR (Hot Module Replacement) */
      reactRefresh.configs.vite,
      /* Disable any rules that would conflict with Prettier formatting, needs to be last */
      prettier,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      /* Recognize certain global variables like window so ESLint doesn't flag them as undefined */
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
        },
      ],
      "no-duplicate-imports": "error",
      /* Needed to surface undefined (like missing imports) that would be caught in TS code by tsconfig */
      "no-undef": "error",
    },
  }
);
