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
    // project_extent_id: undefined,
    // knack_id: undefined,
    // symbol: undefined,
    // render_type: undefined,
    // name: undefined
  },
  feature_intersections: {
    intersection_id: "COA_INTERSECTION_POINTS_ID",
    // project_extent_id: undefined,
    // render_type: undefined,
    // name: undefined
  },
  feature_signals: {
    // location_name: undefined,
    // knack_id: undefined,
    // project_extent_id: undefined,
    // render_type: undefined,
    // name: undefined
    // signal_type: undefined
  },
  feature_drawn_lines: {},
  feature_drawn_points: {},
};

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

export const makeDrawnLinesInsertionData = (
  featuresToProcess,
  featuresToInsert
) => {
  featuresToProcess.forEach((feature) => {
    const featureToInsert = {};

    // Convert DRAW_ID from map tools library to project_extent_id
    featureToInsert["project_extent_id"] = feature.properties.DRAW_ID;

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

export const makeDrawnPointsInsertionData = (
  featuresToProcess,
  featuresToInsert
) => {
  featuresToProcess.forEach((feature) => {
    const featureToInsert = {};

    // Convert DRAW_ID from map tools library to project_extent_id
    featureToInsert["project_extent_id"] = feature.properties.DRAW_ID;

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
