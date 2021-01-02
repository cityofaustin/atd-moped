import React from "react";
import theme from "../theme/index";
import { isEqual } from "lodash";

export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

export const mapInit = {
  latitude: 30.268039,
  longitude: -97.742828,
  zoom: 12,
};

// Query that returns feature collection with bbox for Austin Full Purpose Jurisdiction\
// https://services.arcgis.com/0L95CJ0VTaxqcmED/arcgis/rest/services/BOUNDARIES_jurisdiction_1231_1951/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=true&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=
const austinFullPurposeJurisdictionFeatureCollection = {
  type: "FeatureCollection",
  crs: {
    type: "name",
    properties: {
      name: "EPSG:4326",
    },
  },
  bbox: [
    -97.940377028014,
    30.1337172258415,
    -97.578205982277,
    30.4648268798927,
  ],
  features: [],
};

export const geocoderBbox = austinFullPurposeJurisdictionFeatureCollection.bbox;

// Set the layer attributes to render on map
export const layerConfigs = [
  {
    layerId: "location-polygons",
    layerSourceName: "asmp_polygons",
    layerColor: theme.palette.primary.main,
    layerUrl:
      "https://tiles.arcgis.com/tiles/0L95CJ0VTaxqcmED/arcgis/rest/services/location_polygons_vector_tiles_w_IDs/VectorTileServer/tile/{z}/{y}/{x}.pbf",
  },
];

/**
 * Get the IDs from the layerConfigs object to set as interactive in the map components
 * @return {Array} List of layer IDs to be set as interactive (hover, click) in map
 */
export const getInteractiveIds = () =>
  layerConfigs.map(config => config.layerId);

/**
 * Get a feature's ID attribute from a Mapbox map click or hover event
 * @param {Object} e - Event object for click or hover on map
 * @return {String} The ID of the polygon clicked or hovered
 */
export const getFeaturePolygonId = e =>
  e.features && e.features.length > 0 && e.features[0].properties.polygon_id;

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
    type: "fill",
    source: {
      type: "vector",
      tiles: [config.layerUrl],
    },
    "source-layer": config.layerSourceName,
    paint: {
      "fill-color": [
        "case",
        ["==", ["get", "polygon_id"], hoveredId],
        theme.palette.map.selected,
        ["in", ["get", "polygon_id"], ["literal", layerIds]],
        config.layerColor,
        theme.palette.map.outline,
      ],
      "fill-opacity": 0.4,
    },
  };
};

// Builds cases to match GeoJSON features with corresponding colors set for their layer
// https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#case
const fillColorCases = layerConfigs.reduce((acc, config) => {
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
  type: "fill",
  paint: {
    "fill-color": ["case", ...fillColorCases, theme.palette.map.transparent],
    "fill-opacity": 0.5,
  },
});

export const toolTipStyles = {
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
};

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
