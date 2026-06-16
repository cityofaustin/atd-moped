import * as fs from "fs";
import Papa from "papaparse";
import type {
  LeftTurnTreatmentRecord,
  MopedComponentPayload,
  MopedProjectInsertResponse,
  SocrataTrafficSignalRecord,
  SocrataTrafficSignalResponse,
} from "./types.ts";
import {
  makeSocrataRequest,
  socrataSignalRecordToFeatureSignalsRecord,
} from "./helpers/socrata.ts";
import { toTimestamptz } from "./helpers/time.ts";
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

/**
 * Read csv and handle Power BI export format, extra quotes, and whitespaces
 */
async function readCsvData(): Promise<LeftTurnTreatmentRecord[]> {
  const fileContent = fs.readFileSync(dataFilePath, "utf-8");
  const { data } = Papa.parse<Record<string, string>>(fileContent, {
    header: true,
    skipEmptyLines: true,
    quoteChar: '"',
    transformHeader: (h) => h.trim().replace(/^\uFEFF/, ""), // Power BI adds a BOM character to first header of csv
    transform: (value) => value.trim(),
  });

  return data.map((row) => ({
    signalId: parseInt(row["Signal ID"]),
    recommendation: row["Recommendation"],
    implementationDate: row["Implementation Date"],
  }));
}

/**
 * Filter out missing signal ids, implementation dates, and recommendations for no change to signal treatment
 */
function filterLeftTurnTreatments(
  treatments: LeftTurnTreatmentRecord[],
): LeftTurnTreatmentRecord[] {
  treatments = treatments.filter((treatment) => !isNaN(treatment.signalId));
  treatments = treatments.filter((treatment) => !!treatment.implementationDate);
  treatments = treatments.filter(
    (treatment) =>
      treatment.recommendation?.trim().toLowerCase() !== "no change",
  );

  return treatments;
}

/**
 * Collapse treatments for different directions on the same signal into the same day;
 * keep duplicate signals with treatments on different days
 */
function deduplicateLeftTurnTreatmentsBy(
  treatments: LeftTurnTreatmentRecord[],
): LeftTurnTreatmentRecord[] {
  const uniqueTreatmentsById: { [key: string]: LeftTurnTreatmentRecord } = {};
  treatments.forEach((treatment) => {
    const key = `${treatment.signalId}-${treatment.implementationDate}`;
    if (!uniqueTreatmentsById[key]) {
      uniqueTreatmentsById[key] = treatment;
    }
  });
  const deduplicatedTreatments: LeftTurnTreatmentRecord[] =
    Object.values(uniqueTreatmentsById);

  return deduplicatedTreatments;
}

function createMopedComponentsPayload(
  trafficSignals: SocrataTrafficSignalResponse,
  leftTurnTreatments: LeftTurnTreatmentRecord[],
): MopedComponentPayload[] {
  // Component type (Full): Signal - Traffic
  // Component work type: Mod
  // Component subcomponent: Protected left-turn phase
  // Component phase: Complete
  // Component phase completion date: Implementation date from Left Turn Analysis data linked above (can export as csv from Power BI dasboard)

  const componentsPayload = leftTurnTreatments
    .map((treatment) => {
      const signal: SocrataTrafficSignalRecord | undefined =
        trafficSignals.find(
          (signal) => signal.signal_id === treatment.signalId.toString(),
        );

      if (!signal) {
        console.warn(
          `No matching signal found in Socrata data for treatment with signal ID ${treatment.signalId}. This treatment will be skipped.`,
        );
        return null;
      }

      return {
        component_id: 18, // Signal - Traffic component ID
        location_description: `${signal?.signal_id}: ${signal?.location_name.trim()}`,
        phase_id: 11, // Complete phase
        completion_date: toTimestamptz(treatment.implementationDate),
        feature_signals: {
          data: [socrataSignalRecordToFeatureSignalsRecord(signal)],
        },
        // TODO: Add subcomponnent for protected left-turn phase to payload
        moped_proj_component_work_types: {
          data: [{ work_type_id: 6 }], // "Modification" work type
        },
      };
    })
    // Filter out treatments with no matching signal in Socrata data that were skipped
    .filter((component) => component !== null);

  return componentsPayload;
}

async function main() {
  console.log(
    `Starting left turn treatment backfill process ${DRY_RUN ? "(DRY RUN)" : ""}...`,
  );

  /* 1. Request filtered Data Tracker signal data (ODP) to backfill insert components into Moped */
  let trafficSignals = await makeSocrataRequest<SocrataTrafficSignalResponse>(
    `${SOCRATA_URL}?query=${TRAFFIC_SIGNAL_FILTER_STRING}`,
  );

  /* 2. Collect left-turn treatments from Austin Left Turn Treatment Evaluation dashboard export */
  const leftTurnTreatments = await readCsvData();
  const filteredTreatments = filterLeftTurnTreatments(leftTurnTreatments);
  const deduplicatedLeftTurnTreatments =
    deduplicateLeftTurnTreatmentsBy(filteredTreatments);
  console.log(
    `Found ${deduplicatedLeftTurnTreatments.length} left-turn treatments to backfill.`,
  );

  /* 3. Create traffic signal components with protected left-turn phase subcomponents to insert */
  const componentsToInsert = createMopedComponentsPayload(
    trafficSignals,
    deduplicatedLeftTurnTreatments,
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
