const { loadJsonFile } = require("./utils/loader");
const FACILITIES_FNAME = "./data/raw/project_facilities.json";

fields = [
  {
    in: "FacilityType",
    out: "component_id",
    required: true,
    transform(row) {
      const componentName = row[this.in];
      return "get from some mapping";
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
