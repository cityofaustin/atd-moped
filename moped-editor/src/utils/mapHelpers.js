import React from "react";
import theme from "../theme/index";
import { isEqual } from "lodash";

export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

// See MOPED Technical Docs > User Interface > Map > react-map-gl-geocoder
const austinFullPurposeJurisdictionFeatureCollection = {
  type: "FeatureCollection",
  crs: {
    type: "name",
    properties: {
      name: "EPSG:4326",
    },
  },
  bbox: [-97.940377, 30.133717, -97.578205, 30.464826],
  features: [],
};

export const mapConfig = {
  mapInit: {
    latitude: 30.268039,
    longitude: -97.742828,
    zoom: 12,
  },
  geocoderBbox: austinFullPurposeJurisdictionFeatureCollection.bbox,
  layerConfigs: [
    {
      layerId: "ctn-lines",
      type: "line",
      layerSourceName: "CTN",
      layerColor: theme.palette.primary.main,
      layerUrl:
        "https://tiles.arcgis.com/tiles/0L95CJ0VTaxqcmED/arcgis/rest/services/CTN_Project_Extent_Vector_Tiles/VectorTileServer/tile/{z}/{y}/{x}.pbf",
    },
  ],
  statusOpacities: {
    selected: 0.75,
    hovered: 0.5,
    unselected: 0.25,
  },
  lineWidthStops: {
    base: 1,
    stops: [
      [10, 1],
      [13, 2],
      [16, 10],
      [18, 25],
    ],
  },
  toolTipStyles: {
    position: "absolute",
    margin: 8,
    padding: 4,
    background: theme.palette.text.primary,
    color: theme.palette.background.default,
    maxWidth: 300,
    fontSize: "0.875rem",
    fontWeight: 500,
    zIndex: 9,
    pointerEvents: "none",
  },
};

/**
 * Get the IDs from the layerConfigs object to set as interactive in the map components
 * @return {Array} List of layer IDs to be set as interactive (hover, click) in map
 */
export const getInteractiveIds = () =>
  mapConfig.layerConfigs.map(config => config.layerId);

/**
 * Get a feature's ID attribute from a Mapbox map click or hover event
 * @param {Object} e - Event object for click or hover on map
 * @param {String} idKey - Key that exposes the id of the polygon in the layer
 * @return {String} The ID of the polygon clicked or hovered
 */
export const getFeatureId = (e, idKey) =>
  e.features && e.features.length > 0 && e.features[0].properties[idKey];

/**
 * Get a feature's layer source from a Mapbox map click or hover event
 * @param {Object} e - Event object for click or hover on map
 * @return {String} The name of the source layer
 */
export const getLayerSource = e =>
  e.features && e.features.length > 0 && e.features[0].layer["source-layer"];

/**
 * Get a feature's GeoJSON from a Mapbox map click or hover event
 * @param {Object} e - Event object for click or hover on map
 * @return {Object} The GeoJSON object that describes the clicked or hovered feature geometry
 */
export const getGeoJSON = e =>
  e.features &&
  e.features.length > 0 && {
    geometry: e.features[0].geometry,
    id: e.features[0].id,
    properties: {
      ...e.features[0].properties,
      sourceLayer: e.features[0].sourceLayer,
      source: e.features[0].source,
    },
    type: e.features[0].type,
  };

/**
 * Determine if a feature is present/absent from the feature collection state
 * @param {Object} selectedFeature - Feature selected
 * @param {Array} features - Array of GeoJSON features
 * @return {Boolean} Is feature present in features of feature collection in state
 */
export const isFeaturePresent = (selectedFeature, features) =>
  features.some(feature => isEqual(selectedFeature, feature));

/**
 * Create a configuration to set the Mapbox spec styles for selected/unselected/hovered layer features
 * @param {String} hoveredId - The ID of the feature hovered
 * @param {Object} config - Configuration with layer attributes
 * @param {Array} selectedLayerIds - Array of string IDs that a user has selected
 * @return {Object} Mapbox layer style object
 */
export const createProjectSelectLayerConfig = (
  hoveredId,
  config,
  selectedLayerIds
) => {
  const layerIds = selectedLayerIds[config.layerSourceName] || [];

  // https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/
  return {
    id: config.layerId,
    type: config.type,
    "source-layer": config.layerSourceName,
    layout: {
      "line-join": "round",
    },
    paint: {
      "line-color": config.layerColor,
      "line-width": mapConfig.lineWidthStops,
      "line-opacity": [
        "case",
        ["==", ["get", "PROJECT_EXTENT_ID"], hoveredId],
        mapConfig.statusOpacities.hovered,
        ["in", ["get", "PROJECT_EXTENT_ID"], ["literal", layerIds]],
        mapConfig.statusOpacities.selected,
        mapConfig.statusOpacities.unselected,
      ],
    },
  };
};

// Builds cases to match GeoJSON features with corresponding colors set for their layer
// https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#case
const fillColorCases = mapConfig.layerConfigs.reduce((acc, config) => {
  acc.push(["==", ["get", "sourceLayer"], config.layerSourceName]);
  acc.push(config.layerColor);
  return acc;
}, []);

/**
 * Create a configuration to set the Mapbox spec styles for persisted layer features
 * @summary The fill color key's value below is a Mapbox "case" expression whose cases are
 * built in fillColorCases above. These cases use the sourceLayer and color values set in
 * layerConfigs to set colors of features in the projectExtent feature collection layer on the map.
 * @return {Object} Mapbox layer style object
 */
export const createProjectViewLayerConfig = () => ({
  id: "projectExtent",
  type: "line",
  paint: {
    "line-width": mapConfig.lineWidthStops,
    "line-color": ["case", ...fillColorCases, theme.palette.map.transparent],
    "line-opacity": mapConfig.statusOpacities.selected,
  },
});

/**
 * Build the JSX of the hover tooltip on map
 * @param {String} hoveredFeature - The ID of the feature hovered
 * @param {Object} hoveredCoords - Object with keys x and y that describe position of cursor
 * @param {Object} className - Styles from the classes object
 * @return {JSX} Mapbox layer style object
 */
export const renderTooltip = (hoveredFeature, hoveredCoords, className) =>
  hoveredFeature && (
    <div
      className={className}
      style={{
        left: hoveredCoords?.x,
        top: hoveredCoords?.y,
      }}
    >
      <div>Polygon ID: {hoveredFeature}</div>
    </div>
  );

/**
 * Count the number of IDs in all arrays nested in the selectLayerIds object
 * @param {Object} selectedLayerIds - An object whose keys are layer names and values are arrays of ID strings
 * @return {Number} Total number of string IDs
 */
export const sumFeaturesSelected = selectedLayerIds =>
  Object.values(selectedLayerIds).reduce(
    (acc, selectedIds) => (acc += selectedIds.length),
    0
  );
