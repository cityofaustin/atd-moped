const { loadJsonFile } = require("./utils/loader");
const { COMPONENTS_MAP } = require("./mappings/components");
const { SUBCOMPONENTS_MAP } = require("./mappings/subcomponents");
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
const FACILITY_GEOM_FNAME = "./data/agol/ctn_segments_matched.geojson";
const FACILITIES = loadJsonFile(FACILITIES_FNAME);
const FACILITY_ATTRS = loadJsonFile(FACILITY_ATTRS_FNAME);
const LINE_FEATURES = loadJsonFile(FACILITY_GEOM_FNAME);

const componentFields = [
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
];

const subcomponentFields = [
  {
    in: "Attribute",
    out: "subcomponent_id",
    required: true,
    transform(row) {
      const attrName = row[this.in];
      const subcomp = SUBCOMPONENTS_MAP.find(
        (subcomp) => subcomp.in === attrName
      );
      if (!subcomp) {
        // todo: address these transforms: https://docs.google.com/spreadsheets/d/1mRvElKNrswuWKga_I1iHSD4-5J9m4UsOuB8n5oyGvDs/edit#gid=1846025869
        if (
          ![
            "Bicycle Signal TBD",
            "Reconfiguration",
            "Bicycle Improvement",
            "PHB to Traffic Signal",
            null,
          ].includes(attrName)
        ) {
          throw `Encountered unknown facility attribute with name: ${attrName}`;
        }
      }
      return subcomp?.out || null;
    },
  },
  {
    in: "Project_FacilityID",
    out: "interim_project_component_id",
  },
];

function getComponents() {
  const components = FACILITIES.map((row) => mapRow(row, componentFields));
  const subcomponents = FACILITY_ATTRS.map((row) =>
    mapRow(row, subcomponentFields)
  ).filter((subcomp) => subcomp.subcomponent_id);

  const subcomponentIndex = subcomponents.reduce(
    (index, { interim_project_component_id, subcomponent_id }) => {
      index[interim_project_component_id] ??= [];
      // we need to prevent dupe subcomponents from being added here
      // (it's possible in interim data becaue we're collapsing some subcomponent types into one)
      if (
        !index[interim_project_component_id].find(
          (sub) => sub.subcomponent_id === subcomponent_id
        )
      ) {
        index[interim_project_component_id].push({ subcomponent_id });
      }
      return index;
    },
    {}
  );

  return components
    .filter(
      (component) => component.component_id === 0 || !!component.component_id
    )
    .reduce((index, comp) => {
      const { interim_project_component_id } = comp;
      // attach subcomponents
      const theseSubccomponents =
        subcomponentIndex[interim_project_component_id];
      if (theseSubccomponents) {
        comp.moped_proj_components_subcomponents = {
          data: theseSubccomponents,
        };
      }
      // attach features
      const drawnLineFeature =
        LINE_FEATURES[interim_project_component_id]?.originalFeature;

      const ctnFeatures =
        LINE_FEATURES[interim_project_component_id]?.ctnFeatures;

      if (drawnLineFeature) {
        // convert to multiline: //todo: do this in preprocessign script
        if (drawnLineFeature.geometry.type === "LineString") {
          drawnLineFeature.geometry.type = "MultiLineString";
          drawnLineFeature.geometry.coordinates = [
            drawnLineFeature.geometry.coordinates,
          ];
        }
        const featureRecord = {
          source_layer: "drawnByUserLine",
          project_extent_id: "testtodouuid",
          geography: drawnLineFeature.geometry,
        };
        comp.feature_drawn_lines = { data: featureRecord };
      }
      const projectId = comp.interim_project_id;
      index[projectId] ??= [];
      delete comp.interim_project_id;
      index[projectId].push(comp);

      if (ctnFeatures?.length > 0) {
        // temp duplicate component with snapped segments
        const comp2 = { ...comp };

        comp2.description = "CTN SEGMENTS ONLY";
        comp2.feature_drawn_lines = { data: [] };
        comp2.feature_street_segments = {
          data: ctnFeatures.map((segment) => {
            const geography = segment.geometry;
            if (geography.type === "LineString") {
              geography.coordinates = [geography.coordinates];
              geography.type = "MultiLineString";
            }
            return {
              ctn_segment_id: segment.properties.CTN_SEGMENT_ID,
              from_address_min: segment.properties.FROM_ADDRESS_MIN,
              to_address_max: segment.properties.TO_ADDRESS_MAX,
              full_street_name: segment.properties.full_street_name,
              line_type: segment.properties.LINE_TYPE,
              source_layer: "ATD_ADMIN.CTN",
              geography,
            };
          }),
        };
        if (ctnFeatures?.length > 0) {
          console.log("check", projectId)
        }
        index[projectId].push(comp2);
      }

      return index;
    }, {});
}

getComponents();

exports.getComponents = getComponents;
