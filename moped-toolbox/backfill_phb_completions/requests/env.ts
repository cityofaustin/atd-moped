export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`Error: Missing required environment variable: ${key}`);
    process.exit(1);
  }
  return value;
}
