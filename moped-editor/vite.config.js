import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig(() => {
  return {
    base: "/moped/",
    build: {
      outDir: "build/moped",
    },
    /* Use SSL for Cognito sign-in using callback set up with port 3000 in local development */
    plugins: [react(), basicSsl()],
    server: {
      https: true,
      port: 3000,
    },
    // TODO: Remove this and rename all .js files to .jsx
    esbuild: {
      loader: "jsx",
      include: /src\/.*\.jsx?$/,
      // loader: "tsx",
      // include: /src\/.*\.[tj]sx?$/,
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
