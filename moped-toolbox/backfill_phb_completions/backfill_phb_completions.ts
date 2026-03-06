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

const mopedBaseUrl = "https://localhost:3000/moped/projects";
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

function findDuplicatePHBsInMoped(mopedPHBs: MopedComponent[]): string[] {
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

  duplicates.forEach(([id, components]) => {
    const urls = components.map(
      (component) =>
        `${mopedBaseUrl}/${component.project_id}?tab=map&project_component_id=${component.project_component_id}`,
    );
    console.log(
      `Signal ID ${id} appears in multiple Moped components. Flagging for manual review:\n  ${urls.join("\n  ")}`,
    );
  });

  return duplicates.map(([id]) => id);
}

async function backfillMopedComponents(
  componentsToBackfill: MopedComponent[],
  componentsToInsert: SocrataSignalRecord[],
  mutation: string,
  duplicatesToSkip: string[],
) {
  for (const component of componentsToBackfill) {
    const projectId = component.project_id;
    const mopedComponentId = component.project_component_id;
    const signalId = component.feature_signals[0].signal_id;
    const completionDate = componentsToInsert.find(
      (phb) => String(phb.signal_id) === String(signalId),
    )?.turn_on_date;
    const logUrl = `${mopedBaseUrl}/${projectId}?tab=map&project_component_id=${mopedComponentId}`;

    if (duplicatesToSkip.includes(String(signalId))) {
      console.log(
        `Skipping backfill for ${logUrl} with signal ID ${signalId} due to duplicate signal ID in Moped. Flagging for manual review.`,
      );
      continue;
    }

    if (completionDate) {
      try {
        await makeHasuraRequest(mutation, {
          id: mopedComponentId,
          completion_date: toTimestamptz(completionDate),
        });
        console.log(`Backfilled completion date for ${logUrl}.`);
      } catch (error) {
        console.error(
          `An error occurred while backfilling completion date for ${logUrl}:`,
          error,
        );
      }
    } else {
      console.log(
        `Could not find completion date for ${logUrl} in Data Tracker response. Flagging for manual review.`,
      );
    }
  }
}

async function main() {
  console.log("Starting PHB backfill process...");

  // Request filtered Data Tracker PHB data (ODP) to backfill some and insert others into Moped
  let phbsToInsert = await makeSocrataRequest<SocrataPHBResponse>(
    `${SOCRATA_URL}?query=${PHB_FILTER_STRING}`,
  );
  const duplicatePhbsInMoped = [];

  // Get fully complete PHBs in Moped and remove from Data Tracker PHB data insert queue
  const { moped_proj_components: completeMopedPHBs } =
    await makeHasuraRequest<MopedComponentsResponse>(getCompletedPhbComponents);
  console.log(
    `Found ${completeMopedPHBs.length} completed PHBs already in Moped that can be removed from the queue.`,
  );
  const completeMopedPHBSignalIds = new Set<string>(
    completeMopedPHBs.flatMap((component) =>
      component.feature_signals.map((signal) => String(signal.signal_id)),
    ),
  );
  duplicatePhbsInMoped.push(...findDuplicatePHBsInMoped(completeMopedPHBs));

  phbsToInsert = phbsToInsert.filter(
    (phb) => !completeMopedPHBSignalIds.has(phb.signal_id),
  );
  console.log(`There are now ${phbsToInsert.length} PHBs to insert.`);

  /* Get PHBs missing completion date to backfill from Data Tracker and remove from insert queue */
  const { moped_proj_components: newPHBsNeedingDateOnly } =
    await makeHasuraRequest<MopedComponentsResponse>(
      getCompletedPhbComponentsNeedingDateOnly,
    );
  console.log(
    `Found ${newPHBsNeedingDateOnly.length} new PHBs missing completion date that need to be backfilled.`,
  );
  duplicatePhbsInMoped.push(
    ...findDuplicatePHBsInMoped(newPHBsNeedingDateOnly),
  );
  await backfillMopedComponents(
    newPHBsNeedingDateOnly,
    phbsToInsert,
    updateMopedComponentCompletionDate,
    duplicatePhbsInMoped,
  );

  const backfilledDatePHBSignalIds = new Set<string>(
    newPHBsNeedingDateOnly.flatMap((component) =>
      component.feature_signals.map((signal) => String(signal.signal_id)),
    ),
  );
  phbsToInsert = phbsToInsert.filter(
    (phb) => !backfilledDatePHBSignalIds.has(phb.signal_id),
  );
  console.log(`There are now ${phbsToInsert.length} PHBs to insert.`);

  /* Get new PHBs missing completion date and phase to backfill from Data Tracker and remove from insert queue */
  const { moped_proj_components: newPHBsNeedingPhaseAndDate } =
    await makeHasuraRequest<MopedComponentsResponse>(
      getCompletedPhbComponentsNeedingPhaseAndDate,
    );
  duplicatePhbsInMoped.push(
    ...findDuplicatePHBsInMoped(newPHBsNeedingPhaseAndDate),
  );
  await backfillMopedComponents(
    newPHBsNeedingPhaseAndDate,
    phbsToInsert,
    updateMopedComponentCompletionDateAndPhase,
    duplicatePhbsInMoped,
  );

  const backfilledPhaseAndDatePHBSignalIds = new Set<string>(
    newPHBsNeedingPhaseAndDate.flatMap((component) =>
      component.feature_signals.map((signal) => String(signal.signal_id)),
    ),
  );
  phbsToInsert = phbsToInsert.filter(
    (phb) => !backfilledPhaseAndDatePHBSignalIds.has(phb.signal_id),
  );
  console.log(`There are now ${phbsToInsert.length} PHBs to insert.`);

  /* Create PHB project and insert remaining PHBs in queue as components in that project */
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
  } catch (error) {
    console.error("An error occurred while creating the PHB project:", error);
  }

  console.log(
    `Duplicate PHBs in Moped that were flagged for manual review: ${[...new Set(duplicatePhbsInMoped)].join(", ")}`,
  );
  console.log("PHB backfill done.");
}

main().catch((error) => {
  console.error("An error occurred during the PHB backfill process:", error);
  process.exit(1);
});
