/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Deployment environment set in .env.* files and netlify.toml */
  readonly VITE_APP_ENV: "local" | "preview" | "staging" | "production";
}
