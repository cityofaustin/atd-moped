import React, { useState } from "react";
import bbox from "@turf/bbox";
import theme from "../theme/index";
import { Typography } from "@material-ui/core";

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

export const mapStyles = {
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

export const mapConfig = {
  mapInit: {
    latitude: 30.268039,
    longitude: -97.742828,
    zoom: 12,
  },
  mapboxDefaultMaxZoom: 18,
  geocoderBbox: austinFullPurposeJurisdictionFeatureCollection.bbox,
  layerConfigs: {
    CTN: {
      layerIdName: "ctn-lines",
      layerIdField: "PROJECT_EXTENT_ID",
      layerColor: theme.palette.primary.main,
      layerUrl:
        "https://tiles.arcgis.com/tiles/0L95CJ0VTaxqcmED/arcgis/rest/services/CTN_Project_Extent_Vector_Tiles/VectorTileServer/tile/{z}/{y}/{x}.pbf",
      layerMaxLOD: 14,
      get layerStyleSpec() {
        return function(hoveredId, layerIds) {
          return {
            type: "line",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": this.layerColor,
              "line-width": mapStyles.lineWidthStops,
              "line-opacity": [
                "case",
                ["==", ["get", this.layerIdField], hoveredId],
                mapStyles.statusOpacities.hovered,
                ["in", ["get", this.layerIdField], ["literal", layerIds]],
                mapStyles.statusOpacities.selected,
                mapStyles.statusOpacities.unselected,
              ],
            },
          };
        };
      },
    },
  },
};

/**
 * Create a Mapbox LngLatBounds object from a bbox generated from a feature collection
 * @param {Object} featureCollection - A GeoJSON feature collection
 * @return {Array} A nested array that fits the LngLatBounds Mapbox object format
 */
export const createZoomBbox = featureCollection => {
  const [minLng, minLat, maxLng, maxLat] = bbox(featureCollection);

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
};

/**
 * Get the IDs from the layerConfigs object to set as interactive in the map components
 * @return {Array} List of layer IDs to be set as interactive (hover, click) in map
 */
export const getInteractiveIds = () =>
  Object.values(mapConfig.layerConfigs).map(config => config.layerIdName);

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
  e.features &&
  e.features.length > 0 &&
  (e.features[0].layer["source-layer"] ||
    e.features[0].properties["sourceLayer"]);

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
    },
    type: e.features[0].type,
  };

/**
 * Determine if a feature is present/absent from the feature collection state
 * @param {Object} selectedFeature - Feature selected
 * @param {Array} features - Array of GeoJSON features
 * @param {String} idField - Key for id field in feature properties
 * @return {Boolean} Is feature present in features of feature collection in state
 */
export const isFeaturePresent = (selectedFeature, features, idField) =>
  features.some(
    feature =>
      selectedFeature.properties[idField] === feature.properties[idField]
  );

/**
 * Create a configuration to set the Mapbox spec styles for selected/unselected/hovered layer features
 * @param {String} hoveredId - The ID of the feature hovered
 * @param {String} sourceName - Source name to get config properties for layer styles
 * @param {Array} selectedLayerIds - Array of string IDs that a user has selected
 * @return {Object} Mapbox layer style object
 */
export const createProjectSelectLayerConfig = (
  hoveredId,
  sourceName,
  selectedLayerIds
) => {
  const layerIds = selectedLayerIds[sourceName] || [];
  const config = mapConfig.layerConfigs[sourceName];

  // Merge common layer attributes with those unique to each layer type
  return {
    id: config.layerIdName,
    "source-layer": sourceName,
    ...config.layerStyleSpec(hoveredId, layerIds),
  };
};

// Builds cases to match GeoJSON features with corresponding colors set for their layer
// https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#case
const fillColorCases = Object.entries(mapConfig.layerConfigs).reduce(
  (acc, [sourceName, config]) => {
    acc.push(["==", ["get", "sourceLayer"], sourceName]);
    acc.push(config.layerColor);
    return acc;
  },
  []
);

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
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    "line-width": mapStyles.lineWidthStops,
    "line-color": ["case", ...fillColorCases, theme.palette.map.transparent],
    "line-opacity": mapStyles.statusOpacities.selected,
  },
});

/**
 * Build the JSX of the hover tooltip on map
 * @param {String} hoveredFeature - The ID of the feature hovered
 * @param {Object} hoveredCoords - Object with keys x and y that describe position of cursor
 * @param {Object} className - Styles from the classes object
 * @return {JSX} The populated tooltip JSX
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
 * Build the JSX for the map feature count subtext
 * @param {Number} featureCount - The number of features in a project's feature collection
 * @return {JSX} The populated feature count text JSX
 */
export const renderFeatureCount = featureCount => (
  <Typography
    style={{
      fontSize: "0.875rem",
      fontWeight: 500,
    }}
  >
    {featureCount} location{featureCount === 1 ? "" : "s"} in this project
  </Typography>
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

/**
 * Custom hook that returns a vector tile layer hover event handler and the details to place and populate a tooltip
 * @return {{handleLayerHover:Function, featuredId:String, hoveredCoords:Object}}
 * @return {HoverObject} Object that exposes the setter and getters for a hovered feature
 */
/**
 * @typedef {Object} HoverObject
 * @property {Function} handleLayerHover - Function that get and sets featureId and Point for tooltip
 * @property {String} featuredId - The ID of the hovered feature
 * @property {Point} hoveredCoords - The coordinates used to place the tooltip
 */
/**
 * @typedef {Object} Point
 * @property {Number} x - The x coordinate to the place the tooltip
 * @property {Number} y - The y coordinate to the place the tooltip
 */
export function useHoverLayer() {
  const [featureId, setFeature] = useState(null);
  const [hoveredCoords, setHoveredCoords] = useState(null);

  /**
   * Gets and sets data from a map feature used to populate and place a tooltip
   * @param {Object} e - Mouse hover event that supplies the feature details and hover coordinates
   */
  const handleLayerHover = e => {
    const layerSource = getLayerSource(e);

    // If a layer isn't hovered, reset state and don't proceed
    if (!layerSource) {
      setHoveredCoords(null);
      setFeature(null);
      return;
    }

    // Otherwise, get details for tooltip
    const {
      srcEvent: { offsetX, offsetY },
    } = e;
    const hoveredFeatureId = getFeatureId(
      e,
      mapConfig.layerConfigs[layerSource].layerIdField
    );

    setFeature(hoveredFeatureId);
    setHoveredCoords({ x: offsetX, y: offsetY });
  };

  return { handleLayerHover, featureId, hoveredCoords };
}
