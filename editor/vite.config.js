import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

export default defineConfig(() => {
  return {
    base: "/moped/",
    /* Define global variables for AWS Amplify v5 */
    define: {
      global: "globalThis",
      process: { env: {} },
    },
    build: {
      outDir: "build/moped",
    },
    /* Use SSL for Cognito sign-in using callback set up with port 3000 in local development */
    plugins: [
      react(),
      basicSsl(),
      checker({
        eslint: {
          // for example, lint .ts and .tsx
          lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
          dev: {
            logLevel: ["error"],
          },
          overlay: {
            initialIsOpen: true,
            position: "tl", // top-left
          },
        },
      }),
    ],
    resolve: {
      /* Respect the import path aliases set in tsconfig.json */
      tsconfigPaths: true,
    },
    server: {
      https: true,
      port: 3000,
    },
  };
});
