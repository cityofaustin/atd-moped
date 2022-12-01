const { loadJsonFile } = require("./utils/loader");
const FACILITIES_FNAME = "./data/raw/project_facilities.json";
const { COMPONENTS_MAP } = require("./mappings/components");

fields = [
  {
    in: "FacilityType",
    out: "component_id",
    required: true,
    transform(row) {
      const componentName = row[this.in];
      // todo: and if we don't have a component?
      return COMPONENTS_MAP.find((comp) => comp.in === componentName);
    },
  },
  {
    in: "ProjectID",
    out: "interim_project_id",
    required: true,
  },
  {
    in: "Project_FacilityID",
    out: "interim_component_id",
    required: true,
  },
  { in: "LocationDetail", out: "description" },
];

function getProjPhasesAndNotes() {
  const facilities = loadJsonFile(FACILITIES_FNAME);
  debugger;
}

getProjPhasesAndNotes();

exports.getProjPhasesAndNotes = getProjPhasesAndNotes;
