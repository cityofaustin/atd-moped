import { requireEnv } from "./env.ts";

const SOCRATA_TOKEN = requireEnv("SOCRATA_TOKEN");

export async function makeSocrataRequest(url: string) {
  console.log("Requesting data from Socrata...");

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-App-Token": SOCRATA_TOKEN,
      },
    });
    if (!res.ok) {
      throw new Error(
        `Failed to fetch Socrata data: ${res.status} ${res.statusText}`,
      );
    }

    const data = await res.json();
    console.log(`Found ${data.length} records from Socrata.`);

    return data;
  } catch (error) {
    console.error("An error occurred while requesting Socrata data:", error);
    throw error;
  }
}
