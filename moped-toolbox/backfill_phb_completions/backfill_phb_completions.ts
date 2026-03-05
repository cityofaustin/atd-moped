import { PHB_FILTER_STRING, SOCRATA_URL } from "./config.ts";

const SOCRATA_TOKEN = process.env.SOCRATA_TOKEN;

if (!SOCRATA_TOKEN) {
  console.error(
    "Error: SOCRATA_TOKEN environment variable is not set. Please set it in a .env file or your environment.",
  );
  process.exit(1);
}

async function requestPHBData() {
  // Step 1: Request Data Tracker PHB data (ODP)
  // https://data.austintexas.gov/Transportation-and-Mobility/Traffic-Signals-and-Pedestrian-Signals/p53x-x73x/about_data
  console.log("Requesting PHB data from Data Tracker ODP...");

  try {
    const res = await fetch(`${SOCRATA_URL}?query=${PHB_FILTER_STRING}`, {
      headers: {
        Accept: "application/geo+json",
        "X-App-Token": process.env.SOCRATA_TOKEN || "",
      },
    });
    if (!res.ok) {
      throw new Error(
        `Failed to fetch PHB data: ${res.status} ${res.statusText}`,
      );
    }

    const data = await res.json();
    console.log(`Found ${data.length} PHB records from Data Tracker ODP.`);
    // console.log("Sample PHB record:", data);
    return data;
  } catch (error) {
    console.error("An error occurred while requesting PHB data:", error);
    throw error;
  }
}

async function requestMopedComponents() {
  // Step 2: Query Moped components with missing PHB data
  console.log("Querying Moped components with missing PHB data...");
}

async function backfillMopedComponents() {
  // Step 3: Backfill existin Moped component with Data Tracker data
  console.log("Backfilling Moped components with missing PHB data...");
}

async function fillMissingPHBsIntoNewProject() {
  // Step 4: Insert PHBs not already in Moped into new project
  console.log("Filling missing PHBs into new project...");
}

async function main() {
  console.log("Starting PHB backfill process...");
  const phbData = await requestPHBData();
}

main().catch((error) => {
  console.error("An error occurred during the PHB backfill process:", error);
  process.exit(1);
});
