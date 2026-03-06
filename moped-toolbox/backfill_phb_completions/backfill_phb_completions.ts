import type {
  MopedComponentsResponse,
  MopedComponent,
  SocrataPHBResponse,
  SocrataPHBRecord,
} from "./types.ts";
import { makeSocrataRequest } from "./requests/socrata.ts";
import {
  getCompletedPhbComponents,
  getCompletedPhbComponentsNeedingDateOnly,
  getCompletedPhbComponentsNeedingPhaseAndDate,
  makeHasuraRequest,
  updateMopedComponentCompletionDate,
} from "./requests/graphql.ts";

const SOCRATA_URL =
  "https://data.austintexas.gov/api/v3/views/p53x-x73x/query.json";
export const PHB_FILTER_STRING = encodeURIComponent(
  `
SELECT signal_id,location_name,location,signal_type,id
WHERE
  caseless_eq(\`signal_status\`, "TURNED_ON")
  AND caseless_eq(\`signal_type\`, "PHB")
  AND \`turn_on_date\` IS NOT NULL
ORDER BY \`signal_id\` ASC
`.trim(),
);

async function backfillMopedComponents(
  componentsToBackfill: MopedComponent[],
  componentsToInsert: SocrataPHBRecord[],
) {
  componentsToBackfill.forEach(async (component) => {
    const projectId = component.project_id;
    const mopedComponentId = component.project_component_id;
    const signalId = component.feature_signals[0].signal_id;
    const completionDate = componentsToInsert.find(
      (phb) => String(phb.signal_id) === String(signalId),
    )?.turn_on_date;
    const logUrl = `https://localhost:3000/moped/projects/${projectId}?tab=map&project_component_id=${mopedComponentId}`;

    if (completionDate) {
      try {
        console.log("mutating");
        await makeHasuraRequest(updateMopedComponentCompletionDate, {
          id: mopedComponentId,
          completion_date: completionDate,
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
  });
}

async function fillMissingPHBsIntoNewProject() {
  // Step 4: Insert PHBs not already in Moped into new project
  console.log("Filling missing PHBs into new project...");
}

async function main() {
  console.log("Starting PHB backfill process...");

  // Request filtered Data Tracker PHB data (ODP) to backfill and insert into Moped
  let phbsToInsert = await makeSocrataRequest<SocrataPHBResponse>(
    `${SOCRATA_URL}?query=${PHB_FILTER_STRING}`,
  );
  // Collect signal IDs of duplicate PHBs in Moped to flag for review
  const duplicatePhbsInMoped = [];

  // Get accurate completed PHBs in Moped and remove from Data Tracker PHB data insert queue
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

  phbsToInsert = phbsToInsert.filter(
    (phb) => !completeMopedPHBSignalIds.has(phb.signal_id),
  );
  console.log(`There are now ${phbsToInsert.length} PHBs to insert.`);

  // Get PHBs missing completion date to backfill from Data Tracker and remove from insert queue
  const { moped_proj_components: newPHBsNeedingDateOnly } =
    await makeHasuraRequest<MopedComponentsResponse>(
      getCompletedPhbComponentsNeedingDateOnly,
    );
  console.log(
    `Found ${newPHBsNeedingDateOnly.length} new PHBs missing completion date that need to be backfilled.`,
  );
  backfillMopedComponents(newPHBsNeedingDateOnly, phbsToInsert);

  const backfilledDatePHBSignalIds = new Set<string>(
    newPHBsNeedingDateOnly.flatMap((component) =>
      component.feature_signals.map((signal) => String(signal.signal_id)),
    ),
  );
  phbsToInsert = phbsToInsert.filter(
    (phb) => !backfilledDatePHBSignalIds.has(phb.signal_id),
  );
  console.log(`There are now ${phbsToInsert.length} PHBs to insert.`);

  // Get new PHBs missing completion date and phase to backfill from Data Tracker and remove from insert queue
  const { moped_proj_components: newPHBsNeedingPhaseAndDate } =
    await makeHasuraRequest<MopedComponentsResponse>(
      getCompletedPhbComponentsNeedingPhaseAndDate,
    );
  backfillMopedComponents(newPHBsNeedingPhaseAndDate, phbsToInsert);

  const backfilledPhaseAndDatePHBSignalIds = new Set<string>(
    newPHBsNeedingPhaseAndDate.flatMap((component) =>
      component.feature_signals.map((signal) => String(signal.signal_id)),
    ),
  );
  phbsToInsert = phbsToInsert.filter(
    (phb) => !backfilledPhaseAndDatePHBSignalIds.has(phb.signal_id),
  );
  console.log(`There are now ${phbsToInsert.length} PHBs to insert.`);

  // TODO: Create PHB project and insert remaining PHBs in queue as features in that project
}

main().catch((error) => {
  console.error("An error occurred during the PHB backfill process:", error);
  process.exit(1);
});
