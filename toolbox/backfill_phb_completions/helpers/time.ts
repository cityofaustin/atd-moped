/**
 * Socrata returns a floating timestamp without timezone info and date only. So, we need to update to be
 * midnight central time and then convert to an ISO string for Hasura to store as a timestamptz.
 * See https://dev.socrata.com/docs/datatypes/floating_timestamp.html
 * Example input: "2023-01-15T00:00:00.000"
 * Example output: "2023-01-15T06:00:00.000Z" or "2023-01-15T05:00:00.000Z" depending on daylight savings time.
 */
export function toTimestamptz(floatingTimestamp: string): string {
  const dateStr = floatingTimestamp.split("T")[0];
  const centralMidnight = new Date(
    new Date(`${dateStr}T00:00:00`).toLocaleString("en-US", {
      timeZone: "America/Chicago",
    }),
  );
  return centralMidnight.toISOString();
}
