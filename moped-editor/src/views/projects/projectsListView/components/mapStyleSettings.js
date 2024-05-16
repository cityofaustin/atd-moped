import {
  pointsCircleRadiusStops,
  lineWidthStops as lineOutlineWidthStops,
} from "../../projectView/ProjectComponents/mapStyleSettings";
import { COLORS } from "../../projectView/ProjectComponents/mapStyleSettings";

export const lineWidthStops = {
  stops: [
    // [zoom level, line width]
    [10, 1.8], // 10% of the lineOutlineWidthStops width
    [20, 8], // 20% of the lineOutlineWidthStops width
  ],
};

export const MAP_STYLES = {
  "project-points": {
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
    layerProps: {
      id: "project-lines",
      _featureIdProp: "CTN_SEGMENT_ID",
      type: "line",
      paint: {
        "line-width": lineWidthStops,
        "line-color": ["get", "color"],
        "line-opacity": 0.9,
      },
      layout: {
        "line-cap": "round",
      },
    },
  },
  "project-lines-outline": {
    layerProps: {
      id: "project-lines-outline",
      _featureIdProp: "CTN_SEGMENT_ID",
      type: "line",
      paint: {
        "line-width": lineOutlineWidthStops,
        "line-color": COLORS.black,
      },
      layout: {
        "line-cap": "round",
      },
    },
  },
};
