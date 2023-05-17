const { v4: uuidv4 } = require("uuid");
const { loadJsonFile, saveJsonFile } = require("./utils/loader");
const { COMPONENTS_MAP } = require("./mappings/components");
const { SUBCOMPONENTS_MAP } = require("./mappings/subcomponents");
const { PHASES_MAP } = require("./mappings/phases");
const { mapRow } = require("./utils/misc");
const { getComponentTags } = require("./moped_proj_component_tags");

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
const FACILITY_GEOM_LINES_FNAME = "./data/agol/ctn_segments_matched.geojson";
const FACILITY_GEOM_POINTS_FNAME = "./data/agol/ctn_points_matched.geojson";
const FACILITIES = loadJsonFile(FACILITIES_FNAME);
const FACILITY_ATTRS = loadJsonFile(FACILITY_ATTRS_FNAME);
const LINE_FEATURES = loadJsonFile(FACILITY_GEOM_LINES_FNAME);
const POINT_FEATURES = loadJsonFile(FACILITY_GEOM_POINTS_FNAME);

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
  {
    in: "FacilityPhaseOverride",
    out: "phase_id",
    transform(row) {
      const phaseName = row[this.in];
      const phaseId = PHASES_MAP.find((phase) => phase.in === phaseName)?.out
        ?.phase_id;
      return phaseId || null;
    },
  },
  { in: "ActualEndDateFacilityOverride", out: "completion_date" },
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

/**
 * Convert point geomtery to MultiPoint
 */
const makeMultiPoint = (geometry) => {
  if (geometry.type !== "Point") {
    throw "Not a point geomtery";
  }
  return { type: "MultiPoint", coordinates: [geometry.coordinates] };
};

const isSignalComponent = (componentId) => [16, 18].includes(componentId);

/**
 * We cannot bring a signal component into Moped if it does not match
 * a known AMD signal asset. As a work around, we  can convert the
 * component to a generic "Intersection Improvement" component.
 */
const convertSignalToIntersectionComponent = (component) => {
  const componentType =
    component.component_id === 16 ? "Pedestrian" : "Traffic";
  component.description = `${componentType} signal - ${
    component.description || ""
  }`;
  component.component_id = 66; // "Intersection improvement"
};

function getComponents() {
  const tagIndex = getComponentTags();

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

  const unmapped = [];
  const multigeotype = [];

  // todo: log when a component is filtered/excluded!
  const componentIndex = components
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

      // attached tags
      const tags = tagIndex[interim_project_component_id];
      if (tags?.length > 0) {
        comp.moped_proj_component_tags = { data: tags };
      }

      // attach features
      const drawnLineFeature =
        LINE_FEATURES[interim_project_component_id]?.originalFeature;

      const ctnLineFeatures =
        LINE_FEATURES[interim_project_component_id]?.ctnFeatures;

      const drawnPointFeature =
        POINT_FEATURES[interim_project_component_id]?.originalFeature;

      const ctnPointFeature =
        POINT_FEATURES[interim_project_component_id]?.ctnFeature;

      const signalFeature =
        POINT_FEATURES[interim_project_component_id]?.signalFeature;

      if (drawnPointFeature && drawnLineFeature) {
        // todo: how to handle?
        multigeotype.push(comp);
        console.log("skipping multigeotype - count at ", multigeotype.length);
        return index;
      }

      /**
       * check if unmatched signal component - which needs special handling
       */
      const unMatchedSignalComponent =
        isSignalComponent(comp.component_id) && !signalFeature;

      if (unMatchedSignalComponent) {
        convertSignalToIntersectionComponent(comp);
      }

      if (isSignalComponent(comp.component_id) && signalFeature) {
        const featureRecord = {
          signal_id: parseInt(signalFeature.properties.SIGNAL_ID),
          knack_id: signalFeature.properties.id,
          location_name: signalFeature.properties.LOCATION_NAME,
          signal_type: signalFeature.properties.SIGNAL_TYPE,
          geography: signalFeature.geometry,
        };
        if (featureRecord.geography.type !== "MultiPoint") {
          // make multipoint if necessary :/
          // some signals are multipoint already, which is baffling but ok
          featureRecord.geography.type = "MultiPoint";
          featureRecord.geography.coordinates = [
            featureRecord.geography.coordinates,
          ];

          comp.feature_signals = { data: featureRecord };
        }
      } else if (drawnLineFeature) {
        // convert to multiline: //todo: do this in preprocessign script
        if (drawnLineFeature.geometry.type === "LineString") {
          drawnLineFeature.geometry.type = "MultiLineString";
          drawnLineFeature.geometry.coordinates = [
            drawnLineFeature.geometry.coordinates,
          ];
        }
        const featureRecord = {
          source_layer: "drawnByUserLine",
          project_extent_id: uuidv4(),
          geography: drawnLineFeature.geometry,
        };
        comp.feature_drawn_lines = { data: featureRecord };
      } else if (drawnPointFeature) {
        if (ctnPointFeature) {
          const featureRecord = {
            source_layer: "ATD_ADMIN.CTN_Intersections",
            intersection_id: ctnPointFeature.properties.INTERSECTIONID,
            geography: makeMultiPoint(ctnPointFeature.geometry),
          };
          comp.feature_intersections = { data: featureRecord };
        } else {
          const featureRecord = {
            source_layer: "drawnByUserPoint",
            project_extent_id: uuidv4(),
            geography: makeMultiPoint(drawnPointFeature.geometry),
          };
          comp.feature_drawn_points = { data: featureRecord };
        }
      } else {
        // todo: how to handle?
        unmapped.push(comp);
      }

      const projectId = comp.interim_project_id;
      index[projectId] ??= [];
      delete comp.interim_project_id;
      index[projectId].push(comp);

      if (ctnLineFeatures?.length > 0) {
        // temp duplicate component with snapped segments
        const comp2 = { ...comp };
        comp2.description = "CTN SEGMENTS ONLY";
        comp2.feature_drawn_lines = { data: [] };
        comp2.feature_street_segments = {
          data: ctnLineFeatures.map((segment) => {
            const geography = segment.geometry;
            if (geography.type === "LineString") {
              geography.coordinates = [geography.coordinates];
              geography.type = "MultiLineString";
            }
            return {
              ctn_segment_id: segment.properties.CTN_SEGMENT_ID,
              from_address_min: segment.properties.FROM_ADDRESS_MIN,
              to_address_max: segment.properties.TO_ADDRESS_MAX,
              full_street_name: segment.properties.FULL_STREET_NAME,
              line_type: segment.properties.LINE_TYPE,
              source_layer: "ATD_ADMIN.CTN",
              geography,
            };
          }),
        };
        index[projectId].push(comp2);
      }

      return index;
    }, {});

  // uncomment to create file for debugging unmapped components
  const unmappedFacilities = unmapped.map((comp) => {
    const id = comp.interim_project_component_id;
    const f = FACILITIES.find((f) => f.Project_FacilityID === id);
    return {
      project_id: f.ProjectID,
      facility_id: f.Project_FacilityID,
      facility_type: f.FacilityType,
      location_detail: f.LocationDetail,
    };
  });
  saveJsonFile("./data/unmapped_components_results.json", unmappedFacilities);
  return componentIndex;
}

exports.getComponents = getComponents;
