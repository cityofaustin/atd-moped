const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

export const MAP_STYLES = {
  "project-points": {
    id: "project-points",
    _featureIdProp: "INTERSECTION_ID",
    type: "circle",
    paint: {
      "circle-radius": {
        stops: [
          [10, 1],
          [20, 12],
        ],
      },
      "circle-stroke-color": "#fc0885",
      "circle-stroke-width": 2,
      "circle-stroke-opacity": 0.9,
      "circle-color": "#fc74ba",
      "circle-opacity": 0.9,
    },
  },
  "project-lines": {
    id: "project-lines",
    _featureIdProp: "CTN_SEGMENT_ID",
    type: "line",
    paint: {
      "line-width": {
        stops: [
          [10, 1],
          [20, 7],
        ],
      },
      "line-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "#b5055f",
        "#fc0885",
      ],
    },
    layout: {
      "line-cap": "round",
    },
  },
  "project-lines-underlay": {
    id: "project-lines-underlay",
    _featureIdProp: "CTN_SEGMENT_ID",
    type: "line",
    paint: {
      "line-width": 20,
      "line-color": "#fff",
      "line-opacity": 0,
    },
    layout: {
      "line-cap": "round",
    },
  },
  "ctn-lines": {
    _featureIdProp: "CTN_SEGMENT_ID",
    id: "ctn-lines",
    type: "line",
    paint: {
      "line-dasharray": [1, 2],
      "line-opacity": 0.4,
      "line-width": {
        stops: [
          [10, 0.5],
          [16, 3],
        ],
      },
      "line-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "#000",
        "#607d8f",
      ],
    },
    layout: {
      "line-cap": "round",
    },
    minzoom: 15,
  },
  "ctn-lines-underlay": {
    _featureIdProp: "CTN_SEGMENT_ID",
    id: "ctn-lines-underlay",
    type: "line",
    paint: {
      "line-opacity": 0,
      "line-width": 20,
      "line-color": "#fff",
    },
    layout: {
      "line-cap": "round",
    },
    minzoom: 15,
  },

  "ctn-points": {
    id: "ctn-points",
    type: "circle",
    _featureIdProp: "INTERSECTION_ID",
    paint: {
      "circle-radius": {
        stops: [
          [5, 2],
          [16, 6],
        ],
      },
      "circle-stroke-opacity": 0.9,
      "circle-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "black",
        "#607d8f",
      ],
      "circle-opacity": 0.4,
    },
    minzoom: 15,
  },
  "ctn-points-underlay": {
    id: "ctn-points-underlay",
    type: "circle",
    _featureIdProp: "INTERSECTION_ID",
    paint: {
      "circle-radius": {
        stops: [
          [5, 2],
          [16, 15],
        ],
      },
      "circle-stroke-opacity": 0,
      "circle-color": "#000",
      "circle-opacity": 0,
    },
    minzoom: 15,
  },
};

export const SOURCES = {
  "ctn-lines": {
    id: "ctn-lines",
    featureService: {
      name: "CTN_Segments_MOPED_FS",
      layerId: 0,
    },
    _featureIdProp: "CTN_SEGMENT_ID",
    minZoom: MAP_STYLES["ctn-lines"].minzoom,
  },
  "ctn-points": {
    id: "ctn-points",
    featureService: {
      name: "LOCATION_coa_intersection_points",
      layerId: 0,
    },
    _featureIdProp: "INTERSECTION_ID",
    minZoom: MAP_STYLES["ctn-points"].minzoom,
  },
};

export const initialViewState = {
  latitude: 30.28,
  longitude: -97.74,
  zoom: 14,
};

/**
 * See: https://docs.mapbox.com/mapbox-gl-js/api/map/#map-parameters
 */
export const mapSettings = {
  touchPitch: false,
  dragRotate: false,
  maxBounds: [
    [-99, 29],
    [-96, 32],
  ],
  mapStyle: "mapbox://styles/mapbox/light-v10",
  mapboxAccessToken: MAPBOX_TOKEN,
};
