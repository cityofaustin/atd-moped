import type {
  MopedComponentsResponse,
  MopedComponent,
  SocrataPHBResponse,
  SocrataSignalRecord,
  MopedProjectInsertResponse,
} from "./types.ts";
import {
  makeSocrataRequest,
  socrataSignalRecordToFeatureSignalsRecord,
} from "./helpers/socrata.ts";
import {
  addProject,
  getCompletedPhbComponents,
  getCompletedPhbComponentsNeedingDateOnly,
  getCompletedPhbComponentsNeedingPhaseAndDate,
  makeHasuraRequest,
  updateMopedComponentCompletionDate,
  updateMopedComponentCompletionDateAndPhase,
} from "./helpers/graphql.ts";
import { toTimestamptz } from "./helpers/time.ts";
import { requireEnv } from "./helpers/env.ts";

// TODOs:
// Create a new project to hold backfilled left turn treatment subcomponents on Traffic Signal components in Moped
// Create a Left Turn Protection project with each of the implementations as Signal components using the same signal details captured in a new signal component defined in Moped
// Component type (Full): Signal - Traffic
// Component work type: Mod
// Component subcomponent: Protected left-turn phase
// Component phase: Complete
// Component phase completion date: Implementation date from Left Turn Analysis data linked above (can export as csv from Power BI dasboard)
// No need to capture information about recommendation or direction
// Special cases:
// Exclude rows that have recommendation of “No change”
// Need to de-duplicate by signal ids on same date that represent different directions at the same intersection
// Create multiple components for treatments on the same signal on different days. Signal ID 920 appears to be the only case with treatments for different directions in 2023 and 2024
// Skip treatments with missing signal ID and treatments with no implementation date

const DRY_RUN = process.argv.includes("--dry-run");
const MOPED_BASE_URL = requireEnv("MOPED_BASE_URL");
const SOCRATA_URL =
  "https://data.austintexas.gov/api/v3/views/p53x-x73x/query.json";
const PHB_FILTER_STRING = encodeURIComponent(
  `
SELECT signal_id,location_name,location,signal_type,id,turn_on_date
WHERE
  caseless_eq(\`signal_type\`, "TRAFFIC")
ORDER BY \`signal_id\` ASC
`.trim(),
);

function findDuplicatePHBsInMoped(mopedPHBs: MopedComponent[]): {
  duplicateIds: string[];
  logLines: string[];
} {
  const signalIdToComponents = new Map<string, MopedComponent[]>();

  mopedPHBs.forEach((component) => {
    component.feature_signals.forEach((signal) => {
      const id = String(signal.signal_id);
      const existing = signalIdToComponents.get(id) ?? [];
      signalIdToComponents.set(id, [...existing, component]);
    });
  });

  const duplicates = [...signalIdToComponents.entries()].filter(
    ([, components]) => components.length > 1,
  );

  const logLines = duplicates.map(([id, components]) => {
    const urls = components.map(
      (component) =>
        `${MOPED_BASE_URL}/${component.project_id}?tab=map&project_component_id=${component.project_component_id}`,
    );
    return `  Signal ID ${id} appears in multiple Moped components:\n  ${urls.join("\n  ")}`;
  });

  return {
    duplicateIds: duplicates.map(([id]) => id),
    logLines,
  };
}

function removeFromInsertQueue(
  queue: SocrataSignalRecord[],
  mopedComponents: MopedComponent[],
): SocrataSignalRecord[] {
  return queue.filter(
    (phb) =>
      !mopedComponents.some((component) =>
        component.feature_signals.some(
          (signal) => String(signal.signal_id) === String(phb.signal_id),
        ),
      ),
  );
}

async function backfillMopedComponents(
  componentsToBackfill: MopedComponent[],
  componentsToInsert: SocrataSignalRecord[],
  mutation: string,
  duplicatesToSkip: string[],
): Promise<string[]> {
  const noMatchUrls: string[] = [];

  for (const component of componentsToBackfill) {
    const projectId = component.project_id;
    const mopedComponentId = component.project_component_id;
    const signalId = component.feature_signals[0].signal_id;
    const completionDate = componentsToInsert.find(
      (phb) => String(phb.signal_id) === String(signalId),
    )?.turn_on_date;
    const logUrl = `Signal ID ${signalId} in ${MOPED_BASE_URL}/${projectId}?tab=map&project_component_id=${mopedComponentId}`;

    if (duplicatesToSkip.includes(String(signalId))) {
      continue;
    }

    if (completionDate) {
      if (DRY_RUN) {
        console.log(`[DRY RUN] Would backfill ${logUrl}`);
      } else {
        try {
          await makeHasuraRequest(mutation, {
            id: mopedComponentId,
            completion_date: toTimestamptz(completionDate),
          });
          console.log(`Backfilled ${logUrl}`);
        } catch (error) {
          console.error(
            `An error occurred while backfilling ${logUrl}:`,
            error,
          );
        }
      }
    } else {
      noMatchUrls.push(logUrl);
    }
  }

  return noMatchUrls;
}

async function main() {
  console.log(`Starting PHB backfill process ${DRY_RUN ? "(DRY RUN)" : ""}...`);

  /* 1. Request filtered Data Tracker signal data (ODP) to backfill insert components into Moped */
  let trafficSignals = await makeSocrataRequest<SocrataPHBResponse>(
    `${SOCRATA_URL}?query=${PHB_FILTER_STRING}`,
  );

  /** 2. Collect left-turn treatments from Austin Left Turn Treatment Evaluation dashboard
   ** See https://app.powerbigov.us/groups/me/reports/746b8c1d-d0e5-45a8-a661-bea2fd331764/ReportSectiond62e57c030a1e78218a9
   */
  // TODO: Create data folder, read csv from folder and filter to exclude special cases listed above
  const leftTurnTreatments = [];
  console.log(
    `Found ${leftTurnTreatments.length} left-turn treatments to backfill.`,
  );

  /* 3. Create traffic signal components with protected left-turn phase subcomponents to insert */
  const trafficSignalsToBackfill = [];
  const componentsToInsert = trafficSignalsToBackfill.map((treatment) => {
    data: "TODO";
  });

  /*  5. Create PHB project and insert traffic signals as components in that project */
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

  try {
    if (DRY_RUN) {
      console.log(
        `[DRY RUN] Would insert ${componentPayload.length} new traffic signals with left-turn treatments into a new Moped project.`,
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
            moped_proj_components: { data: componentPayload },
          },
        },
      );
      console.log(
        `Inserted ${componentPayload.length} new traffic signals from Data Tracker into a new Moped project #${projectData.insert_moped_project_one.project_id}.`,
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
