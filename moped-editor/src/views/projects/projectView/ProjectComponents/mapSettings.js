const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const NEARMAP_KEY = process.env.REACT_APP_NEARMAP_TOKEN;

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
  mapboxAccessToken: MAPBOX_TOKEN,
};

export const basemaps = {
  streets: "mapbox://styles/mapbox/light-v10",
  // Provide style parameters to render Nearmap tiles in react-map-gl
  // https://docs.mapbox.com/mapbox-gl-js/example/map-tiles/
  aerial: {
    version: 8,
    sources: {
      "raster-tiles": {
        type: "raster",
        tiles: [
          `https://api.nearmap.com/tiles/v3/Vert/{z}/{x}/{y}.jpg?apikey=${NEARMAP_KEY}`,
        ],
        tileSize: 256,
      },
    },
    layers: [
      {
        id: "simple-tiles",
        type: "raster",
        source: "raster-tiles",
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  },
};
