import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

/* Date and time tests assert Austin local times, so they don't depend on the machine's time zone */
process.env.TZ = "America/Chicago";

/**
 * Separate from vite.config.js so Vitest does not pull SSL, checker, or
 * GraphQL codegen plugins used by the local app server.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
  },
});
