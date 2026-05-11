import { defineConfig } from "vite";
import fs from "node:fs/promises";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

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
    /* Use SSL for Cognito sign-in using callback set up with port 3000 in local development;
    tsconfigPaths so we respect the import path aliases set in tsconfig.json */
    plugins: [react(), basicSsl(), tsconfigPaths()],
    server: {
      https: true,
      port: 3000,
    },
    // TODO: Remove this and rename all .js files to .jsx
    esbuild: {
      loader: "jsx",
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [
          {
            name: "load-js-files-as-jsx",
            setup(build) {
              build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
                loader: "jsx",
                contents: await fs.readFile(args.path, "utf8"),
              }));
            },
          },
        ],
      },
    },
  };
});
