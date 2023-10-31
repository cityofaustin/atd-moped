const { gql } = require("graphql-request");
const { downloadUsers } = require("./moped_users");
const {
  exportMetadata,
  replaceMetadata,
  makeHasuraRequest,
  runSql,
} = require("./utils/graphql");
const { loadJsonFile, saveJsonFile } = require("./utils/loader");
const { logger_load: logger } = require("./utils/logger");
const {
  chunkArray,
  createProjectActivityRecords,
  createProjectUpdateActivityRecords,
} = require("./utils/misc");

const getMetadataFileDateString = () =>
  new Date().toLocaleDateString().replaceAll("/", "_");

const PROJECT_CHUNK_SIZE = 15;

let users;

const INSERT_PROJECTS_MUTATION = gql`
  mutation InsertProjects($objects: [moped_project_insert_input!]!) {
    insert_moped_project(objects: $objects) {
      returning {
        project_id
        added_by
        date_added
        project_name
      }
    }
  }
`;

const INSERT_ACTIVITY_LOG_EVENT_MUTATION = gql`
  mutation InsertActivityLogProjectCreate(
    $objects: [moped_activity_log_insert_input!]!
  ) {
    insert_moped_activity_log(objects: $objects) {
      affected_rows
    }
  }
`;

const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject(
    $project_id: Int!
    $projectUpdates: moped_project_set_input!
    $tagInserts: [moped_proj_tags_insert_input!]!
    $noteInserts: [moped_proj_notes_insert_input!]!
    $phaseInserts: [moped_proj_phases_insert_input!]!
    $fundingInserts: [moped_proj_funding_insert_input!]!
    $componentInserts: [moped_proj_components_insert_input!]!
    $personInserts: [moped_proj_personnel_insert_input!]!
    $milestoneInserts: [moped_proj_milestones_insert_input!]!
    $workActvityInserts: [moped_proj_work_activity_insert_input!]!
  ) {
    update_moped_project_by_pk(
      pk_columns: { project_id: $project_id }
      _set: $projectUpdates
    ) {
      project_id
    }
    insert_moped_proj_tags(objects: $tagInserts) {
      affected_rows
    }
    insert_moped_proj_notes(objects: $noteInserts) {
      affected_rows
    }
    insert_moped_proj_phases(objects: $phaseInserts) {
      affected_rows
    }
    insert_moped_proj_funding(objects: $fundingInserts) {
      affected_rows
    }
    insert_moped_proj_components(objects: $componentInserts) {
      affected_rows
    }
    insert_moped_proj_personnel(objects: $personInserts) {
      affected_rows
    }
    insert_moped_proj_milestones(objects: $milestoneInserts) {
      affected_rows
    }
    insert_moped_proj_work_activity(objects: $workActvityInserts) {
      affected_rows
    }
  }
`;

const UPDATE_COMPONENT_MUTATION = gql`
  mutation UpdateComponent(
    $project_component_id: Int!
    $componentUpdates: moped_proj_components_set_input!
    $tagInserts: [moped_proj_component_tags_insert_input!]!
    $workTypeInserts: [moped_proj_component_work_types_insert_input!]!
    $subcomponentInserts: [moped_proj_components_subcomponents_insert_input!]!
  ) {
    update_moped_proj_components_by_pk(
      pk_columns: { project_component_id: $project_component_id }
      _set: $componentUpdates
    ) {
      project_component_id
    }
    insert_moped_proj_component_tags(objects: $tagInserts) {
      affected_rows
    }
    insert_moped_proj_component_work_types(objects: $workTypeInserts) {
      affected_rows
    }
    insert_moped_proj_components_subcomponents(objects: $subcomponentInserts) {
      affected_rows
    }
  }
`;

const TRIGGERS_TO_DISABLE = [
  {
    table: "moped_proj_work_activity",
    trigger: "set_proj_work_activity_trigger_updated_at",
  },
  //   {
  //     table: "feature_drawn_lines",
  //     trigger: "update_feature_drawn_lines_council_district",
  //   },
  //   {
  //     table: "feature_drawn_lines",
  //     trigger: "update_feature_drawn_lines_council_district",
  //   },
  //   {
  //     table: "feature_drawn_points",
  //     trigger: "update_feature_drawn_points_council_district",
  //   },
  //   {
  //     table: "feature_drawn_points",
  //     trigger: "update_feature_drawn_points_council_district",
  //   },
  //   {
  //     table: "feature_intersections",
  //     trigger: "update_feature_intersections_council_district",
  //   },
  //   {
  //     table: "feature_intersections",
  //     trigger: "update_feature_intersections_council_district",
  //   },
  //   {
  //     table: "feature_signals",
  //     trigger: "update_feature_signals_council_district",
  //   },
  //   {
  //     table: "feature_signals",
  //     trigger: "update_feature_signals_council_district",
  //   },
  //   {
  //     table: "feature_street_segments",
  //     trigger: "update_feature_street_segments_council_district",
  //   },
  //   {
  //     table: "feature_street_segments",
  //     trigger: "update_feature_street_segments_council_district",
  //   },
  {
    table: "moped_proj_phases",
    trigger: "set_moped_proj_phases_confirmed_dates_trigger",
  },
  {
    table: "moped_proj_phases",
    trigger: "set_moped_proj_phases_confirmed_dates_trigger",
  },
];

const getSetTriggerStateSql = (state) =>
  TRIGGERS_TO_DISABLE.map(
    ({ table, trigger }) => `ALTER TABLE ${table} ${state} TRIGGER ${trigger}`
  ).join(";\n");

const removeEventTriggers = (metadata) => {
  metadata.sources.forEach((source) => {
    source.tables.forEach((table) => {
      delete table.event_triggers;
    });
  });
};

async function main(env) {
  logger.info(`Running Access migration on env ${env} 🚀`);

  logger.info("Downloading users from production...");

  /**
   * Download the latest user list from production. If during the during the migration
   * we encounter a user in the access DB who is unkown to production, the migration
   * will abort in failure
   */
  users = await downloadUsers(env);

  const john_user_id = users.find(
    (x) => x.email.toLowerCase() === "john.clary@austintexas.gov"
  ).user_id;

  logger.info("✅ Users downloaded");

  const projectDataFilename = `./data/ready/project_data_${env}.json`;

  const projectProgressFilename = `./data/ready/project_data_in_progress_${env}.json`;

  const { projectsToCreate, allProjectUpdates, allComponentUpdates } =
    loadJsonFile(projectDataFilename);

  logger.info(`Projects to create: ${projectsToCreate.length}`);
  logger.info(`Projects to update: ${allProjectUpdates.length}`);
  logger.info(`Components to update: ${allComponentUpdates.length}`);

  const metadataFilename = `./backup/metadata_${env}_${getMetadataFileDateString()}.json`;
  let metadata;

  try {
    metadata = loadJsonFile(metadataFilename);
  } catch {
    // pass
  }

  if (!metadata) {
    // if we dont have a metadata backup, make one
    logger.info("Backing up metadata...");
    try {
      metadata = await exportMetadata({ env });
    } catch (error) {
      logger.error(error);
      return;
    }
    saveJsonFile(metadataFilename, metadata);
    logger.info(`✅ Metadata saved to '${metadataFilename}'`);
  } else {
    logger.info(`✅ Loaded metadata backup from '${metadataFilename}'`);
  }

  logger.info("Disabling hasura event triggers...");
  removeEventTriggers(metadata);

  try {
    await replaceMetadata({ env, metadata });
  } catch (error) {
    logger.error({ message: error });
    return;
  }

  logger.info("✅ Hasura Event triggers disabled");

  logger.info("Disabling DB event triggers...");

  await runSql({
    env,
    sql: getSetTriggerStateSql("disable"),
  });

  logger.info("✅ DB event triggers disabled");

  logger.info(`Inserting ${projectsToCreate.length} projects...`);

  const projectChunks = chunkArray(projectsToCreate, PROJECT_CHUNK_SIZE);

  // save a copy of all processed data as we go -
  // incase we have to untangle this all
  const loadingProgress = {
    projectsToCreate: [],
    allProjectUpdates: [],
    allComponentUpdates: [],
  };

  for (let i = 0; i < projectChunks.length; i++) {
    let response;
    // insert each chunk of projects
    try {
      logger.info(`⬆️ ${i + 1}/${projectChunks.length} - uploading projects`);
      response = await makeHasuraRequest({
        query: INSERT_PROJECTS_MUTATION,
        variables: { objects: projectChunks[i] },
        env,
      });
    } catch (error) {
      logger.error({ message: error });
      debugger;
      break;
    }
    // create an activity event for each project
    const projects = response.insert_moped_project.returning;

    const activityLogRecords = projects
      .map((proj) => {
        return createProjectActivityRecords({ ...proj, john_user_id });
      })
      .flat();

    try {
      logger.info("📖 uploading activity log events...");
      await makeHasuraRequest({
        query: INSERT_ACTIVITY_LOG_EVENT_MUTATION,
        variables: { objects: activityLogRecords },
        env,
      });
    } catch (error) {
      logger.error({ message: error });
      debugger;
      throw `Cannot continue!`;
    }

    // save our progress
    loadingProgress.projectsToCreate.push(projectChunks[i]);
    saveJsonFile(projectProgressFilename, loadingProgress);

    logger.info("⏳ Sleeping...");
    await new Promise((r) => setTimeout(r, 1000));
  }

  logger.info("✅✅✅✅✅ All projects created ✅✅✅✅✅");

  logger.info("Starting project updates...");

  for (let i = 0; i < allProjectUpdates.length; i++) {
    const project = allProjectUpdates[i];

    const { project_id, ...projectUpdates } = project.moped_project;

    const variables = { project_id, projectUpdates };

    variables.tagInserts = project.moped_proj_tags || [];
    variables.noteInserts = project.moped_proj_notes || [];
    variables.phaseInserts = project.moped_proj_phases || [];
    variables.fundingInserts = project.moped_proj_funding || [];
    variables.componentInserts = project.moped_proj_components || [];
    variables.personInserts = project.moped_proj_personnel || [];
    variables.milestoneInserts = project.moped_proj_milestones || [];
    variables.workActvityInserts = project.moped_proj_work_activities || [];

    let response;

    try {
      logger.info(
        `⬆️ ${i + 1}/${
          allProjectUpdates.length
        } - uploading project update for project #${project_id}`
      );

      response = await makeHasuraRequest({
        query: UPDATE_PROJECT_MUTATION,
        variables,
        env,
      });
    } catch (error) {
      logger.error({ message: error });
      throw `Cannot continue`;
      debugger;
      break;
    }

    loadingProgress.allProjectUpdates.push(project);
    saveJsonFile(projectProgressFilename, loadingProgress);

    logger.info("📖 uploading activity log event...");

    const activityLogRecords = createProjectUpdateActivityRecords({
      project_id,
      john_user_id,
    });

    try {
      await makeHasuraRequest({
        query: INSERT_ACTIVITY_LOG_EVENT_MUTATION,
        variables: { objects: activityLogRecords },
        env,
      });
    } catch (error) {
      logger.error({ message: error });
      debugger;
      throw `Cannot continue!`;
    }

    logger.info("⏳ Sleeping...");
    await new Promise((r) => setTimeout(r, 1000));
  }

  logger.info("✅✅✅✅✅ Projects updates complete ✅✅✅✅✅");

  logger.info("Starting component updates...");

  for (let i = 0; i < allComponentUpdates.length; i++) {
    const mpc = allComponentUpdates[i];
    const { project_component_id, ...componentUpdates } =
      mpc.moped_proj_components;

    const variables = { project_component_id, componentUpdates };

    variables.tagInserts = mpc.moped_proj_component_tags || [];
    variables.workTypeInserts = mpc.moped_proj_component_work_types || [];
    variables.subcomponentInserts =
      mpc.moped_proj_components_subcomponents || [];

    try {
      logger.info(
        `⬆️ ${i + 1}/${allComponentUpdates.length} - uploading component update`
      );

      response = await makeHasuraRequest({
        query: UPDATE_COMPONENT_MUTATION,
        variables,
        env,
      });
    } catch (error) {
      logger.error({ message: error });
      debugger;
      throw `Cannot continue!`;
      break;
    }

    loadingProgress.allComponentUpdates.push(mpc);
    saveJsonFile(projectProgressFilename, loadingProgress);

    logger.info("📖 uploading activity log event...");

    const project_id = mpc.moped_proj_components.project_id;

    if (!project_id) {
      debugger;
      throw `WHOOPS`;
    }

    const activityLogRecords = createProjectUpdateActivityRecords({
      project_id,
      john_user_id,
    });

    try {
      await makeHasuraRequest({
        query: INSERT_ACTIVITY_LOG_EVENT_MUTATION,
        variables: { objects: activityLogRecords },
        env,
      });
    } catch (error) {
      logger.error({ message: error });
      debugger;
      throw `Cannot continue!`;
    }

    logger.info("⏳ Sleeping...");
    await new Promise((r) => setTimeout(r, 1000));
  }

  logger.info("✅✅✅✅✅ Component updates complete ✅✅✅✅✅");

  logger.info("Re-enabling DB event triggers...");

  await runSql({
    env,
    sql: getSetTriggerStateSql("enable"),
  });

  logger.info("✅ DB event triggers re-enables");

  logger.info("Restoring event triggers...");
  const metadataBackup = loadJsonFile(metadataFilename);

  try {
    await replaceMetadata({ env, metadata: metadataBackup });
  } catch (error) {
    logger.error({ message: error });
    return;
  }
  logger.info("✅ Event trigger restored");

  logger.info("Done 😅");
}

const getEnv = () => {
  const env = process.argv[2];
  // alter this to enable run against staging or prod 😬
  if (!["local", "test"].includes(env)) {
    throw "Unknown environment. Choose 'local', 'test'";
  }
  return env;
};

const env = getEnv();

main(env);
