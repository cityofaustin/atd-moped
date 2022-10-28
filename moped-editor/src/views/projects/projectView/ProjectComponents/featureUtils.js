import { v4 as uuidv4 } from "uuid";

/**
 * Drawn feature properties
 * {
 *   id: "9e0c688733283be4991cb9df39ae284d",
 *   type: "Feature",
 *   properties: {
 *     DRAW_ID: "88230580-099f-4c93-b8e5-ad3086caf0e6",
 *     _layerId: "drawnByUserLine",
 *     geometry: { coordinates: [], type: "LineString" },
 * }
 */
export const makeDrawnFeature = (feature, linkMode) => {
  feature.properties["DRAW_ID"] = uuidv4();

  // TODO: Current schema uses "drawnByUser" for lines but we need _layerId to contain
  // "line" or "point" to the popup to work as expected (otherwise mutliple components
  // show up in the popup when clicking a feature)
  if (linkMode === "lines") {
    feature.properties["_layerId"] = "drawnByUserLine";
  } else if (linkMode === "points") {
    feature.properties["_layerId"] = "drawnByUserPoint";
  }
};

export const isDrawnFeature = (feature) =>
  feature.properties?.DRAW_ID ? true : false;
