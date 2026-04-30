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
  };
});
