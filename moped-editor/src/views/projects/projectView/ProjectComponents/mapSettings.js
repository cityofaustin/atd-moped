const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

// minimum map zoom to display selectable features, and
// also to query AGOL for them
export const MIN_SELECT_FEATURE_ZOOM = 15;

export const SOURCES = {
  "ctn-lines": {
    id: "ctn-lines",
    featureService: {
      name: "CTN_Segments_MOPED_FS",
      layerId: 0,
    },
    _featureIdProp: "CTN_SEGMENT_ID",
    minZoom: MIN_SELECT_FEATURE_ZOOM,
  },
  "ctn-points": {
    id: "ctn-points",
    featureService: {
      name: "LOCATION_coa_intersection_points",
      layerId: 0,
    },
    _featureIdProp: "INTERSECTION_ID",
    minZoom: MIN_SELECT_FEATURE_ZOOM,
  },
};

export const initialViewState = {
  latitude: 30.28,
  longitude: -97.74,
  zoom: 15,
};

/**
 * See: https://docs.mapbox.com/mapbox-gl-js/api/map/#map-parameters
 */
export const mapParameters = {
  touchPitch: false,
  dragRotate: false,
  maxBounds: [
    [-99, 29],
    [-96, 32],
  ],
  mapStyle: "mapbox://styles/mapbox/light-v10",
  mapboxAccessToken: MAPBOX_TOKEN,
};
