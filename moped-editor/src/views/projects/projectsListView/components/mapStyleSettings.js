import {
  COLORS,
  pointsCircleRadiusStops,
  lineWidthStops,
} from "../../projectView/ProjectComponents/mapStyleSettings";

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
};
