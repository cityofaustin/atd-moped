import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getIntersectionLabel } from "./map";
import { getAllComponentFeatures } from "./makeFeatureCollections";

/**
 * Captured from feature object example
 * {
 *    "geometry": {
 *        "type": "LineString",
 *        "coordinates": [],
 *    },
 *    "properties": {
 *        "OBJECTID": 20041,
 *        "CTN_SEGMENT_ID": 153083,
 *        "FULL_STREET_NAME": "W MARTIN LUTHER KING JR BLVD",
 *        "FROM_ADDRESS_MIN": 300,
 *        "TO_ADDRESS_MAX": 303,
 *        "LINE_TYPE": "On-Street",
 *        "GLOBALID": "cb89d800-d6a3-491f-91e6-61cab17ac738",
 *        "Shape__Length": 60.3716805891339,
 *        "id": 20041,
 *        "_layerId": "ctn-lines-underlay",
 *        "_label": "300 BLK W MARTIN LUTHER KING JR BLVD"
 *    }
 * }
 */

/**
 * Make a feature object from a clicked CTN feature and AGOL returned data about it
 * @param {Object} featureFromAgolGeojson - a feature object from AGOL
 * @param {Object} clickedFeature - a feature object from a Mapbox click event
 * @param {Object} ctnLinesGeojson - a feature collection of CTN lines currently in map view
 * @returns {Object} - a feature object
 */
export const makeCapturedFromLayerFeature = (
  featureFromAgolGeojson,
  clickedFeature,
  ctnLinesGeojson
) => {
  const newFeature = {
    geometry: featureFromAgolGeojson.geometry,
    properties: {
      ...featureFromAgolGeojson.properties,
      id: featureFromAgolGeojson.id,
      // AGOL data doesn't include source layer ID so we grab it from the clicked Mapbox feature
      _layerId: clickedFeature.layer.source,
    },
  };

  if (newFeature.properties._layerId.includes("point")) {
    newFeature.properties._label = getIntersectionLabel(
      newFeature,
      ctnLinesGeojson
    );
  } else {
    newFeature.properties._label = `${newFeature.properties.FROM_ADDRESS_MIN} BLK ${newFeature.properties.FULL_STREET_NAME}`;
  }

  return newFeature;
};

/**
 * Drawn feature object example
 * {
 *   "id": "9e0c688733283be4991cb9df39ae284d",
 *   "geometry": { coordinates: [], type: "LineString" },
 *   "type": "Feature",
 *   "properties": {
 *     "DRAW_ID": "88230580-099f-4c93-b8e5-ad3086caf0e6",
 *     "_layerId": "drawnByUserLine",
 * }
 */

/**
 * Make a drawn feature object from GeoJSON output of Mapbox GL Draw
 * @param {Object} feature - GeoJSON feature object from Mapbox GL Draw onCreate
 * @param {String} linkMode - tracks if we are editing "lines" or "points"
 * @returns {Object} - a feature object
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

/**
 * Determine if a feature is drawn by the user
 * @param {Object} feature - a feature object
 * @returns {String} - assigned ID of the drawn feature
 */
export const getDrawId = (feature) => feature?.properties?.DRAW_ID;

/**
 * Determine if a draft feature is drawn by the user by the draw ID
 * that is added when creating a drawn feature that is not yet saved
 * @param {Object} feature - a feature object
 * @returns {Boolean} - true if feature is drawn by user
 */
export const isDrawnDraftFeature = (feature) =>
  getDrawId(feature) ? true : false;

/**
 * Determine if any features captured in a Mapbox click event are features
 * that are a drawn and not yet saved
 * @param {Array} features - array for features from a Mapbox click event
 * @returns {Boolean} - true if any feature is drawn by user and already saved
 */
export const areAnyClickedFeaturesDraftDrawnFeatures = (clickedFeatures) =>
  clickedFeatures?.some((feature) => isDrawnDraftFeature(feature));

/**
 * Add fetched component feature's source layer ("drawnByUserLine" or "drawnByUserPoint")
 * to feature properties so we can differentiate them from non-drawn features
 * @param {Object} feature - a feature object
 */
export const addDrawnFeatureProperties = (feature) => {
  feature.properties.sourceLayer = feature.source_layer;
};

/**
 * Determine if a feature was saved previously by checking for the source layer
 * data that is only present in saved drawn features
 * @param {Object} feature - a feature object
 * @returns {Boolean} - true if feature is drawn by user
 */
export const isDrawnSavedFeature = (feature) =>
  feature.properties.sourceLayer?.includes("drawnByUser");

/**
 * Determine if any features captured in a Mapbox click event are features
 * that have already been drawn and saved by the user
 * @param {Array} features - array for features from a Mapbox click event
 * @returns {Boolean} - true if any feature is drawn by user and already saved
 */
export const areAnyClickedFeaturesSavedDrawnFeatures = (clickedFeatures) =>
  clickedFeatures?.some((feature) => isDrawnSavedFeature(feature));

/**
 * Initialize the draw tools state with existing features of the component being edited
 * @param {Object} drawControlsRef - ref for the draw controls
 * @param {Object} draftEditComponent - the component being edited
 * @param {String} linkMode - tracks if we are editing "lines" or "points"
 */
export const useExistingDrawnFeatures = ({
  drawControlsRef,
  draftEditComponent,
  linkMode,
}) => {
  useEffect(() => {
    if (!drawControlsRef.current) return;

    // Mapbox GL Draw requires valid features with properties or else it will throw an error
    const drawnLinesWithProperties = draftEditComponent.feature_drawn_lines.map(
      (feature) => ({
        ...feature,
        properties: {},
      })
    );
    const drawnPointsWithProperties =
      draftEditComponent.feature_drawn_points.map((feature) => ({
        ...feature,
        properties: {},
      }));

    if (linkMode === "lines") {
      drawControlsRef.current.set({
        type: "FeatureCollection",
        features: drawnLinesWithProperties,
      });
    }

    if (linkMode === "points") {
      drawControlsRef.current.set({
        type: "FeatureCollection",
        features: drawnPointsWithProperties,
      });
    }
  }, [linkMode, draftEditComponent, drawControlsRef]);
};

/**
 * Track whether a draft edit component has features or not
 * @param {Object} draftEditComponent - the draft component storing feature edits
 * @returns {Boolean} - does the draft component have features
 */
export const useDoesDraftEditComponentHaveFeatures = (draftEditComponent) => {
  const [
    doesDraftEditComponentHaveFeatures,
    setDoesDraftEditComponentHaveFeatures,
  ] = useState(false);

  useEffect(() => {
    if (draftEditComponent === null) return;

    const allDraftComponentFeatures =
      getAllComponentFeatures(draftEditComponent);
    const doesComponentHaveFeatures = Boolean(
      allDraftComponentFeatures.length > 0
    );

    setDoesDraftEditComponentHaveFeatures(doesComponentHaveFeatures);
  }, [draftEditComponent]);

  return doesDraftEditComponentHaveFeatures;
};
