const { gql } = require("graphql-request");
const { getProjPhasesAndNotes } = require("./moped_proj_phases_and_notes");
const { getComponents } = require("./moped_proj_components");
const { getWorkActivities } = require("./moped_work_activity");
const { getPersonnel, getEmployeeId } = require("./moped_proj_personnel");
const { downloadUsers, createUsers } = require("./moped_users");
const { getMilestones } = require("./moped_proj_milestones");
const { getFunding } = require("./moped_proj_funding");
const { ENTITIES_MAP } = require("./mappings/entities");
const { PARTNERS_MAP } = require("./mappings/partners");
const { TAGS_MAP } = require("./mappings/tags");
const {
  PUBLIC_PROCESS_STATUS_MAP,
} = require("./mappings/public_process_status");
const {
  exportMetadata,
  replaceMetadata,
  makeHasuraRequest,
  runSql,
} = require("./utils/graphql");
const { loadJsonFile, saveJsonFile } = require("./utils/loader");
const { logger } = require("./utils/logger");
const {
  mapRow,
  chunkArray,
  createProjectActivityRecords,
} = require("./utils/misc");

const getMetadataFileDateString = () =>
  new Date().toLocaleDateString().replaceAll("/", "_");

const PROJECT_CHUNK_SIZE = 50;
const FNAME = "./data/raw/projects.json";

let users;

const COUNCIL_DISTRICTS_FNAME = "./backup/council_districts.json";

const DELETE_ALL_PROJECTS_MUTATION = gql`
  mutation DeleteAllProjects {
    delete_moped_project(where: { project_id: { _is_null: false } }) {
      __typename
    }
    delete_features(where: { id: { _is_null: false } }) {
      __typename
    }
    delete_features(where: { id: { _is_null: false } }) {
      __typename
    }
    delete_moped_activity_log(where: { activity_id: { _is_null: false } }) {
      __typename
    }
  }
`;

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

const GET_COUNCIL_DISTRICTS_QUERY = gql`
  query getDistricts {
    layer_council_district {
      geography
      council_district
    }
  }
`;
const DELETE_COUNCIL_DISTRICTS_MUTATION = gql`
  mutation DeleteCouncilDistricts {
    delete_layer_council_district(where: { id: { _gt: 0 } }) {
      affected_rows
    }
  }
`;

fields = [
  {
    in: "ProjectID",
    out: "interim_project_id",
    required: true,
  },
  {
    in: "ProjectName",
    out: "project_name",
    required: true,
    // example transform - use this!
    // transform(row) {
    //   return row[this.in] || "None";
    // },
  },
  {
    in: "Description",
    out: "project_description",
    required: true,
  },
  {
    in: "ProjectWebsite",
    out: "project_website",
    required: false,
    transform(row) {
      const website = row["ProjectWebsite"];
      if (!website) {
        return null;
      }
      // for whatever reason websites are wrapped in `#`
      return website.replaceAll("#", "");
    },
  },
  {
    in: "StatusDate",
    out: "updated_at",
    required: false,
    transform(row) {
      // use the last status date if present
      if (row["StatusDate"]) {
        return row["StatusDate"];
      } else if (row["ProjectInitiationDate"]) {
        // or the project initiation date if present
        return row["ProjectInitiationDate"];
      } else {
        return "2010-01-01";
      }
    },
  },
  {
    in: "ProjectInitiationDate",
    out: "date_added",
    required: false,
  },
  {
    in: "Sponsor",
    out: "project_lead_id",
    required: false,
    transform(row) {
      const entity = ENTITIES_MAP.find((entity) => entity.in === row[this.in]);
      if (entity) {
        return entity.out;
      } else {
        throw `Entity not found`;
      }
    },
  },
  {
    in: "Partners",
    out: "moped_proj_partners",
    required: false,
    transform(row) {
      const partersTodo = row[this.in]?.split(",");
      if (!partersTodo || partersTodo.length === 0) {
        return null;
      }
      const partners = [];
      partersTodo.forEach((partner) => {
        const p = partner.trim();
        const partnerMatch = PARTNERS_MAP.find((entity) => entity.in === p);
        if (partnerMatch) {
          partners.push({ entity_id: partnerMatch.out });
        } else {
          // per discussion with NW this is good enough as-is
          // we will ignore unmatched partners
        }
      });
      return partners;
    },
  },
  {
    in: "PublicProcessStatus",
    out: "public_process_status_id",
    required: false,
    transform(row) {
      const statusText = row["PublicProcessStatus"];
      const statusMatch = PUBLIC_PROCESS_STATUS_MAP.find(
        (status) => status.in === statusText
      );
      return statusMatch?.out || null;
    },
  },
  {
    in: "ProjectGroup",
    out: "moped_proj_tags",
    transform(row) {
      const groups = row[this.in]?.split(",");
      if (!groups) {
        return null;
      }
      const tagRecords = groups
        .map((groupName) => {
          const groupNameTrimmed = groupName.trim();
          let tag = TAGS_MAP.find((tag) => tag.in === groupNameTrimmed);

          if (
            !tag &&
            // these tags are to be ignored
            ![
              "BusStopEnhancements",
              "MAP_SW2018(LMAP)",
              "MAP_VZero2023",
              "ACTPlan",
            ].includes(groupName)
          ) {
            // todo: i asked NW if these are ok to ignore
            // console.log("Ignoring tag: ", groupName);
            // throw `Unknwn group name: ${groupName}`;
          }
          return tag ? { tag_id: tag.out } : null;
        })
        .filter((tag) => tag);
      return { data: tagRecords };
    },
  },
];

const getInvalidFields = (row) => {
  const invalidFields = fields
    .filter((field) => field.required)
    .filter((field) => !row[field.out])
    .map((field) => field.out);
  if (invalidFields.length) {
    return invalidFields;
  }
};

const removeEventTriggers = (metadata) => {
  metadata.sources.forEach((source) => {
    source.tables.forEach((table) => {
      delete table.event_triggers;
    });
  });
};

const getEarliestNoteUserId = (notes) => {
  const earliestNote = notes.reduce((prevNote, currNote) => {
    const currNoteDate = new Date(currNote.date_created);
    const prevNoteDate = new Date(prevNote?.date_created);
    if (!currNoteDate) {
      return prevNote;
    } else if (!prevNoteDate) {
      return currNote;
    }
    if (currNoteDate < prevNoteDate) {
      return currNote;
    } else {
      return prevNote;
    }
  });
  return earliestNote?.added_by_user_id;
};

async function main(env) {
  logger.info(`Running Access migration on env ${env} 🚀`);

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

  logger.info("Disabling event triggers...");
  removeEventTriggers(metadata);

  try {
    await replaceMetadata({ env, metadata });
  } catch (error) {
    logger.error({ message: error });
    return;
  }

  logger.info("✅ Event triggers disabled");

  logger.info("Downloading users from production...");

  /**
   * Download the latest user list from production. If during the during the migration
   * we encounter a user in the access DB who is unkown to production, the migration
   * will abort in failure
   */
  users = await downloadUsers(env);
  const unknownUserId = users.find(
    (x) => x.first_name.toLowerCase() === "anonymous"
  ).user_id;

  const john_user_id = users.find(
    (x) => x.email.toLowerCase() === "john.clary@austintexas.gov"
  ).user_id;

  // const unknownUserId =
  logger.info("✅ Users downloaded");

  if (env === "local" || env === "test") {
    logger.info("Deleting all projects and features...");
    await makeHasuraRequest({
      query: DELETE_ALL_PROJECTS_MUTATION,
      env,
    });
    logger.info("✅ Projects deleted");

    logger.info("Resetting project ID sequence...");
    await runSql({
      env,
      sql: "SELECT setval('moped_project_project_id_simple_seq', 1, FALSE);",
    });

    logger.info("✅ Projects ID sequence reset");

    logger.info("Backing up council districts...");
    const districts = await makeHasuraRequest({
      query: GET_COUNCIL_DISTRICTS_QUERY,
      env,
    });

    if (districts["layer_council_district"].length > 0) {
      saveJsonFile(
        COUNCIL_DISTRICTS_FNAME,
        districts["layer_council_district"]
      );

      logger.info("✅ Council districts backed-up");
      logger.info("🏎️ Deleting council districts (gotta go fast)...");

      await makeHasuraRequest({
        query: DELETE_COUNCIL_DISTRICTS_MUTATION,
        env,
      });
      logger.info("✅ Council districts deleted");
    }

    logger.info("Deleting users and resetting ID sequence....");
    await runSql({
      env,
      sql: "DELETE FROM moped_users where 1=1; SELECT setval('moped_users_user_id_seq', 1, FALSE);",
    });
    logger.info("✅ Users deleted");
    logger.info("Creating users from production...");
    await createUsers(env);
    logger.info("✅ Users created");
  }
  const data = loadJsonFile(FNAME);

  const projects = data
    .map((row) => {
      const newRow = mapRow(row, fields);
      if (getInvalidFields(newRow)) {
        return null;
        // throw getInvalidFields(newRow).join(", ");
      }
      return newRow;
    })
    .filter((row) => !!row);

  const { projPhases, projNotes } = getProjPhasesAndNotes();
  const { projMilestones, projPhasesFromDates } = getMilestones();
  const projComponents = getComponents();
  const workAcivities = await getWorkActivities();
  const personnel = getPersonnel();
  const funding = await getFunding();

  projects.forEach((proj) => {
    // handle partners array
    const partners = proj.moped_proj_partners;
    if (partners && partners.length > 0) {
      proj.moped_proj_partners = { data: partners };
    } else {
      delete proj.moped_proj_partners;
    }

    const { interim_project_id } = proj;
    let phases = projPhases[interim_project_id] || [];
    // add phases from dates into the mix
    phases = [...phases, ...(projPhasesFromDates[interim_project_id] || [])];

    debugger;
    throw `Merge dupe phase/subphase based on phase ID + subphase ID and take earliest date - depdupe phase estimated vs actual milestones and set real/confirmed date. e.g. actual vs estimated construction start`
    if (phases?.length) {
      proj.moped_proj_phases = { data: phases };
    }

    const notes = projNotes[interim_project_id];

    if (notes?.length) {
      proj.moped_proj_notes = { data: notes };
      // set the project added by to whoever wrote the earliest note
      // (if we have one)
      proj.added_by = getEarliestNoteUserId(notes) || unknownUserId;
    }

    const components = projComponents[interim_project_id];
    if (components?.length) {
      proj.moped_proj_components = { data: components };
    }

    const activities = workAcivities
      .filter((a) => a.interim_project_id === interim_project_id)
      // remove interim project id from activity obj
      .map(({ interim_project_id, ...activity }) => activity);

    if (activities.length) {
      proj.moped_proj_work_activities = { data: activities };
    }

    const projPersonnel = personnel[interim_project_id];
    if (projPersonnel) {
      proj.moped_proj_personnel = { data: projPersonnel };
    }

    const projFunding = funding[interim_project_id];
    if (projFunding) {
      proj.moped_proj_funding = { data: projFunding };
    }

    const milestones = projMilestones[interim_project_id];

    if (milestones) {
      proj.moped_proj_milestones = { data: milestones };
    }
  });

  logger.info(`Inserting ${projects.length} projects...`);

  const projectChunks = chunkArray(projects, PROJECT_CHUNK_SIZE);

  for (let i = 0; i < projectChunks.length; i++) {
    let response;
    // insert each chunk of projects
    try {
      logger.info(
        `${i + 1}/${projectChunks.length} - uploading ${
          projectChunks[i].length
        } projects...`
      );
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
      logger.info("Creating activity log events...");
      await makeHasuraRequest({
        query: INSERT_ACTIVITY_LOG_EVENT_MUTATION,
        variables: { objects: activityLogRecords },
        env,
      });
    } catch (error) {
      logger.error({ message: error });
      debugger;
      break;
    }

    logger.info("Sleeping...");
    await new Promise((r) => setTimeout(r, 1000));
  }

  logger.info("Restoring event triggers...");
  const metadataBackup = loadJsonFile(metadataFilename);

  try {
    await replaceMetadata({ env, metadata: metadataBackup });
  } catch (error) {
    logger.error({ message: error });
    return;
  }
  logger.info("✅ Event trigger restored");

  logger.info("Done :)");
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

// def test_is_valid(row):
//     assert all([row[field["out"]] for field in fields if field["required"]])
