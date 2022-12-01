const { loadJsonFile } = require("./utils/loader");
const FACILITIES_FNAME = "./data/raw/project_facilities.json";
const { COMPONENTS_MAP } = require("./mappings/components");
const { mapRow } = require("./utils/mapper");

const fields = [
  {
    in: "FacilityType",
    out: "component_id",
    required: true,
    transform(row) {
      const componentName = row[this.in];
      const component = COMPONENTS_MAP.find(
        (comp) => comp.in === componentName
      );
      return component?.out || null;
    },
  },
  {
    in: "ProjectID",
    out: "interim_project_id",
    required: true,
  },
  {
    in: "Project_FacilityID",
    out: "interim_project_component_id",
    required: true,
  },
  { in: "LocationDetail", out: "description" },
  {
    in: null,
    out: "name",
    required: true,
    transform() {
      return "todo: what is the purpose of this field?";
    },
  },
];

function getComponents() {
  const facilities = loadJsonFile(FACILITIES_FNAME);

  const components = facilities.map((row) => mapRow(row, fields));

  return components
    .filter(
      (component) => component.component_id === 0 || !!component.component_id
    )
    .reduce((index, comp) => {
      const projectId = comp.interim_project_id;
      index[projectId] ??= [];
      delete comp.interim_project_id;
      index[projectId].push(comp);
      return index;
    }, {});
}
``;

exports.getComponents = getComponents;
