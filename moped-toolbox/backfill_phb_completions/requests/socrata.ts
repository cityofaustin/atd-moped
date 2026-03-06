import { requireEnv } from "./env.ts";

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
 * Sets required fields so that a Knack traffic signal record can be inserted into the feature_signals table
 * @param {Object} signal - A GeoJSON feature or a falsey object (e.g. "" from empty input)
 * @return {Object} A geojson feature collection with the signal feature or 0 features
 */
// export const knackSignalRecordToFeatureSignalsRecord = (signal) => {
//   if (signal && signal?.properties && signal?.geometry) {
//     const featureSignalsRecord = {
//       // MultiPoint coordinates are an array of arrays, so we wrap the coordinates
//       geography: {
//         ...signal.geometry,
//         type: "MultiPoint",
//         coordinates: [signal.geometry.coordinates],
//       },
//       knack_id: signal.properties.id,
//       location_name: signal.properties.location_name,
//       signal_type: signal.properties.signal_type,
//       signal_id: signal.properties.signal_id,
//     };

//     return featureSignalsRecord;
//   }
// };
