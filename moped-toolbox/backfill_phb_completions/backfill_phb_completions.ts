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

const DRY_RUN = process.argv.includes("--dry-run");
const MOPED_BASE_URL = requireEnv("MOPED_BASE_URL");
const SOCRATA_URL =
  "https://data.austintexas.gov/api/v3/views/p53x-x73x/query.json";
const PHB_FILTER_STRING = encodeURIComponent(
  `
SELECT signal_id,location_name,location,signal_type,id,turn_on_date
WHERE
  caseless_eq(\`signal_status\`, "TURNED_ON")
  AND caseless_eq(\`signal_type\`, "PHB")
  AND \`turn_on_date\` IS NOT NULL
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

  /* 1. Request filtered Data Tracker PHB data (ODP) to backfill some and insert others into Moped */
  let phbsToInsert = await makeSocrataRequest<SocrataPHBResponse>(
    `${SOCRATA_URL}?query=${PHB_FILTER_STRING}`,
  );

  /* 2. Get PHBs in Moped */
  const { moped_proj_components: completeMopedPHBs } =
    await makeHasuraRequest<MopedComponentsResponse>(getCompletedPhbComponents);
  const { moped_proj_components: needingDateOnly } =
    await makeHasuraRequest<MopedComponentsResponse>(
      getCompletedPhbComponentsNeedingDateOnly,
    );
  const { moped_proj_components: needingPhaseAndDate } =
    await makeHasuraRequest<MopedComponentsResponse>(
      getCompletedPhbComponentsNeedingPhaseAndDate,
    );

  console.log(
    `Found ${completeMopedPHBs.length} already-complete PHBs in Moped.`,
  );
  console.log(
    `Found ${needingDateOnly.length} PHBs needing completion date backfill.`,
  );
  console.log(
    `Found ${needingPhaseAndDate.length} PHBs needing completion date and phase backfill.`,
  );

  /* 3. Find duplicates in Moped so we can skip backfilling and flag for manual review */
  const {
    duplicateIds: duplicatePhbsInMoped,
    logLines: duplicatePhbsInMopedLogLines,
  } = findDuplicatePHBsInMoped([
    ...completeMopedPHBs,
    ...needingDateOnly,
    ...needingPhaseAndDate,
  ]);

  /* 4. Remove complete PHBs from insert queue, backfill missing data on those in Moped and remove from insert queue too */
  phbsToInsert = removeFromInsertQueue(phbsToInsert, completeMopedPHBs);
  console.log(
    `Insert queue after removing complete PHBs: ${phbsToInsert.length} remaining.`,
  );

  console.log("Backfilling PHBs in Moped that are missing completion date...");
  const noMatchNeedingDateOnlyUrls = await backfillMopedComponents(
    needingDateOnly,
    phbsToInsert,
    updateMopedComponentCompletionDate,
    duplicatePhbsInMoped,
  );
  phbsToInsert = removeFromInsertQueue(phbsToInsert, needingDateOnly);
  console.log(
    `Insert queue after backfilling date-only PHBs: ${phbsToInsert.length} remaining.`,
  );

  console.log(
    "Backfilling PHBs in Moped that are missing completion date and phase...",
  );
  const noMatchNeedingPhaseAndDateUrls = await backfillMopedComponents(
    needingPhaseAndDate,
    phbsToInsert,
    updateMopedComponentCompletionDateAndPhase,
    duplicatePhbsInMoped,
  );
  phbsToInsert = removeFromInsertQueue(phbsToInsert, needingPhaseAndDate);
  console.log(
    `Insert queue after backfilling phase and date PHBs: ${phbsToInsert.length} remaining.`,
  );

  /*  5. Create PHB project and insert remaining PHBs in queue as components in that project */
  const componentPayload = phbsToInsert.map((phb) => ({
    component_id: 16, // Signal - PHB component ID
    location_description: `${phb.signal_id}: ${phb.location_name.trim()}`,
    phase_id: 11, // Complete phase
    completion_date: toTimestamptz(phb.turn_on_date),
    feature_signals: {
      data: [socrataSignalRecordToFeatureSignalsRecord(phb)],
    },
    moped_proj_component_work_types: {
      data: [{ work_type_id: 7 }], // "New" work type
    },
  }));

  try {
    if (DRY_RUN) {
      console.log(
        `[DRY RUN] Would insert ${componentPayload.length} new PHBs into a new Moped project.`,
      );
    } else {
      const projectData = await makeHasuraRequest<MopedProjectInsertResponse>(
        addProject,
        {
          object: {
            project_name: "Vision Zero PHB Safety Statistics",
            project_description: `Backfill installed PHBs from Data Tracker that are not yet in Moped.`,
            moped_proj_components: { data: componentPayload },
          },
        },
      );
      console.log(
        `Inserted ${componentPayload.length} new PHBs from Data Tracker into a new Moped project #${projectData.insert_moped_project_one.project_id}.`,
      );
    }
  } catch (error) {
    console.error("An error occurred while creating the PHB project:", error);
  }

  if (duplicatePhbsInMopedLogLines.length > 0) {
    console.log("\nComponents with duplicate signal IDs that need review:");
    duplicatePhbsInMopedLogLines.forEach((line) => console.log(line));
  }

  const allNoMatchUrls = [
    ...noMatchNeedingDateOnlyUrls,
    ...noMatchNeedingPhaseAndDateUrls,
  ];
  if (allNoMatchUrls.length > 0) {
    console.log(
      "\nComponents with signal no longer turned on that need review:",
    );
    allNoMatchUrls.forEach((url) => console.log(`  ${url}`));
  }

  console.log("PHB backfill done.");
}

main().catch((error) => {
  console.error("An error occurred during the PHB backfill process:", error);
  process.exit(1);
});
