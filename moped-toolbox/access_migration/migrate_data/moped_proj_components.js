const { v4: uuidv4 } = require("uuid");
const centroid = require("@turf/centroid").default;
const { loadJsonFile, saveJsonFile } = require("./utils/loader");
const { gql } = require("graphql-request");
const { makeHasuraRequest } = require("./utils/graphql");
const {
  COMPONENTS_MAP,
  COMPONENT_WORK_TYPES_MAP,
} = require("./mappings/components");
const {
  SUBCOMPONENTS_MAP,
  PROTECTION_SUBCOMPONENTS_MAP,
} = require("./mappings/subcomponents");
const { PHASES_MAP } = require("./mappings/phases");
const { mapRow, mapRowExpanded } = require("./utils/misc");
const { getComponentTags } = require("./moped_proj_component_tags");
const { logger } = require("./utils/logger");

/** Access DB tables related to components/facilities
 * Facility_Attributes - actuals associated with project facility instances (many to one)
 * Facility_AttributesTypes - domain/lookup for facility attributes - moped subcomponents
 * Facility_AttributeTypeApplicability - defines which facility types apply to which facility attributes
 * Facility_PhysicalProtectionTypes - lookup for physical protection on project_facilities instances
 * Project_Facilities - instances of project facilities - effectively moped_proj_components
 * Project_FacilityTypes - facility domain - effectively moped_components
 */
// facilities must be downloaded from AGOL - see README
const FACILITIES_FNAME = "./data/raw/project_facilities.json";
const FACILITY_ATTRS_FNAME = "./data/raw/facility_attributes.json";
// matched CTN features must be pre-processed - see README
const FACILITY_GEOM_LINES_FNAME = "./data/agol/ctn_segments_matched.geojson";
const FACILITY_GEOM_POINTS_FNAME = "./data/agol/ctn_points_matched.geojson";
const FACILITIES = loadJsonFile(FACILITIES_FNAME);
const FACILITY_ATTRS = loadJsonFile(FACILITY_ATTRS_FNAME);
const LINE_FEATURES = loadJsonFile(FACILITY_GEOM_LINES_FNAME);
const POINT_FEATURES = loadJsonFile(FACILITY_GEOM_POINTS_FNAME);

/**
 * We'll use a copy of the component data to identify when the incoming geomgetry type
 * does not match moped's component geom type expectations
 */
const COMPONENT_LOOKUP_QUERY = gql`
  query GetComponents {
    moped_components(where: { is_deleted: { _eq: false } }) {
      component_id
      line_representation
    }
  }
`;

// we are applying mapRowExpanded on this field set!
const componentFields = [
  {
    in: "FacilityType",
    out: "component_id",
    required: true,
    transform(oldRow, newRow) {
      const facilityType = oldRow[this.in];
      if (!facilityType) {
        // it happens! ignore
        return;
      }
      const componentName = facilityType;
      const component = COMPONENTS_MAP.find(
        (comp) => comp.in === componentName
      );

      if (!component) {
        throw `Unknown FacilityType type encountered: ${facilityType}`;
      } else if (component.out === null) {
        // known component to ignore
        return;
      }

      newRow[this.out] = component ? component.out : null;
      // yep - loads of one-off customizations in here
      if (componentName === "Bike Lane - Removed") {
        newRow.description = "Bike Lane - Removed";
        newRow.moped_proj_component_work_types = {
          // add remove bike lane work type
          data: [{ work_type_id: 10 }],
        };
      } else if (componentName === "Crosswalk - Remove") {
        newRow.description = "Remove crosswalk";
      } else if (componentName === "Miscellaneous") {
        newRow.description = "Remove crosswalk";
      } else if (componentName === "Remove DY") {
        newRow.description = "Remove double-yellow striping.";
        newRow.moped_proj_component_work_types = {
          // add remove double yellow work type
          data: [{ work_type_id: 11 }],
        };
      } else if (componentName === "Sidewalk - Fix Obstructions") {
        newRow.description = "Fix sidewalk obstructions.";
      } else if (componentName === "Trim Vegetation") {
        newRow.description = "Trim vegetation. ";
      } else if (componentName === "New Street") {
        newRow.moped_proj_component_work_types = {
          // add `New` work type
          data: [{ work_type_id: 7 }],
        };
      }
    },
  },
  {
    in: "ProjectType",
    out: "",
    required: true,
    transform(oldRow, newRow) {
      const projectType = oldRow.ProjectType;
      if (!projectType) {
        return;
      }
      const work_type_id = COMPONENT_WORK_TYPES_MAP.find(
        (c) => c.in === projectType
      )?.out;

      if (projectType === "Lane Width") {
        // update description
        // we're dumping data into description from other transforms,
        // so we can't just overwrite it here.
        const prevDescription = newRow.description || "";
        const separator = prevDescription ? " - " : "";
        newRow.description = `${prevDescription}${separator}"reduce lane width"`;
        return;
      }
      if (work_type_id) {
        // make sure not to overwrite any other work types that might
        // already be present
        newRow.moped_proj_component_work_types ??= { data: [] };
        newRow.moped_proj_component_work_types.data.push({
          work_type_id,
        });
      }
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
  {
    in: "LocationDetail",
    out: "location_description",
  },
  {
    in: "FacilityPhaseOverride",
    out: "phase_id",
    transform(oldRow, newRow) {
      const phaseName = oldRow[this.in];
      const phaseId = PHASES_MAP.find((phase) => phase.in === phaseName)?.out
        ?.phase_id;
      newRow[this.out] = phaseId || null;
    },
  },
  { in: "ActualEndDateFacilityOverride", out: "completion_date" },
  { in: "SRTS_ID", out: "srts_id" },
  {
    in: "Protection Type",
    out: "protection_type_subcomponent",
    transform(oldRow, newRow) {
      const protectionType = oldRow[this.in];
      if (protectionType) {
        const subcomp = PROTECTION_SUBCOMPONENTS_MAP.find(
          (subcomp) => subcomp.in === protectionType
        );
        newRow[this.out] = subcomp ? { subcomponent_id: subcomp?.out } : null;
        if (!subcomp && protectionType !== "TBD") {
          throw `Unknown protection type ${protectionType}`;
        }
      }
    },
  },
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

async function getComponents(env) {
  logger.info("Downloading component lookup...");
  const componentLookupData = await makeHasuraRequest({
    query: COMPONENT_LOOKUP_QUERY,
    env,
  });

  logger.info("✅ Components downloaded");
  const compLookup = componentLookupData.moped_components;

  const tagIndex = getComponentTags();

  const components = FACILITIES.map((row) =>
    mapRowExpanded(row, componentFields)
  );
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

  const componentIndex = components
    .filter(
      (component) =>
        component &&
        component.component_id !== null &&
        component.component_id !== undefined
    )
    .reduce((index, comp) => {
      const { interim_project_component_id } = comp;
      // attach subcomponents
      const theseSubccomponents =
        subcomponentIndex[interim_project_component_id] || [];

      const protectionSubcomponent = comp.protection_type_subcomponent;

      if (protectionSubcomponent) {
        theseSubccomponents.push(protectionSubcomponent);
      }

      if (theseSubccomponents.length > 0) {
        comp.moped_proj_components_subcomponents = {
          data: theseSubccomponents,
        };
      }

      // remove this temporary prop
      delete comp.protection_type_subcomponent;

      // attached tags
      const tags = tagIndex[interim_project_component_id];
      if (tags?.length > 0) {
        comp.moped_proj_component_tags = { data: tags };
      }

      // attach features
      const drawnLineFeature =
        LINE_FEATURES[interim_project_component_id]?.originalFeature;

      // we've decided not to corporate the line-matched features
      // due to too many mismatches
      // const ctnLineFeatures =
      //   LINE_FEATURES[interim_project_component_id]?.ctnFeatures;

      const drawnPointFeature =
        POINT_FEATURES[interim_project_component_id]?.originalFeature;

      const ctnPointFeature =
        POINT_FEATURES[interim_project_component_id]?.ctnFeature;

      const signalFeature =
        POINT_FEATURES[interim_project_component_id]?.signalFeature;

      if (drawnPointFeature && drawnLineFeature) {
        // todo: how to handle?
        logger.info(
          "🙈 skipping geodata for facility ID ",
          comp.interim_project_component_id,
          " because it has both point and line geomteries"
        );
        return index;
      }
      /**
       * check if unmatched signal component - which needs special handling
       */
      // const unMatchedSignalComponent =
      //   isSignalComponent(comp.component_id) && !signalFeature;

      // if (unMatchedSignalComponent) {
      //   convertSignalToIntersectionComponent(comp);
      //
      if (isSignalComponent(comp.component_id) && signalFeature) {
        const featureRecord = {
          signal_id: parseInt(signalFeature.properties.SIGNAL_ID),
          knack_id: signalFeature.properties.id,
          location_name: signalFeature.properties.LOCATION_NAME.trim(),
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
        // set location as we do for signals in moped editor.
        comp.location_description = `${featureRecord.signal_id}: ${featureRecord.location_name}`;
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

      if (
        comp.component_id === 60 &&
        (comp.feature_drawn_points || comp.feature_intersections)
      ) {
        // use intersection lighting instead of street lighting because
        // component is a point
        comp.component_id = 61;
      } else if (comp.component_id === 59 && comp.feature_drawn_lines) {
        // use linear signage component
        comp.component_id = 98;
      }

      // note: we are not translating any component geogs
      // to feature_street_segments - we can ignore it
      const layers = [
        "feature_drawn_lines",
        "feature_drawn_points",
        "feature_intersections",
        "feature_signals",
      ];

      // we can assume component only has data for one layer because we are dropping cases where that is not true
      let componentLayer = layers.find((layerName) => !!comp[layerName]);

      const isLineComponent = componentLayer === "feature_drawn_lines";

      const expectLineComponent = !!compLookup.find(
        (c) => c.component_id === comp.component_id
      ).line_representation;

      if (isLineComponent && !expectLineComponent) {
        // make a point!

        // extract feature
        const oldFeature = comp[componentLayer].data;
        // delete the feature from the component payload
        delete comp[componentLayer];
        const pointFromLine = makeMultiPoint(
          centroid(oldFeature.geography).geometry
        );

        // update feature properties
        const feature = {
          project_extent_id: uuidv4(),
          geography: pointFromLine,
          source_layer: "drawnByUserPoint",
        };

        // save to new feature layer property
        comp.feature_drawn_points = {
          data: feature,
        };
        const comment =
          "(converted from a line feature during Access DB migration)";
        comp.description = `${comp.description || ""} ${comment}`.trim();
        logger.info(`converted component ID ${comp.component_id} to point`);
      } else if (componentLayer && !isLineComponent && expectLineComponent) {
        // point to very short line
        // extract feature
        const oldFeature = comp[componentLayer].data;
        // delete the feature from the component payload
        delete comp[componentLayer];

        // do some transform
        const coordinates = oldFeature.geography.coordinates[0];
        const newCoordinate = [
          coordinates[0] + 0.0001,
          coordinates[1] + 0.0001,
        ];
        const lineFromPoint = {
          type: "MultiLineString",
          coordinates: [[coordinates, newCoordinate]],
        };

        // create new feature properties
        const feature = {
          project_extent_id: uuidv4(),
          geography: lineFromPoint,
          source_layer: "drawnByUserLine",
        };

        // save to new feature layer property
        comp.feature_drawn_lines = {
          data: feature,
        };

        const comment =
          "(converted from a point feature during Access DB migration)";
        comp.description = `${comp.description || ""} ${comment}`.trim();
        logger.info(
          `converted component ID ${comp.component_id} to line for interimprojectid: ${comp.interim_project_id}`
        );
      }

      const projectId = comp.interim_project_id;
      index[projectId] ??= [];
      delete comp.interim_project_id;
      index[projectId].push(comp);

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
