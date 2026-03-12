const { gql } = require("graphql-request");
const { makeHasuraRequest } = require("./utils/graphql");
const { settings } = require("./utils/settings");
const { lookups } = require("./utils/lookups");

const DELETE_ALL_PROJECTS_MUTATION = gql`
  mutation DeleteAlllProjects {
    delete_moped_project(where: { project_id: { _is_null: false } }) {
      affected_rows
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

/* Get a random element from an array */
const randomArrElement = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const randomBool = () => !!Math.round(Math.random());

const randomInteger = (digits) =>
  Math.floor(Math.random() * Math.pow(10, digits));

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function randomString(length = 20) {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz    ";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const randomDate = () => {
  const dateMin = new Date("2010-01-01");
  const dateMax = new Date("2050-01-01");
  return new Date(
    dateMin.getTime() + Math.random() * (dateMax.getTime() - dateMin.getTime())
  );
};

const randomProjPhase = () => ({
  phase_start: randomDate(),
  phase_end: randomDate(),
  phase_id: randomArrElement(lookups.phases),
  subphase_id: randomArrElement(lookups.subphases),
});

const randomProjMilestone = () => ({
  milestone_id: randomArrElement(lookups.milestones),
  description: randomString(80),
  completed: randomBool(),
  date_actual: randomDate(),
  date_estimate: randomDate(),
});

const randomProjWorkActivity = () => ({
  contractor: randomString(),
  contract_number: randomString(),
  description: randomString(80),
  work_assignment_id: randomString(),
  task_orders: lookups.task_orders,
});

const randomProjPartner = () => ({
  entity_id: randomArrElement(lookups.entities),
});

const randomProjectType = () => ({
  project_type_id: randomArrElement(lookups.project_types),
});

const randomNote = () => ({
  project_note: randomString(200),
  project_note_type: randomArrElement(lookups.project_note_types),
  created_by_user_id: randomArrElement(lookups.users),
});

const randomTag = () => ({
  tag_id: randomArrElement(lookups.proj_tags),
});

const randomPersonnel = () => ({
  user_id: randomArrElement(lookups.users),
  notes: randomString(80),
  moped_proj_personnel_roles: {
    data: [...new Array(settings.roles_per_personnel)].map((_) => ({
      project_role_id: randomArrElement(lookups.proj_roles),
    })),
  },
});

const randomProjFunding = () => ({
  funding_source_id: randomArrElement(lookups.fund_sources),
  funding_program_id: randomArrElement(lookups.fund_programs),
  funding_amount: randomInteger(4),
  funding_description: randomString(80),
  funding_status_id: randomArrElement(lookups.fund_statuses),
  added_by: randomArrElement(lookups.users),
  fund: { fund_id: "8400", fund_name: "GCP-TPSD GENERAL IMPROVEMENTS" },
  dept_unit: {
    dept: "2507",
    unit: "9024",
    dept_id: "180775091",
    dept_unit_id: "359318059",
    unit_long_name: "Pay Station Parking Meter Replacement",
    unit_short_name: "8400-2507",
    dept_unit_status: "Active",
  },
});

const randomProjComponent = () => ({
  component_id: randomArrElement(lookups.components),
  srts_id: randomString(),
  description: randomString(),
  location_description: randomString(),
  feature_drawn_points: {
    data: [
      {
        geography: {
          type: "MultiPoint",
          crs: {
            type: "name",
            properties: {
              name: "urn:ogc:def:crs:EPSG::4326",
            },
          },
          coordinates: [[-97.706305, 30.256902]],
        },
        project_extent_id: randomString(),
        source_layer: "feature_drawn_points",
      },
    ],
  },
});

const randomProject = () => ({
  project_name: randomString(75),
  project_description: randomString(),
  project_lead_id: randomArrElement(lookups.entities),
  project_sponsor: randomArrElement(lookups.entities),
  project_website: "https://data.mobility.austin.gov",
  added_by: randomArrElement(lookups.users),
  knack_project_id: randomString(),
  interim_project_id: randomInteger(3),
  ecapris_subproject_id: "7333.001",
  moped_proj_partners: {
    data: [...new Array(settings.partners)].map((_) => randomProjPartner()),
  },
  moped_proj_funding: {
    data: [...new Array(settings.fund_sources)].map((_) => randomProjFunding()),
  },
  moped_proj_work_activities: {
    data: [...new Array(settings.contracts)].map((_) =>
      randomProjWorkActivity()
    ),
  },
  moped_proj_personnel: {
    data: [...new Array(settings.personnel)].map((_) => randomPersonnel()),
  },
  moped_proj_tags: {
    data: [...new Array(settings.tags)].map((_) => randomTag()),
  },
  moped_proj_notes: {
    data: [...new Array(settings.notes)].map((_) => randomNote()),
  },
  moped_proj_phases: {
    data: [...new Array(settings.proj_phases)].map((_, i) => {
      const projPhase = randomProjPhase();
      //   set one phase as current
      if (i === 0) {
        projPhase.is_current_phase = true;
      }
      return projPhase;
    }),
  },
  moped_proj_milestones: {
    data: [...new Array(settings.proj_milestones)].map((_) =>
      randomProjMilestone()
    ),
  },
  moped_project_types: {
    data: [...new Array(settings.types)].map((_) => randomProjectType()),
  },
  moped_proj_components: {
    data: [...new Array(settings.components)].map((_) => randomProjComponent()),
  },
});

const chunkProjects = (projects, chunkSize = 10) => {
  const chunks = [];
  for (let i = 0; i < projects.length; i += chunkSize) {
    chunks.push(projects.slice(i, i + chunkSize));
  }
  return chunks;
};

async function main() {
  console.log("Deleting all projects...");

  await makeHasuraRequest({
    query: DELETE_ALL_PROJECTS_MUTATION,
  });

  console.log(`Generating ${settings.projects} random projects...`);

  const projects = [...new Array(settings.projects)].map((_) =>
    randomProject()
  );

  const chunks = chunkProjects(projects);

  for (let i = 0; i < chunks.length; i++) {
    try {
      console.log(
        `${i + 1}/${chunks.length} - uploading ${chunks[i].length} projects...`
      );
      await makeHasuraRequest({
        query: INSERT_PROJECTS_MUTATION,
        variables: { objects: chunks[i] },
      });
    } catch (err) {
      console.error(err);
    }
  }
}

main();
