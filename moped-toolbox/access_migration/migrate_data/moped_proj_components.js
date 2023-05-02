const { loadJsonFile } = require("./utils/loader");
const { COMPONENTS_MAP } = require("./mappings/components");
const { mapRow } = require("./utils/misc");
/**
 * Facility_Attributes - actuals associated with project facility instances (many to one)
 * Facility_AttributesTypes - domain/lookup for facility attributes - moped subcomponents
 * Facility_AttributeTypeApplicability - defines which facility types apply to which facility attributes
 * Facility_PhysicalProtectionTypes - lookup for physical protection on project_facilities instances
 * Project_Facilities - instances of project facilities - effectively moped_proj_components
 * Project_FacilityTypes - facility domain - effectively moped_components
 */
const FACILITIES_FNAME = "./data/raw/project_facilities.json";
const FACILITY_ATTRS_FNAME = "./data/raw/facility_attributes.json";

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
  const facilityAttrs = loadJsonFile(FACILITY_ATTRS_FNAME);

  debugger;
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

// getComponents();

exports.getComponents = getComponents;
