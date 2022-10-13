import { MIN_SELECT_FEATURE_ZOOM } from "./mapSettings";

export const MAPBOX_PADDING_PIXELS = 10;
export const MAPBOX_CONTROL_BUTTON_WIDTH = 29;

export const COLORS = {
  black: "#000",
  mutedGray: "#a6a2a2",
  pinkBright: "#fc0885",
  pinkLight: "#fc74ba",
  pinkDark: "#b5055f",
  bluePrimary: "#1276D1",
  blueDark: "#1069bc",
  blueLight: "#a1cdf7",
  steel: "#607d8f",
  white: "#fff",
};

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
      "circle-stroke-color": COLORS.pinkBright,
      "circle-stroke-width": 2,
      "circle-stroke-opacity": 0.9,
      "circle-color": COLORS.pinkLight,
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
          [10, 2],
          [20, 10],
        ],
      },
      "line-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        COLORS.pinkDark,
        COLORS.pinkBright,
      ],
    },
    layout: {
      "line-cap": "round",
    },
  },
  "project-points-muted": {
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
      "circle-stroke-color": COLORS.mutedGray,
      "circle-stroke-width": 2,
      "circle-stroke-opacity": 0.9,
      "circle-color": COLORS.mutedGray,
      "circle-opacity": 0.9,
    },
  },
  "project-lines-muted": {
    id: "project-lines",
    _featureIdProp: "CTN_SEGMENT_ID",
    type: "line",
    paint: {
      "line-width": {
        stops: [
          [10, 2],
          [20, 10],
        ],
      },
      "line-color": COLORS.mutedGray,
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
      "line-color": COLORS.white,
      "line-opacity": 0,
    },
    layout: {
      "line-cap": "round",
    },
  },
  "draft-component-lines": {
    id: "draft-component-lines",
    _featureIdProp: "id",
    type: "line",
    paint: {
      "line-width": {
        stops: [
          [10, 2],
          [20, 10],
        ],
      },
      "line-color": COLORS.bluePrimary,
    },
    layout: {
      "line-cap": "round",
    },
  },
  "draft-component-points": {
    id: "draft-component-points",
    _featureIdProp: "id",
    type: "circle",
    paint: {
      "circle-radius": {
        stops: [
          [10, 1],
          [20, 12],
        ],
      },
      "circle-stroke-color": COLORS.blueDark,
      "circle-stroke-width": 2,
      "circle-stroke-opacity": 0.9,
      "circle-color": COLORS.blueLight,
      "circle-opacity": 0.9,
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
        COLORS.black,
        COLORS.steel,
      ],
    },
    layout: {
      "line-cap": "round",
    },
    minzoom: MIN_SELECT_FEATURE_ZOOM,
  },
  "ctn-lines-underlay": {
    _featureIdProp: "CTN_SEGMENT_ID",
    id: "ctn-lines-underlay",
    type: "line",
    paint: {
      "line-opacity": 0,
      "line-width": 20,
      "line-color": COLORS.white,
    },
    layout: {
      "line-cap": "round",
    },
    minzoom: MIN_SELECT_FEATURE_ZOOM,
  },

  "ctn-points": {
    id: "ctn-points",
    type: "circle",
    _featureIdProp: "INTERSECTION_ID",
    paint: {
      "circle-radius": {
        stops: [
          [5, 4],
          [16, 10],
        ],
      },
      "circle-stroke-opacity": 0.9,
      "circle-color": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        "black",
        COLORS.steel,
      ],
      "circle-opacity": 0.4,
    },
    minzoom: MIN_SELECT_FEATURE_ZOOM,
  },
  "ctn-points-underlay": {
    id: "ctn-points-underlay",
    type: "circle",
    _featureIdProp: "INTERSECTION_ID",
    paint: {
      "circle-radius": {
        stops: [
          [10, 1],
          [20, 12],
        ],
      },
      "circle-stroke-opacity": 0,
      "circle-color": COLORS.black,
      "circle-opacity": 0,
    },
    minzoom: MIN_SELECT_FEATURE_ZOOM,
  },
  "clicked-component-features-lines": {
    id: "clicked-component-features-lines",
    featureIdProp: "id",
    type: "line",
    paint: {
      "line-width": {
        stops: [
          [10, 2],
          [20, 10],
        ],
      },
      "line-color": COLORS.bluePrimary,
    },
    layout: {
      "line-cap": "round",
    },
  },
  "clicked-component-features-points": {
    id: "clicked-component-features-points",
    featureIdProp: "id",
    type: "circle",
    paint: {
      "circle-radius": {
        stops: [
          [10, 1],
          [20, 12],
        ],
      },
      "circle-stroke-color": COLORS.blueDark,
      "circle-stroke-width": 2,
      "circle-stroke-opacity": 0.9,
      "circle-color": COLORS.blueLight,
      "circle-opacity": 0.9,
    },
  },
};
