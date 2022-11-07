// Columns to add to object
// component_id ✅
// source_layer (from _layerId in map) Ex. "ctn-lines" ✅
// geography from geometry ✅

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
  },
};

export const makeLineStringFeatureInsertionData = (
  featureTable,
  draftComponent,
  featuresToInsert
) => {
  draftComponent.features.forEach((feature) => {
    const featureToInsert = {};
    const translationMap = featureTableFieldMap[featureTable];

    Object.keys(translationMap).forEach((key) => {
      const translatedKey = translationMap[key];

      featureToInsert[key] = feature.properties[translatedKey];
    });

    // Add source_layer
    featureToInsert["source_layer"] = feature.properties._layerId;

    // Convert from LineString to  a MultiLineString
    const coordinatesArray = feature.geometry.coordinates;

    featureToInsert["geography"] = {
      type: "MultiLineString",
      coordinates: [coordinatesArray],
    };

    featuresToInsert.push(featureToInsert);
  });

  return featuresToInsert;
};
