import { MIN_SELECT_FEATURE_ZOOM } from "./mapSettings";
import theme from "src/theme/index";

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
  orange: "#ffb300",
  lightOrange: "#ffc94a",
};

export const pointsCircleRadiusStops = {
  stops: [
    // [zoom level, circle radius]
    [10, 1],
    [20, 12],
  ],
};

export const lineWidthStops = {
  stops: [
    // [zoom level, line width]
    [10, 2],
    [20, 10],
  ],
};

/**
 * Sets the interactivity and styles of the map layers
 * isInteractive - whether the layer is included in the map's interactiveLayerIds array
 * layerProps - spread into a layer component and these comply to the Mapbox layer style specs
 * Note - we set the underlays as interactive to give users more clickable area
 */
export const MAP_STYLES = {
  "project-points": {
    isInteractive: true,
    layerProps: {
      id: "project-points",
      _featureIdProp: "INTERSECTIONID",
      type: "circle",
      paint: {
        "circle-radius": pointsCircleRadiusStops,
        "circle-stroke-color": COLORS.bluePrimary,
        "circle-stroke-width": 2,
        "circle-stroke-opacity": 0.9,
        "circle-color": COLORS.blueLight,
        "circle-opacity": 0.9,
      },
    },
  },
  "project-lines": {
    isInteractive: true,
    layerProps: {
      id: "project-lines",
      _featureIdProp: "CTN_SEGMENT_ID",
      type: "line",
      paint: {
        "line-width": lineWidthStops,
        "line-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          COLORS.pinkDark,
          COLORS.bluePrimary,
        ],
      },
      layout: {
        "line-cap": "round",
      },
    },
  },
  "related-project-points": {
    isInteractive: true,
    layerProps: {
      id: "related-project-points",
      _featureIdProp: "INTERSECTIONID",
      type: "circle",
      paint: {
        "circle-radius": pointsCircleRadiusStops,
        "circle-stroke-color": theme.palette.map.green,
        "circle-stroke-width": 2,
        "circle-stroke-opacity": 0.9,
        "circle-color": theme.palette.map.greenLight,
        "circle-opacity": 0.9,
      },
    },
  },
  "related-project-lines": {
    isInteractive: true,
    layerProps: {
      id: "related-project-lines",
      _featureIdProp: "CTN_SEGMENT_ID",
      type: "line",
      paint: {
        "line-width": lineWidthStops,
        "line-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          COLORS.pinkDark,
          theme.palette.map.green,
        ],
      },
      layout: {
        "line-cap": "round",
      },
    },
  },
  "project-points-muted": {
    isInteractive: false,
    layerProps: {
      id: "project-points-muted",
      _featureIdProp: "INTERSECTIONID",
      type: "circle",
      paint: {
        "circle-radius": pointsCircleRadiusStops,
        "circle-stroke-color": COLORS.mutedGray,
        "circle-stroke-width": 2,
        "circle-stroke-opacity": 0.9,
        "circle-color": COLORS.mutedGray,
        "circle-opacity": 0.9,
      },
    },
  },
  "project-lines-muted": {
    isInteractive: false,
    layerProps: {
      id: "project-lines-muted",
      _featureIdProp: "CTN_SEGMENT_ID",
      type: "line",
      paint: {
        "line-width": lineWidthStops,
        "line-color": COLORS.mutedGray,
      },
      layout: {
        "line-cap": "round",
      },
    },
  },
  "project-lines-underlay": {
    isInteractive: true,
    layerProps: {
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
  },
  "draft-component-lines": {
    isInteractive: true,
    layerProps: {
      id: "draft-component-lines",
      _featureIdProp: "id",
      type: "line",
      paint: {
        "line-width": lineWidthStops,
        "line-color": COLORS.orange,
      },
      layout: {
        "line-cap": "round",
      },
    },
  },
  "draft-component-points": {
    isInteractive: true,
    layerProps: {
      id: "draft-component-points",
      _featureIdProp: "id",
      type: "circle",
      paint: {
        "circle-radius": pointsCircleRadiusStops,
        "circle-stroke-color": COLORS.orange,
        "circle-stroke-width": 2,
        "circle-color": COLORS.lightOrange,
      },
    },
  },
  "edit-draft-component-lines": {
    isInteractive: true,
    layerProps: {
      id: "edit-draft-component-lines",
      _featureIdProp: "id",
      type: "line",
      paint: {
        "line-width": lineWidthStops,
        "line-color": COLORS.orange,
      },
      layout: {
        "line-cap": "round",
      },
    },
  },
  "edit-draft-component-points": {
    isInteractive: true,
    layerProps: {
      id: "edit-draft-component-points",
      _featureIdProp: "id",
      type: "circle",
      paint: {
        "circle-radius": pointsCircleRadiusStops,
        "circle-stroke-color": COLORS.lightOrange,
        "circle-stroke-width": 2,
        "circle-stroke-opacity": 0.9,
        "circle-color": COLORS.orange,
        "circle-opacity": 0.9,
      },
    },
  },
  "ctn-lines": {
    isInteractive: true,
    layerProps: {
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
  },
  "ctn-lines-underlay": {
    isInteractive: true,
    layerProps: {
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
  },
  "ctn-points": {
    isInteractive: true,
    layerProps: {
      id: "ctn-points",
      type: "circle",
      _featureIdProp: "INTERSECTIONID",
      paint: {
        "circle-radius": pointsCircleRadiusStops,
        "circle-stroke-opacity": 0.4,
        "circle-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "black",
          COLORS.steel,
        ],
        "circle-opacity": 0.4,
        "circle-stroke-color": COLORS.steel,
        "circle-stroke-width": 2,
      },
      minzoom: MIN_SELECT_FEATURE_ZOOM,
    },
  },
  "ctn-points-underlay": {
    isInteractive: true,
    layerProps: {
      id: "ctn-points-underlay",
      type: "circle",
      _featureIdProp: "INTERSECTIONID",
      paint: {
        "circle-radius": pointsCircleRadiusStops,
        "circle-stroke-opacity": 0,
        "circle-color": COLORS.black,
        "circle-opacity": 0,
      },
      minzoom: MIN_SELECT_FEATURE_ZOOM,
    },
  },
  "clicked-component-features-lines": {
    isInteractive: false,
    layerProps: {
      id: "clicked-component-features-lines",
      featureIdProp: "id",
      type: "line",
      paint: {
        "line-width": lineWidthStops,
        "line-color": COLORS.bluePrimary,
      },
      layout: {
        "line-cap": "round",
      },
    },
  },
  "clicked-component-features-points": {
    isInteractive: false,
    layerProps: {
      id: "clicked-component-features-points",
      featureIdProp: "id",
      type: "circle",
      paint: {
        "circle-radius": pointsCircleRadiusStops,
        "circle-stroke-color": COLORS.blueDark,
        "circle-stroke-width": 2,
        "circle-stroke-opacity": 0.9,
        "circle-color": COLORS.blueLight,
        "circle-opacity": 0.9,
      },
    },
  },
  "clicked-related-features-lines": {
    isInteractive: false,
    layerProps: {
      id: "clicked-related-features-lines",
      featureIdProp: "id",
      type: "line",
      paint: {
        "line-width": lineWidthStops,
        "line-color": theme.palette.map.green,
      },
      layout: {
        "line-cap": "round",
      },
    },
  },
  "clicked-related-features-points": {
    isInteractive: false,
    layerProps: {
      id: "clicked-related-features-points",
      featureIdProp: "id",
      type: "circle",
      paint: {
        "circle-radius": pointsCircleRadiusStops,
        "circle-stroke-color": theme.palette.map.green,
        "circle-stroke-width": 2,
        "circle-stroke-opacity": 0.9,
        "circle-color": theme.palette.map.greenLight,
        "circle-opacity": 0.9,
      },
    },
  },
};
