const { gql } = require("graphql-request");
const { getProjPhasesAndNotes } = require("./moped_proj_phases_and_notes");
const { getComponents } = require("./moped_proj_components");
const { getWorkActivities } = require("./moped_work_activity");
const { getPersonnel } = require("./moped_proj_personnel");
const { downloadUsers, createUsers } = require("./moped_users");
const { getMilestones } = require("./moped_proj_milestones");
const { getFunding } = require("./moped_proj_funding");
const { deDupeProjs } = require("./deDupe");
const { ENTITIES_MAP } = require("./mappings/entities");
const { PARTNERS_MAP } = require("./mappings/partners");
const { TAGS_MAP } = require("./mappings/tags");
const {
  PUBLIC_PROCESS_STATUS_MAP,
} = require("./mappings/public_process_status");
const { makeHasuraRequest, runSql } = require("./utils/graphql");
const { loadJsonFile, saveJsonFile } = require("./utils/loader");
const { logger_transform: logger } = require("./utils/logger");
const { mapRow } = require("./utils/misc");

const FNAME = "./data/raw/projects.json";

let users;

const EXISTING_PROJECTS_QUERY = gql`
  query GetExistingProjects {
    moped_project(where: { is_deleted: { _eq: false } }) {
      project_id
      project_description
      project_website
      project_lead_id
      date_added
      public_process_status_id
      interim_project_id
      ecapris_subproject_id
      moped_proj_phases(where: { is_deleted: { _eq: false } }) {
        is_current_phase
        phase_id
        subphase_id
      }
      moped_proj_tags {
        tag_id
      }
      moped_proj_partners {
        proj_partner_id
      }
    }
  }
`;

const EXISTING_COMPONENTS_QUERY = gql`
  query GetComponents {
    moped_proj_components(where: { is_deleted: { _eq: false } }) {
      project_component_id
      interim_project_component_id
      project_id
      completion_date
      date_added
      description
      location_description
      location_description
      phase_id
      subphase_id
      srts_id
      moped_proj_component_tags(where: { is_deleted: { _eq: false } }) {
        id
        component_tag_id
      }
      moped_proj_component_work_types(where: { is_deleted: { _eq: false } }) {
        id
        work_type_id
      }
      moped_proj_components_subcomponents(
        where: { is_deleted: { _eq: false } }
      ) {
        component_subcomponent_id
        subcomponent_id
      }
    }
  }
`;

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

const TRIGGERS_TO_DISABLE = [
  {
    table: "moped_proj_work_activity",
    trigger: "set_proj_work_activity_trigger_updated_at",
  },
  {
    table: "feature_drawn_lines",
    trigger: "update_feature_drawn_lines_council_district",
  },
  {
    table: "feature_drawn_lines",
    trigger: "update_feature_drawn_lines_council_district",
  },
  {
    table: "feature_drawn_points",
    trigger: "update_feature_drawn_points_council_district",
  },
  {
    table: "feature_drawn_points",
    trigger: "update_feature_drawn_points_council_district",
  },
  {
    table: "feature_intersections",
    trigger: "update_feature_intersections_council_district",
  },
  {
    table: "feature_intersections",
    trigger: "update_feature_intersections_council_district",
  },
  {
    table: "feature_signals",
    trigger: "update_feature_signals_council_district",
  },
  {
    table: "feature_signals",
    trigger: "update_feature_signals_council_district",
  },
  {
    table: "feature_street_segments",
    trigger: "update_feature_street_segments_council_district",
  },
  {
    table: "feature_street_segments",
    trigger: "update_feature_street_segments_council_district",
  },
  {
    table: "moped_proj_phases",
    trigger: "set_moped_proj_phases_confirmed_dates_trigger",
  },
  {
    table: "moped_proj_phases",
    trigger: "set_moped_proj_phases_confirmed_dates_trigger",
  },
];

const fields = [
  {
    in: "ProjectID",
    out: "interim_project_id",
    required: true,
  },
  {
    in: "ProjectName",
    out: "project_name",
    required: true,
  },
  {
    in: "Description",
    out: "project_description",
    required: false,
    transform(row) {
      // there are projects w/o descriptions :/
      return row["Description"] || "-";
    },
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

  logger.info("✅ Users downloaded");

  if (env === "pizzaa") {
    if (false) {
      /** Not necessary when running our final tests! */
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

      logger.info("Deleting users and resetting ID sequence....");
      await runSql({
        env,
        sql: "DELETE FROM moped_users where 1=1; SELECT setval('moped_users_user_id_seq', 1, FALSE);",
      });
      logger.info("✅ Users deleted");
    }
    logger.info("Creating users from production...");
    try {
      await createUsers(env);
    } catch (error) {
      debugger;
    }

    logger.info("✅ Users created");
  }

  logger.info("⬇️ Downloading existing projects...");
  const { moped_project: existingProjects } = await makeHasuraRequest({
    query: EXISTING_PROJECTS_QUERY,
    env,
  });

  logger.info("⬇️ Downloading existing components...");
  const { moped_proj_components: existingComponents } = await makeHasuraRequest(
    {
      query: EXISTING_COMPONENTS_QUERY,
      env,
    }
  );

  logger.info("⚙️ Transforming project data into Moped schema...");

  const data = loadJsonFile(FNAME);

  /**
   * Construct basic project objects
   */
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

  /**
   * Build other project properties and related records
   */
  const { projPhases, projNotes } = getProjPhasesAndNotes();
  const { projMilestones, projPhasesFromDates } = getMilestones();
  const projComponents = await getComponents(env);
  const workAcivities = await getWorkActivities();
  const personnel = getPersonnel();
  const funding = await getFunding();

  /**
   * Assemble final project objects
   */
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

    /**
     * Munge all the phase data we have to
     * - dedupe them bc they can be created by phases and special milestones
     * - figure out of the date is confirmed
     */
    const newPhasesIndex = {};
    phases.forEach(
      ({
        phase_id,
        subphase_id,
        phase_start,
        is_current_phase,
        is_phase_start_confirmed,
      }) => {
        const key = `${phase_id}_${subphase_id || null}`;
        newPhasesIndex[key] ??= {
          phase_id,
          subphase_id,
          phase_start,
          is_current_phase: false,
          is_phase_start_confirmed: false,
        };
        if (is_current_phase) {
          newPhasesIndex[key].is_current_phase = is_current_phase;
        }
        if (is_phase_start_confirmed) {
          // phase start is going to be confirmed if
          // - it came from a status update
          // - it came from a milestone with an "actual date"
          newPhasesIndex[key].is_phase_start_confirmed = true;
          // make sure we take the earliest confirmed start date
          const oldPhaseStart = new Date(newPhasesIndex[key].phase_start);
          const newPhaseStart = new Date(phase_start);
          if (newPhaseStart.getTime() < oldPhaseStart.getTime()) {
            newPhasesIndex[key].phase_start = phase_start;
          }
        }
      }
    );

    phases = Object.values(newPhasesIndex);

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

    // set flag to track that this is a migrated project
    proj.is_migrated_from_access_db = true;
  });

  const mopedProjectData = deDupeProjs(
    projects,
    existingProjects,
    existingComponents
  );

  const projectDataFilename = `./data/ready/project_data_${env}.json`;
  const projectDataBackupFilename = `./backup/project_data_${env}_${new Date().getTime()}.json`;

  saveJsonFile(projectDataFilename, mopedProjectData);
  saveJsonFile(projectDataBackupFilename, mopedProjectData);

  logger.info(`✅ Data transform complete!`);
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
