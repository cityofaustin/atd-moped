// Columns to add to object
// component_id
// source_layer (from _layerId in map) Ex. "ctn-lines"
// geography from geometry

export const featureTableFieldMap = {
  feature_street_segments: {
    full_street_name: "FULL_STREET_NAME",
    ctn_segment_id: "CTN_SEGMENT_ID",
    from_address_min: "FROM_ADDRESS_MIN",
    to_address_max: "TO_ADDRESS_MAX",
    line_type: "LINE_TYPE",
    project_extent_id: "OBJECTID",
    // knack_id: undefined,
    // symbol: undefined,
    // render_type: undefined,
  },
};
