const { gql } = require("graphql-request");
const { getProjPhasesAndNotes } = require("./moped_proj_phases");
const { ENTITIES_MAP } = require("./mappings/entities");
const { makeHasuraRequest } = require("./utils/graphql");
const { loadJsonFile } = require("./utils/loader");
const { logger } = require("./utils/logger");

const FNAME = "./data/raw/projects.json";

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
];

const mapRow = (row) =>
  fields.reduce((newRow, field) => {
    if (field.transform) {
      newRow[field.out] = field.transform(row);
    } else {
      newRow[field.out] = row[field.in];
    }
    return newRow;
  }, {});

const getInvalidFields = (row) => {
  const invalidFields = fields
    .filter((field) => field.required)
    .filter((field) => !row[field.out])
    .map((field) => field.out);
  if (invalidFields.length) {
    return invalidFields;
  }
};

function main() {
  const data = loadJsonFile(FNAME);

  const ready = data
    .map((row) => {
      const newRow = mapRow(row);
      if (getInvalidFields(newRow)) {
        return null;
        // throw getInvalidFields(newRow).join(", ");
      }
      return newRow;
    })
    .filter((row) => !!row);

  const { projPhases, projNotes } = getProjPhasesAndNotes();

  // attach proj phases to projects
  ready.forEach((proj) => {
    const { interim_project_id } = proj;
    const phases = projPhases[interim_project_id];
    if (phases?.length) {
      proj.moped_proj_phases = { data: phases };
    }

    const notes = projNotes[interim_project_id];

    if (notes?.length) {
      proj.moped_proj_notes = { data: notes };
    }
  });

  logger.info(`Inserting ${ready.length} projects...`);
  const res = makeHasuraRequest({
    query: INSERT_PROJECTS_MUTATION,
    variables: { objects: ready },
  }).then((what) => {
    console.log("HI", what);
  });
}

main();

// def test_is_valid(row):
//     assert all([row[field["out"]] for field in fields if field["required"]])
