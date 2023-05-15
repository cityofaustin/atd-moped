const { gql } = require("graphql-request");
const { getProjPhasesAndNotes } = require("./moped_proj_phases_and_notes");
const { getComponents } = require("./moped_proj_components");
const { ENTITIES_MAP } = require("./mappings/entities");
const {
  PUBLIC_PROCESS_STATUS_MAP,
} = require("./mappings/public_process_status");
const {
  exportMetadata,
  replaceMetadata,
  makeHasuraRequest,
} = require("./utils/graphql");
const { loadJsonFile, saveJsonFile } = require("./utils/loader");
const { logger } = require("./utils/logger");
const { mapRow, chunkArray } = require("./utils/misc");

const getMetadataFileDateString = () =>
  new Date().toLocaleDateString().replaceAll("/", "_");

const FNAME = "./data/raw/projects.json";
const METADATA_FNAME = `./backup/metadata_${getMetadataFileDateString()}.json`;

const DELETE_ALL_PROJECTS_MUTATION = gql`
  mutation DeleteAlllProjects {
    delete_moped_project(where: { project_id: { _is_null: false } }) {
      __typename
    }
    delete_features(where: { id: { _is_null: false } }) {
      __typename
    }
  }
`;

const INSERT_PROJECTS_MUTATION = gql`
  mutation InsertProjects($objects: [moped_project_insert_input!]!) {
    insert_moped_project(objects: $objects) {
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
        return null;
      }
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

async function main(env) {
  logger.info(`Running Access migration on env ${env} 🚀`);

  let metadata;

  try {
    metadata = loadJsonFile(METADATA_FNAME);
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
    saveJsonFile(METADATA_FNAME, metadata);
    logger.info(`✅ Metadata saved to '${METADATA_FNAME}'`);
  } else {
    logger.info(`✅ Loaded metadata backup from '${METADATA_FNAME}'`);
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

  if (env === "local" || env === "test") {
    logger.info("Deleting all projects....");
    await makeHasuraRequest({
      query: DELETE_ALL_PROJECTS_MUTATION,
      env,
    });
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

  const projComponents = getComponents();

  // attach proj phases to projects
  projects.forEach((proj) => {
    const { interim_project_id } = proj;
    const phases = projPhases[interim_project_id];
    if (phases?.length) {
      proj.moped_proj_phases = { data: phases };
    }

    const notes = projNotes[interim_project_id];

    if (notes?.length) {
      proj.moped_proj_notes = { data: notes };
    }

    const components = projComponents[interim_project_id];
    if (components?.length) {
      proj.moped_proj_components = { data: components };
    }
  });

  logger.info(`Inserting ${projects.length} projects...`);

  const projectChunks = chunkArray(projects, 50);

  for (let i = 0; i < projectChunks.length; i++) {
    try {
      logger.info(
        `${i + 1}/${projectChunks.length} - uploading ${
          projectChunks[i].length
        } projects...`
      );
      await makeHasuraRequest({
        query: INSERT_PROJECTS_MUTATION,
        variables: { objects: projectChunks[i] },
        env,
      });
    } catch (error) {
      logger.error({ message: error });
      debugger;
      break;
    }
  }

  logger.info("Restoring event triggers...");
  const metadataBackup = loadJsonFile(METADATA_FNAME);

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
  if (!["local", "test", "staging"].includes(env)) {
    throw "Unknown environment. Choose 'local', 'test', 'staging'";
  }
  return env;
};

const env = getEnv();

main(env);

// def test_is_valid(row):
//     assert all([row[field["out"]] for field in fields if field["required"]])
