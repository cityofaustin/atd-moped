import type { MopedComponentsResponse } from "./types.ts";
import { makeSocrataRequest } from "./requests/socrata.ts";
import {
  getCompletedPhbComponents,
  getCompletedPhbComponentsNeedingDateOnly,
  getCompletedPhbComponentsNeedingPhaseAndDate,
  makeHasuraRequest,
} from "./requests/graphql.ts";

const SOCRATA_URL =
  "https://data.austintexas.gov/api/v3/views/p53x-x73x/query.json";
export const PHB_FILTER_STRING = encodeURIComponent(
  `
SELECT *
WHERE
  caseless_eq(\`signal_status\`, "TURNED_ON")
  AND caseless_eq(\`signal_type\`, "PHB")
  AND \`turn_on_date\` IS NOT NULL
ORDER BY \`signal_id\` ASC
`.trim(),
);

async function backfillMopedComponents() {
  // Step 3: Backfill existin Moped component with Data Tracker data
  console.log("Backfilling Moped components with missing completion data...");
}

async function fillMissingPHBsIntoNewProject() {
  // Step 4: Insert PHBs not already in Moped into new project
  console.log("Filling missing PHBs into new project...");
}

async function main() {
  console.log("Starting PHB backfill process...");

  // Request filtered Data Tracker PHB data (ODP) to backfill and insert into Moped
  const phbData = await makeSocrataRequest(
    `${SOCRATA_URL}?query=${PHB_FILTER_STRING}`,
  );

  // Get accurate completed PHBs remove from Data Tracker PHB data insert queue
  const { moped_proj_components: completeMopedPHBs } =
    await makeHasuraRequest<MopedComponentsResponse>(getCompletedPhbComponents);
  console.log(
    `Found ${completeMopedPHBs.length} completed PHBs already in Moped that can be removed from the queue.`,
  );
  // TODO: Remove from queue by id

  // Get PHBs missing completion date to backfill from Data Tracker
  const { moped_proj_components: newPHBsNeedingDateOnly } =
    await makeHasuraRequest<MopedComponentsResponse>(
      getCompletedPhbComponentsNeedingDateOnly,
    );
  console.log(
    `Found ${newPHBsNeedingDateOnly.length} new PHBs missing completion date that need to be backfilled.`,
  );

  // TODO: Backfill mutation
  // TODO: Remove backfilled PHBs from queue

  // Get new PHBs missing completion date and phase to backfill from Data Tracker
  const { moped_proj_components: newPHBsNeedingPhaseAndDate } =
    await makeHasuraRequest<MopedComponentsResponse>(
      getCompletedPhbComponentsNeedingPhaseAndDate,
    );
  console.log(
    `Found ${newPHBsNeedingPhaseAndDate.length} new PHBs missing both completion date and phase that need to be backfilled.`,
  );
  // TODO: Backfill mutation
  // TODO: Remove backfilled PHBs from queue
}

main().catch((error) => {
  console.error("An error occurred during the PHB backfill process:", error);
  process.exit(1);
});
