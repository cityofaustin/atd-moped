import { MIN_SELECT_FEATURE_ZOOM } from "./mapSettings";
import theme from "src/theme/index";

export const MAPBOX_PADDING_PIXELS = 10;
export const MAPBOX_CONTROL_BUTTON_WIDTH = 29;

export const pointsCircleRadiusStops = {
  stops: [
    [10, 1],
    [20, 12],
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
      _featureIdProp: "INTERSECTION_ID",
      type: "circle",
      paint: {
        "circle-radius": pointsCircleRadiusStops,
        "circle-stroke-color": theme.palette.map.pinkBright,
        "circle-stroke-width": 2,
        "circle-stroke-opacity": 0.9,
        "circle-color": theme.palette.map.pinkLight,
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
        "line-width": {
          stops: [
            [10, 2],
            [20, 10],
          ],
        },
        "line-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          theme.palette.map.pinkDark,
          theme.palette.map.pinkBright,
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
      _featureIdProp: "INTERSECTION_ID",
      type: "circle",
      paint: {
        "circle-radius": pointsCircleRadiusStops,
        "circle-stroke-color": theme.palette.map.mutedGray,
        "circle-stroke-width": 2,
        "circle-stroke-opacity": 0.9,
        "circle-color": theme.palette.map.mutedGray,
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
        "line-width": {
          stops: [
            [10, 2],
            [20, 10],
          ],
        },
        "line-color": theme.palette.map.mutedGray,
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
        "line-color": theme.palette.map.white,
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
        "line-width": {
          stops: [
            [10, 2],
            [20, 10],
          ],
        },
        "line-color": theme.palette.map.bluePrimary,
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
        "circle-stroke-color": theme.palette.map.blueDark,
        "circle-stroke-width": 2,
        "circle-stroke-opacity": 0.9,
        "circle-color": theme.palette.map.blueLight,
        "circle-opacity": 0.9,
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
        "line-width": {
          stops: [
            [10, 2],
            [20, 10],
          ],
        },
        "line-color": theme.palette.map.test,
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
        "circle-stroke-color": theme.palette.map.test,
        "circle-stroke-width": 2,
        "circle-stroke-opacity": 0.9,
        "circle-color": theme.palette.map.test,
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
          theme.palette.map.black,
          theme.palette.map.steel,
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
        "line-color": theme.palette.map.white,
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
      _featureIdProp: "INTERSECTION_ID",
      paint: {
        "circle-radius": pointsCircleRadiusStops,
        "circle-stroke-opacity": 0.4,
        "circle-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "black",
          theme.palette.map.steel,
        ],
        "circle-opacity": 0.4,
        "circle-stroke-color": theme.palette.map.steel,
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
      _featureIdProp: "INTERSECTION_ID",
      paint: {
        "circle-radius": pointsCircleRadiusStops,
        "circle-stroke-opacity": 0,
        "circle-color": theme.palette.map.black,
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
        "line-width": {
          stops: [
            [10, 2],
            [20, 10],
          ],
        },
        "line-color": theme.palette.map.bluePrimary,
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
        "circle-stroke-color": theme.palette.map.blueDark,
        "circle-stroke-width": 2,
        "circle-stroke-opacity": 0.9,
        "circle-color": theme.palette.map.blueLight,
        "circle-opacity": 0.9,
      },
    },
  },
};
