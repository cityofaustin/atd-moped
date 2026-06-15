import * as fs from "fs";
import * as readline from "readline";
import type {
  LeftTurnTreatmentRecord,
  MopedComponent,
  MopedProjectInsertResponse,
  SocrataTrafficSignalResponse,
} from "./types.ts";
import { makeSocrataRequest } from "./helpers/socrata.ts";
import { addProject, makeHasuraRequest } from "./helpers/graphql.ts";

const dataFilePath = "./data/data.csv";
if (!fs.existsSync(dataFilePath)) {
  console.error(
    `Data file not found at path: ${dataFilePath}. Please ensure the left turn treatment data CSV is placed in the data/ directory.`,
  );
  process.exit(1);
}

const DRY_RUN = process.argv.includes("--dry-run");
const SOCRATA_URL =
  "https://data.austintexas.gov/api/v3/views/p53x-x73x/query.json";
const TRAFFIC_SIGNAL_FILTER_STRING = encodeURIComponent(
  `
SELECT signal_id,location_name,location,signal_type,id,turn_on_date
WHERE
  caseless_eq(\`signal_type\`, "TRAFFIC")
ORDER BY \`signal_id\` ASC
`.trim(),
);

async function readCsvData(): Promise<LeftTurnTreatmentRecord[]> {
  // No need to capture information about recommendation or direction
  const fileStream = fs.createReadStream(dataFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const rows: string[][] = [];
  let headers: string[] = [];

  for await (const line of rl) {
    const cols = line.split(",");
    if (!headers.length) {
      // Handle UTF-8 BOM present in first header of Power BI .csv export
      headers = cols.map((h) => h.trim().replace(/^\uFEFF/, ""));
      continue;
    }
    rows.push(cols);
  }

  const idx = (name: string) => headers.indexOf(name);
  return rows.map((cols) => ({
    signalId: parseInt(cols[idx("Signal ID")] ?? null),
    recommendation: cols[idx("Recommendation")] ?? null,
    implementationDate: cols[idx("Implementation Date")] ?? null,
  }));
}

function filterLeftTurnTreatments(
  treatments: LeftTurnTreatmentRecord[],
): LeftTurnTreatmentRecord[] {
  treatments = treatments.filter((treatment) => treatment.signalId !== null);
  treatments = treatments.filter((treatment) => treatment.implementationDate);
  treatments = treatments.filter(
    (treatment) => treatment.recommendation.toLowerCase() !== "no change",
  );

  return treatments;
}

function deduplicateLeftTurnTreatmentsBy(
  treatments: LeftTurnTreatmentRecord[],
): LeftTurnTreatmentRecord[] {
  // Need to de-duplicate by signal ids on same date that represent different directions at the same intersection
  // Create multiple components for treatments on the same signal on different days. Signal ID 920 appears to be the only case with treatments for different directions in 2023 and 2024
  return;
}

function createMopedComponents(
  trafficSignals: SocrataTrafficSignalResponse,
  leftTurnTreatments: LeftTurnTreatmentRecord[],
): MopedComponent[] {
  // Component type (Full): Signal - Traffic
  // Component work type: Mod
  // Component subcomponent: Protected left-turn phase
  // Component phase: Complete
  // Component phase completion date: Implementation date from Left Turn Analysis data linked above (can export as csv from Power BI dasboard)

  // const componentPayload = phbsToInsert.map((phb) => ({
  //   component_id: 16, // Signal - PHB component ID
  //   location_description: `${phb.signal_id}: ${phb.location_name.trim()}`,
  //   phase_id: 11, // Complete phase
  //   completion_date: toTimestamptz(phb.turn_on_date),
  //   feature_signals: {
  //     data: [socrataSignalRecordToFeatureSignalsRecord(phb)],
  //   },
  //   moped_proj_component_work_types: {
  //     data: [{ work_type_id: 7 }], // "New" work type
  //   },
  // }));
  return;
}

async function main() {
  console.log(
    `Starting left turn treatment backfill process ${DRY_RUN ? "(DRY RUN)" : ""}...`,
  );

  /* 1. Request filtered Data Tracker signal data (ODP) to backfill insert components into Moped */
  let trafficSignals = await makeSocrataRequest<SocrataTrafficSignalResponse>(
    `${SOCRATA_URL}?query=${TRAFFIC_SIGNAL_FILTER_STRING}`,
  );

  /** 2. Collect left-turn treatments from Austin Left Turn Treatment Evaluation dashboard
   ** See https://app.powerbigov.us/groups/me/reports/746b8c1d-d0e5-45a8-a661-bea2fd331764/ReportSectiond62e57c030a1e78218a9
   */
  const leftTurnTreatments = await readCsvData();
  console.log(leftTurnTreatments.length);
  const filteredTreatments = filterLeftTurnTreatments(leftTurnTreatments);
  console.log(filteredTreatments.length);
  return;
  const deduplicatedLeftTurnTreatments =
    deduplicateLeftTurnTreatmentsBy(filteredTreatments);

  console.log(
    `Found ${filteredTreatments.length} left-turn treatments to backfill.`,
  );

  /* 3. Create traffic signal components with protected left-turn phase subcomponents to insert */
  const componentsToInsert = createMopedComponents(
    trafficSignals,
    filteredTreatments,
  );

  /*  4. Create traffic signals project and insert traffic signals as components in that project */
  try {
    if (DRY_RUN) {
      console.log(
        `[DRY RUN] Would insert ${componentsToInsert.length} new traffic signals with left-turn treatments into a new Moped project.`,
      );
    } else {
      const projectData = await makeHasuraRequest<MopedProjectInsertResponse>(
        addProject,
        {
          object: {
            project_name: "Vision Zero Left Turn Treatment Statistics",
            project_description: `Backfill of traffic signals from Data Tracker with left-turn treatments subcomponents with completion
            date using implementation dates as completion dates from Austin Left Turn Treatment Evaluation Power BI dashboard 
            (https://app.powerbigov.us/groups/me/reports/746b8c1d-d0e5-45a8-a661-bea2fd331764/ReportSectiond62e57c030a1e78218a9)`,
            moped_proj_components: { data: componentsToInsert },
          },
        },
      );
      console.log(
        `Inserted ${componentsToInsert.length} new traffic signals from Data Tracker into a new Moped project #${projectData.insert_moped_project_one.project_id}.`,
      );
    }
  } catch (error) {
    console.error(
      "An error occurred while creating the left-turn treatment project:",
      error,
    );
  }

  console.log("Left-turn treatment backfill done.");
}

main().catch((error) => {
  console.error(
    "An error occurred during the left-turn treatment backfill process:",
    error,
  );
  process.exit(1);
});
