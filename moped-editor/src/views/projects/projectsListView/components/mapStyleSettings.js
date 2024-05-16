import {
  pointsCircleRadiusStops,
  lineWidthStops,
} from "../../projectView/ProjectComponents/mapStyleSettings";
import { COLORS } from "../../projectView/ProjectComponents/mapStyleSettings";

export const MAP_STYLES = {
  "project-points": {
    isInteractive: true,
    layerProps: {
      id: "project-points",
      _featureIdProp: "INTERSECTIONID",
      type: "circle",
      paint: {
        "circle-radius": pointsCircleRadiusStops,
        "circle-stroke-color": COLORS.black,
        "circle-stroke-width": 1,
        "circle-stroke-opacity": 0.9,
        "circle-color": ["get", "color"],
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
        "line-color": ["get", "color"],
      },
      layout: {
        "line-cap": "round",
      },
    },
  },
};
