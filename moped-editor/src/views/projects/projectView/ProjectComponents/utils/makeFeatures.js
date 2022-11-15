import { getDrawId } from "./features";

/*
 * When we insert in the DB we need to translate the property names that either come from a CTN layer
 * or the draw tools into columns names in the database.
 * This is also used to track all layers of data present in the map.
 */
export const featureTableFieldMap = {
  feature_street_segments: {
    full_street_name: "FULL_STREET_NAME",
    ctn_segment_id: "CTN_SEGMENT_ID",
    from_address_min: "FROM_ADDRESS_MIN",
    to_address_max: "TO_ADDRESS_MAX",
    line_type: "LINE_TYPE",
    // project_extent_id: NULL,
    // knack_id: NULL,
    // symbol: undefined,
    // render_type: undefined,
    // name: NULL
  },
  feature_intersections: {
    intersection_id: "COA_INTERSECTION_POINTS_ID",
    // project_extent_id: NULL,
    // render_type: undefined,
    // name: NULL
  },
  feature_signals: {
    // TODO: Update when signal autocomplete is added
    // See https://github.com/cityofaustin/atd-data-tech/issues/10511
    // location_name: undefined,
    // knack_id: undefined,
    // project_extent_id: undefined,
    // render_type: undefined,
    // name: undefined
    // signal_type: undefined
    // signal_id: undefined
  },
  feature_drawn_lines: {
    // name: NULL
  },
  feature_drawn_points: {
    // name: NULL
  },
};

/**
 * Prepare LineString features for insertion into the database
 * @param {String} featureTable - name of database table to insert into
 * @param {Array} featuresToProcess - array of feature objects to prepare for insertion
 * @param {Array} featuresToInsert - array to contain feature objects ready to insert
 * @returns {Array} - array of MultiLineString feature objects ready to insert
 */
export const makeLineStringFeatureInsertionData = (
  featureTable,
  featuresToProcess,
  featuresToInsert
) => {
  featuresToProcess.forEach((feature) => {
    const featureToInsert = {};
    const translationMap = featureTableFieldMap[featureTable];

    Object.keys(translationMap).forEach((key) => {
      const translatedKey = translationMap[key];

      featureToInsert[key] = feature.properties[translatedKey];
    });

    // Add source_layer
    featureToInsert["source_layer"] = feature.properties._layerId;

    // Convert from LineString to a MultiLineString
    const coordinatesArray = feature.geometry.coordinates;

    featureToInsert["geography"] = {
      type: "MultiLineString",
      coordinates: [coordinatesArray],
    };

    featuresToInsert.push(featureToInsert);
  });

  return featuresToInsert;
};

/**
 * Prepare Point features for insertion into the database
 * @param {String} featureTable - name of database table to insert into
 * @param {Array} featuresToProcess - array of feature objects to prepare for insertion
 * @param {Array} featuresToInsert - array to contain feature objects ready to insert
 * @returns {Array} - array of MultiPoint feature objects ready to insert
 */
export const makePointFeatureInsertionData = (
  featureTable,
  featuresToProcess,
  featuresToInsert
) => {
  featuresToProcess.forEach((feature) => {
    const featureToInsert = {};
    const translationMap = featureTableFieldMap[featureTable];

    Object.keys(translationMap).forEach((key) => {
      const translatedKey = translationMap[key];

      featureToInsert[key] = feature.properties[translatedKey];
    });

    // Add source_layer
    featureToInsert["source_layer"] = feature.properties._layerId;

    // Convert from Point to a MultiPoint
    const coordinatesArray = feature.geometry.coordinates;

    featureToInsert["geography"] = {
      type: "MultiPoint",
      coordinates: [coordinatesArray],
    };

    featuresToInsert.push(featureToInsert);
  });

  return featuresToInsert;
};

/**
 * Prepare Drawn LineString features for insertion into the database
 * @param {String} featureTable - name of database table to insert into
 * @param {Array} featuresToProcess - array of feature objects to prepare for insertion
 * @param {Array} featuresToInsert - array to contain feature objects ready to insert
 * @returns {Array} - array of drawn MultiLineString feature objects ready to insert
 */
export const makeDrawnLinesInsertionData = (
  featuresToProcess,
  featuresToInsert
) => {
  featuresToProcess.forEach((feature) => {
    const featureToInsert = {};

    // Convert DRAW_ID from map tools library to project_extent_id
    featureToInsert["project_extent_id"] = getDrawId(feature);

    // Add source_layer
    featureToInsert["source_layer"] = feature.properties._layerId;

    // Convert from Point to a MultiPoint
    const coordinatesArray = feature.geometry.coordinates;

    featureToInsert["geography"] = {
      type: "MultiLineString",
      coordinates: [coordinatesArray],
    };

    featuresToInsert.push(featureToInsert);
  });

  return featuresToInsert;
};

/**
 * Prepare Drawn Point features for insertion into the database
 * @param {String} featureTable - name of database table to insert into
 * @param {Array} featuresToProcess - array of feature objects to prepare for insertion
 * @param {Array} featuresToInsert - array to contain feature objects ready to insert
 * @returns {Array} - array of drawn MultiPoint feature objects ready to insert
 */
export const makeDrawnPointsInsertionData = (
  featuresToProcess,
  featuresToInsert
) => {
  featuresToProcess.forEach((feature) => {
    const featureToInsert = {};

    // Convert DRAW_ID from map tools library to project_extent_id
    featureToInsert["project_extent_id"] = getDrawId(feature);

    // Add source_layer
    featureToInsert["source_layer"] = feature.properties._layerId;

    // Convert from Point to a MultiPoint
    const coordinatesArray = feature.geometry.coordinates;

    featureToInsert["geography"] = {
      type: "MultiPoint",
      coordinates: [coordinatesArray],
    };

    featuresToInsert.push(featureToInsert);
  });

  return featuresToInsert;
};
