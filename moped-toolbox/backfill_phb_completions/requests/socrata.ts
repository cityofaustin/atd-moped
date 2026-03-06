import { requireEnv } from "./env.ts";
import type { SocrataSignalRecord } from "../types.ts";

const SOCRATA_TOKEN = requireEnv("SOCRATA_TOKEN");

export async function makeSocrataRequest<T>(url: string): Promise<T> {
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

/**
 * Mostly copied from Moped editor code; transforms Socrata signal record into the shape needed for Moped feature_signals records
 */
export const socrataSignalRecordToFeatureSignalsRecord = (
  signal: SocrataSignalRecord,
) => {
  const featureSignalsRecord = {
    // MultiPoint coordinates are an array of arrays, so we wrap the coordinates
    geography: {
      ...signal.location,
      type: "MultiPoint",
      coordinates: [signal.location.coordinates],
    },
    knack_id: signal.id,
    location_name: signal.location_name.trim(),
    signal_type: signal.signal_type,
    signal_id: signal.signal_id,
  };

  return featureSignalsRecord;
};
