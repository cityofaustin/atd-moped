import React, { useState, useEffect, useReducer } from "react";
import { Layer, Source } from "react-map-gl";
import bbox from "@turf/bbox";
import combine from "@turf/combine";
import theme from "../theme/index";
import {
  Checkbox,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  withStyles,
  makeStyles,
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";
import {
  mapSaveActionReducer,
  mapSaveActionInitialState,
} from "./mapSaveActionReducer";

export const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
export const NEARMAP_KEY = process.env.REACT_APP_NEARMAP_TOKEN;

const TRAIL_LINE_TYPE = "Off-Street";

export const basemaps = {
  streets: "mapbox://styles/mapbox/light-v8",
  // Provide style parameters to render Nearmap tiles in react-map-gl
  // https://docs.mapbox.com/mapbox-gl-js/example/map-tiles/
  aerial: {
    version: 8,
    sources: {
      "raster-tiles": {
        type: "raster",
        tiles: [
          `https://api.nearmap.com/tiles/v3/Vert/{z}/{x}/{y}.jpg?apikey=${NEARMAP_KEY}`,
        ],
        tileSize: 256,
      },
    },
    layers: [
      {
        id: "simple-tiles",
        type: "raster",
        source: "raster-tiles",
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  },
};

/**
 * ArcGIS Online feature service endpoint of the CTN line segments. Managed by DTS GIS team.
 */
const ctnAGOLEndpoint =
  "https://services.arcgis.com/0L95CJ0VTaxqcmED/arcgis/rest/services/CTN_Segments_MOPED_FS/FeatureServer/0";

export const mapStyles = {
  statusOpacities: {
    selected: 0.75,
    hovered: 0.5,
    unselected: 0.25,
  },
  lineWidthStops: {
    base: 1,
    stops: [
      [10, 1], // [zoom, width in px]
      [13, 2],
      [16, 10],
      [18, 25],
    ],
  },
  circleRadiusStops: {
    base: 1,
    stops: [
      [10, 1], // [zoom, radius in px]
      [13, 2],
      [16, 10],
      [18, 25],
    ],
  },
  toolTipStyles: {
    position: "absolute",
    margin: 8,
    padding: 6,
    background: theme.palette.primary.main,
    color: theme.palette.background.default,
    maxWidth: 300,
    fontSize: "0.875rem",
    fontWeight: 500,
    zIndex: 9,
    pointerEvents: "none",
    borderRadius: 6,
    boxShadow: "0 0 1px 0 rgb(0 0 0 / 31%), 0 2px 2px -2px rgb(0 0 0 / 25%)",
    textTransform: "capitalize",
    fontFamily: "Roboto",
  },
};

/**
 * Common styles of map components in ProjectComponentsMap and ProjectComponentsMapView
 */
export const makeCommonComponentsMapStyles = (theme) => ({
  speedDial: {
    right: "49px !important",
    bottom: "20px !important",
    position: "absolute",
    zIndex: 1,
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
  mapBox: {
    padding: 25,
    position: "relative",
  },
  mapBoxNoPadding: {
    padding: 0,
    position: "relative",
  },
});

/**
 * Map Config
 * @type {{mapInit: {latitude: number, zoom: number, longitude: number}, minimumFeaturesInProject: number, mapboxDefaultMaxZoom: number, layerConfigs: Object}}
 */
export const mapConfig = {
  // The initial map position and zoom level
  mapInit: {
    latitude: 30.268039,
    longitude: -97.742828,
    zoom: 12,
  },
  mapboxDefaultMaxZoom: 18, // Max zoom level
  minimumFeaturesInProject: 1, // Determines minimum number of features in project
  // List of layer configurations
  layerConfigs: {
    "ATD_ADMIN.CTN": {
      layerLabel: "Streets",
      layerIdName: "ctn-lines",
      tooltipTextProperty: "FULL_STREET_NAME",
      featureIdProperty: "CTN_SEGMENT_ID",
      layerOrder: 1,
      layerColor: theme.palette.primary.main,
      layerUrl:
        "https://tiles.arcgis.com/tiles/0L95CJ0VTaxqcmED/arcgis/rest/services/CTN_Segments_MOPED/VectorTileServer/tile/{z}/{y}/{x}.pbf",
      layerMaxLOD: 14,
      isClickEditable: true,
      get layerStyleSpec() {
        return function (hoveredId, layerIds) {
          const isEditing = !!layerIds;

          const editMapPaintStyles = {
            "line-opacity": [
              "case",
              ["==", ["get", this.featureIdProperty], hoveredId],
              mapStyles.statusOpacities.hovered,
              ["in", ["get", this.featureIdProperty], ["literal", layerIds]],
              mapStyles.statusOpacities.selected,
              mapStyles.statusOpacities.unselected,
            ],
          };

          return {
            id: this.layerIdName,
            type: "line",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": [
                "case",
                ["==", ["get", "LINE_TYPE"], TRAIL_LINE_TYPE],
                theme.palette.map.trail,
                this.layerColor,
              ],
              "line-width": mapStyles.lineWidthStops,
              ...(isEditing && editMapPaintStyles),
            },
          };
        };
      },
    },
    "ATD_ADMIN.CTN_Intersections": {
      layerLabel: "Points",
      layerIdName: "project-component-points",
      featureIdProperty: "INTERSECTIONID",
      layerOrder: 2,
      layerColor: theme.palette.secondary.main,
      layerUrl:
        "https://tiles.arcgis.com/tiles/0L95CJ0VTaxqcmED/arcgis/rest/services/CTN_Intersections_MOPED/VectorTileServer/tile/{z}/{y}/{x}.pbf",
      layerMaxLOD: 12,
      isClickEditable: true,
      get layerStyleSpec() {
        return function (hoveredId, layerIds) {
          const isEditing = !!layerIds;

          const editMapPaintStyles = {
            "circle-opacity": [
              "case",
              ["==", ["get", this.featureIdProperty], hoveredId],
              mapStyles.statusOpacities.hovered,
              ["in", ["get", this.featureIdProperty], ["literal", layerIds]],
              mapStyles.statusOpacities.selected,
              mapStyles.statusOpacities.unselected,
            ],
          };

          return {
            id: this.layerIdName,
            type: "circle",
            paint: {
              "circle-color": this.layerColor,
              "circle-radius": mapStyles.circleRadiusStops,
              ...(isEditing && editMapPaintStyles),
            },
          };
        };
      },
    },
    drawnByUser: {
      layerDrawn: true,
      layerLabel: "Drawn Points",
      layerIdName: "drawnByUser",
      featureIdProperty: "PROJECT_EXTENT_ID",
      layerOrder: 3,
      layerColor: theme.palette.secondary.main,
      layerMaxLOD: 12,
      isClickEditable: false,
      get layerStyleSpec() {
        return function () {
          return {
            id: this.layerIdName,
            type: "circle",
            paint: {
              "circle-color": this.layerColor,
              "circle-radius": mapStyles.circleRadiusStops,
            },
          };
        };
      },
    },
    drawnByUserLine: {
      layerDrawn: true,
      layerLabel: "Drawn Lines",
      layerIdName: "drawnByUserLine",
      featureIdProperty: "PROJECT_EXTENT_ID",
      layerOrder: 4,
      layerColor: theme.palette.primary.main,
      layerMaxLOD: 12,
      isClickEditable: false,
      get layerStyleSpec() {
        return function () {
          return {
            id: this.layerIdName,
            type: "line",
            layout: {
              "line-join": "miter",
              "line-cap": "square",
            },
            paint: {
              "line-color": theme.palette.primary.main,
              "line-width": 4,
            },
          };
        };
      },
    },
    projectFeatures: {
      layerLabel: "Project Features",
      layerIdName: "projectFeatures",
      featureIdProperty: "CTN_SEGMENT_ID",
      layerOrder: 5,
      layerColor: theme.palette.grey["800"],
      layerMaxLOD: 12,
      isClickEditable: false,
      isInitiallyVisible: false,
      get layerStyleSpec() {
        return function () {
          return {
            id: this.layerIdName,
            type: "line",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": [
                "case",
                ["==", ["get", "LINE_TYPE"], TRAIL_LINE_TYPE],
                theme.palette.grey["800"],
                this.layerColor,
              ],
              "line-width": mapStyles.lineWidthStops,
            },
          };
        };
      },
    },
    projectFeaturePoints: {
      layerDrawn: false,
      layerLabel: "Project Points",
      layerIdName: "projectFeaturePoints",
      featureIdProperty: "INTERSECTIONID",
      layerOrder: 6,
      layerColor: theme.palette.grey["800"],
      layerMaxLOD: 12,
      isClickEditable: false,
      isInitiallyVisible: false,
      get layerStyleSpec() {
        return function () {
          return {
            id: this.layerIdName,
            type: "circle",
            paint: {
              "circle-color": this.layerColor,
              "circle-radius": mapStyles.circleRadiusStops,
            },
          };
        };
      },
    },
  },
};

export const mapErrors = {
  minimumLocations: "Select a location to save project",
  failedToSave: "The map edit failed to save. Please try again.",
};

/**
 * Create a Mapbox LngLatBounds object from a bbox generated from a feature collection
 * @param {Object} featureCollection - A GeoJSON feature collection
 * @return {Array} A nested array that fits the LngLatBounds Mapbox object format
 */
export const createZoomBbox = (featureCollection) => {
  const [minLng, minLat, maxLng, maxLat] = bbox(featureCollection);

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
};

/**
 * Get the layer names from the layerConfigs object for which isClickEditable is true
 * @return {Array} List of source layer names that have features that can be added or removed by clicking
 */
export const getClickEditableLayerNames = () =>
  Object.entries(mapConfig.layerConfigs).reduce(
    (acc, [sourceLayerName, config]) =>
      config.isClickEditable ? [...acc, sourceLayerName] : acc,
    []
  );

/**
 * Get the IDs from the layerConfigs object to set as interactive in the edit map
 * Edit map needs all layers to be interactive to let users select features
 * @return {Array} List of layer IDs to be set as interactive (hover, click) in map
 */
export const getEditMapInteractiveIds = (drawLines) => {
  const interactiveIds = Object.values(mapConfig.layerConfigs).map(
    (config) => config.layerIdName
  );

  if (drawLines === true) {
    return interactiveIds.filter(
      (layer) => layer !== "project-component-points"
    );
  }
  if (drawLines === false) {
    return interactiveIds.filter((layer) => layer !== "ctn-lines");
  }

  return interactiveIds;
};

/**
 * Get the IDs from the layerConfigs object to set as interactive in the summary map
 * Summary map only needs layers in the project extent to be interactive
 * @return {Array} List of layer IDs to be set as interactive (hover, click) in map
 */
export const getSummaryMapInteractiveIds = (featureCollection) => [
  ...new Set(
    featureCollection.features.map(
      (feature) =>
        mapConfig.layerConfigs[feature.properties.sourceLayer].layerIdName
    )
  ),
];

/**
 * Get the layer names from the layerConfigs object
 * @return {Array} List of layer names set in mapConfig.layerConfigs
 */
export const getLayerNames = () => Object.keys(mapConfig.layerConfigs);

/**
 * Get a feature's ID attribute from a GeoJSON feature
 * @param {Object} feature - GeoJSON feature taken from a Mapbox click or hover event
 * @param {String} layerName - Name of layer to find lodash get path from layer config
 * @return {String} The ID of the polygon clicked or hovered
 */
export const getFeatureId = (feature, layerName) =>
  feature.properties[mapConfig.layerConfigs[layerName].featureIdProperty];

/**
 * Get a feature's property that contains text to show in a tooltip
 * @param {object} feature - GeoJSON feature taken from a Mapbox click or hover event
 * @param {string} layerName - Name of layer to find tooltip text property from layer config
 * @return {string} The text to show in the tooltip
 */
export const getFeatureHoverText = (feature, layerName) =>
  feature.properties[mapConfig.layerConfigs[layerName].tooltipTextProperty];

/**
 * Get a feature's layer source from a Mapbox map click or hover event
 * @param {Object} e - Event object for click or hover on map
 * @return {String} The name of the source layer
 */
export const getLayerSource = (e) =>
  e.features &&
  e.features.length > 0 &&
  (e.features[0].layer["source-layer"] ||
    e.features[0].properties["sourceLayer"]);

/**
 * Create a GeoJSON feature collection from moped_proj_features
 * @param {array} projectFeatureRecords - List of project's feature records from the moped_proj_features table
 * @return {object} A GeoJSON feature collection to display project features on a map
 */
export const createFeatureCollectionFromProjectFeatures = (
  mopedProjectFeatures
) => {
  let featureCollection = { type: "FeatureCollection", features: [] };
  mopedProjectFeatures.forEach((projectFeature) => {
    // add proj feature metadata to the feature itself
    // these are stored outside of the feature.properties and serve
    // as metadata that will be useful when handling map edits
    let feature = { ...projectFeature.feature };
    feature.feature_id = projectFeature.feature_id;
    feature.project_component_id = projectFeature.project_component_id;
    featureCollection.features.push(feature);
  });
  return featureCollection;
};

/**
 * Create object with layer name keys and array values containing feature IDs for map styling
 * @param {object} featureCollection - A GeoJSON feature collection
 * @return {object} Object with layer name keys and values that are a array of feature ID strings
 */
export const createSelectedIdsObjectFromFeatureCollection = (
  featureCollection
) => {
  const selectedIdsByLayer = featureCollection.features.reduce(
    (acc, feature) => {
      const sourceLayer = feature.properties.sourceLayer;
      const featureId = getFeatureId(feature, sourceLayer);

      return acc[sourceLayer]
        ? {
            ...acc,
            ...{
              [sourceLayer]: [...acc[sourceLayer], featureId],
            },
          }
        : { ...acc, [sourceLayer]: [featureId] };
    },
    {}
  );

  return selectedIdsByLayer;
};

/**
 * Get a feature's GeoJSON from a Mapbox map click or hover event
 * @param {Object} e - Event object for click or hover on map
 * @return {Object} The GeoJSON object that describes the clicked or hovered feature geometry
 */
export const getGeoJSON = (e) =>
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
 * @param {String} layerName - Name of layer to find lodash get path from layer config
 * @return {Boolean} Is feature present in features of feature collection in state
 */
export const isFeaturePresent = (selectedFeature, features, layerName) => {
  const featureIdProperty = mapConfig.layerConfigs[layerName].featureIdProperty;

  return features.some(
    (feature) =>
      selectedFeature.properties[featureIdProperty] ===
      feature.properties[featureIdProperty]
  );
};

/**
 * Create a configuration to set the Mapbox spec styles for selected/unselected/hovered layer features
 * @param {String} hoveredId - The ID of the feature hovered
 * @param {String} sourceName - Source name to get config properties for layer styles
 * @param {Array} selectedLayerIds - Array of string IDs that a user has selected
 * @param {Array} visibleLayerIds - Array of layer names that are visible and have checked boxes in the useLayerSelect UI
 * @return {Object} Mapbox layer style object
 */
export const createProjectSelectLayerConfig = (
  hoveredId,
  sourceName,
  selectedLayerIds,
  visibleLayerIds
) => {
  const layerIds = selectedLayerIds[sourceName] || [];
  const config = mapConfig.layerConfigs[sourceName];

  // Merge common layer attributes with those unique to each layer type
  let layerStyleSpec = {
    "source-layer": sourceName,
    ...config.layerStyleSpec(hoveredId, layerIds),
  };

  if (!!visibleLayerIds) {
    layerStyleSpec = {
      ...layerStyleSpec,
      layout: {
        ...layerStyleSpec.layout,
        visibility: visibleLayerIds.includes(sourceName) ? "visible" : "none",
      },
    };
  }

  return layerStyleSpec;
};

/**
 * Create sources and layers for each source layer in the project's GeoJSON FeatureCollection
 * @param {object} geoJSON - A GeoJSON feature collection with project features
 * @return {JSX} Mapbox Source and Layer components for each source in the GeoJSON
 */
export const createSummaryMapLayers = (geoJSON) => {
  /**
   * Aggregate all features in geoJSON and group by layer
   */
  const geoJSONBySource = geoJSON.features.reduce((acc, feature) => {
    // Copy the sourceLayerName
    const sourceLayer = feature.properties.sourceLayer;

    /**
     * Build a new state that copies the current state of the accumulator
     * and append a new key with the source layer name, which includes a
     * copy of the geoJSON object, a features section which includes the current
     * feature and any extra features already in the aggregator if any.
     */
    return {
      ...acc,
      [sourceLayer]: {
        ...geoJSON,
        features: [
          ...(acc[sourceLayer] ? acc[sourceLayer].features : []),
          feature,
        ],
      },
    };
  }, {});

  /**
   * For every source layer in geoJSONBySource
   */
  return (
    Object.entries(geoJSONBySource)
      .map(([sourceLayer, sourceLayerGeoJSON]) => (
        // Build a source component, and pass attributes
        <Source
          key={sourceLayer}
          id={sourceLayer}
          type="geojson"
          data={sourceLayerGeoJSON}
        >
          {/*
          Build a layer and create a configuration to set the
          Mapbox spec styles for persisted layer features
        */}
          <Layer
            key={sourceLayer}
            {...createProjectViewLayerConfig(sourceLayer)}
          />
        </Source>
      ))
      /* We can now sort the components by mapConfig.layerConfigs[n].layerOrder */
      .sort((a, b) => {
        // The id of the Source component maps to the source layer names in mapConfig, each layer config has a set order
        const idA = a.props.id;
        const idB = b.props.id;
        const orderA = mapConfig.layerConfigs[idA].layerOrder;
        const orderB = mapConfig.layerConfigs[idB].layerOrder;

        return orderA > orderB ? 1 : -1;
      })
  );
};
/**
 * Create a configuration to set the Mapbox spec styles for persisted layer features
 * @summary The fill color key's value below is a Mapbox "case" expression whose cases are
 * built in fillColorCases above. These cases use the sourceLayer and color values set in
 * layerConfigs to set colors of features in the projectExtent feature collection layer on the map.
 * @param {string} sourceName - Source name to get config properties for layer styles
 * @param {Array} visibleLayerIds - Array of layer names that are visible and have checked boxes in the useLayerSelect UI
 * @return {object} Mapbox layer style object
 */
export const createProjectViewLayerConfig = (
  sourceName,
  visibleLayerIds = null
) => {
  let layerStyleSpec =
    mapConfig.layerConfigs[sourceName]?.layerStyleSpec() ?? null;

  if (!!layerStyleSpec && !!visibleLayerIds) {
    layerStyleSpec = {
      ...layerStyleSpec,
      layout: {
        ...layerStyleSpec.layout,
        visibility: visibleLayerIds.includes(sourceName) ? "visible" : "none",
      },
    };
  }

  return layerStyleSpec;
};

/**
 * Build the JSX of the hover tooltip on map
 * @param {String} tooltipText - Text to show in the tooltip
 * @param {Object} hoveredCoords - Object with keys x and y that describe position of cursor
 * @param {Object} className - Styles from the classes object
 * @return {JSX} The populated tooltip JSX
 */
export const renderTooltip = (tooltipText, hoveredCoords, className) =>
  tooltipText && (
    <span
      className={className}
      style={{
        left: hoveredCoords?.x,
        top: hoveredCoords?.y,
      }}
    >
      <span>{tooltipText.toLowerCase()}</span>
    </span>
  );

/**
 * Count the number of features in the project extent feature collection
 * @param {Object} featureCollection - A GeoJSON feature collection
 * @return {Number} Total number of string IDs
 */
export const countFeatures = (featureCollection) =>
  featureCollection.features.length;

/**
 * Custom hook that returns a vector tile layer hover event handler and the details to place and populate a tooltip
 * @return {{handleLayerHover:Function, featuredId:String, hoveredCoords:Object}}
 * @return {HoverObject} Object that exposes the setter and getters for a hovered feature
 */
/**
 * @typedef {Object} HoverObject
 * @property {Function} handleLayerHover - Function that get and sets featureId and Point for tooltip
 * @property {String} featuredId - The ID of the hovered feature
 * @property {String} featuredText - Text from feature property to show in tooltip
 * @property {Point} hoveredCoords - The coordinates used to place the tooltip
 */
/**
 * @typedef {Object} Point
 * @property {Number} x - The x coordinate to the place the tooltip
 * @property {Number} y - The y coordinate to the place the tooltip
 */
export function useHoverLayer() {
  const [featureText, setFeatureText] = useState(null);
  const [featureId, setFeatureId] = useState(null);
  const [hoveredCoords, setHoveredCoords] = useState(null);

  /**
   * Gets and sets data from a map feature used to populate and place a tooltip
   * @param {Object} e - Mouse hover event that supplies the feature details and hover coordinates
   */
  const handleLayerHover = (e) => {
    const layerSource = getLayerSource(e);

    // If a layer isn't hovered, reset state and don't proceed
    if (!layerSource) {
      setHoveredCoords(null);
      setFeatureText(null);
      setFeatureId(null);
      return;
    }
    // Otherwise, get details for tooltip
    const {
      originalEvent: { offsetX, offsetY },
    } = e;
    const featureId = getFeatureId(e.features[0], layerSource);
    const hoveredFeatureText = getFeatureHoverText(e.features[0], layerSource);

    setFeatureText(hoveredFeatureText);
    setFeatureId(featureId);
    setHoveredCoords({ x: offsetX, y: offsetY });
  };

  return { handleLayerHover, featureId, featureText, hoveredCoords };
}

/**
 * Custom hook that initializes a map viewport and fits it to a provided feature collection
 * @param {object} mapRef - Ref object whose current property exposes the map instance
 * @param {object} featureCollection - A GeoJSON feature collection to fit the map bounds around
 * @param {boolean} shouldFitOnFeatureUpdate - Determines if map fits to featuresCollection if collection updates
 * @param {number} padding - Padding (in px) to leave around the map components when fitting
 * @return {function} Function to use as a Mapbox GL JS onRender callback
 */
export function useFeatureCollectionToFitBounds(
  mapRef,
  featureCollection,
  shouldFitOnFeatureUpdate = true,
  padding = 250
) {
  const thereAreFeatures = featureCollection?.features?.length > 0 || false;
  const [hasFitInitialized, setHasFitInitialized] = useState(false);

  /* Fit map bounds to feature collection if there are features to zoom to */
  const zoomMapToFeatureCollection = () => {
    if (!thereAreFeatures) return;

    const mapBounds = createZoomBbox(featureCollection);

    mapRef.current &&
      mapRef.current.fitBounds(mapBounds, {
        padding,
        maxZoom: 16,
        duration: 0,
      });
  };

  const fitMapToFeatureCollectionOnRender = () => {
    if (hasFitInitialized) return;

    zoomMapToFeatureCollection();
    setHasFitInitialized(true);
  };

  // Watch for changes to the project components and zoom to them if shouldFitOnFeatureUpdate = true
  useEffect(() => {
    if (!shouldFitOnFeatureUpdate) return;

    zoomMapToFeatureCollection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureCollection, shouldFitOnFeatureUpdate]);

  return { fitMapToFeatureCollectionOnRender };
}

const useStyles = makeStyles(() => ({
  layerSelectButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    zIndex: 1,
    height: "3rem",
    width: "205px",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "white",
    },
  },
  layerSelectDropdown: {
    width: "205px",
  },
}));

/**
 * Custom hook that creates a layer toggle UI
 * @param {array} initialSelectedLayerNames - Array of layer names to show initially
 * @return {UseLayerObject} Object that exposes updated array of visible layers and map UI render function
 */
/**
 * @typedef {object} UseLayerObject
 * @property {array} visibleLayerIds - Updated list of visible map layers
 * @property {function} renderLayerSelect - Function that returns JSX for layer toggle UI
 */
export function useLayerSelect(initialSelectedLayerNames) {
  /**
   * The initial state of visible ids is retrieved from the initialSelectedLayerNames
   * then we filter out any of them by checking if it has an `isInitiallyVisible` property.
   */
  const [visibleLayerIds, setVisibleLayerIds] = useState(
    initialSelectedLayerNames.filter(
      (layerName) =>
        mapConfig.layerConfigs[layerName]?.isInitiallyVisible ?? true
    )
  );
  const [mapStyle, setMapStyle] = useState("streets");
  const mapStyleConfig = basemaps[mapStyle];
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  /**
   * Handles the click event on a menu item
   * @param {Object} event - The click event
   */
  const handleMenuItemClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the menu
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Takes a click event and adds/removes a layer name from the visible layers array
   * @param {string} layerName - The name of the layer to enable
   */
  const handleLayerCheckboxClick = (layerName) => {
    setVisibleLayerIds((prevLayers) => {
      return prevLayers.includes(layerName)
        ? [...prevLayers.filter((name) => name !== layerName)]
        : [...prevLayers, layerName];
    });
  };

  /**
   * Takes a click event and sets a basemap key string so a value can be read from the basemaps object
   * @param {string} basemapKey - The name of the base map: streets or aerial
   */
  const handleBasemapChange = (basemapKey) => {
    setMapStyle(basemapKey);
  };

  const StyledMenu = withStyles({
    paper: {
      border: "1px solid #d3d4d5",
      width: "205px",
    },
  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    />
  ));

  const StyledMenuItem = withStyles((theme) => ({
    root: {
      "&:focus": {
        backgroundColor: theme.palette.grey["100"],
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
          color: theme.palette.common.black,
        },
      },
    },
  }))(MenuItem);

  const projectFeatureLayerNames = ["projectFeatures", "projectFeaturePoints"];

  /**
   * Renders the dropdown menu to select layers
   * @param {boolean} showProjectFeatures - When true, it hides other project features
   * @return {JSX.Element}
   */
  const renderLayerSelect = (showProjectFeatures = false) => (
    <div>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="outlined"
        color="default"
        onClick={handleMenuItemClick}
        className={classes.layerSelectButton}
        startIcon={
          Boolean(anchorEl) ? <KeyboardArrowUp /> : <KeyboardArrowDown />
        }
      >
        Map Features
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transitionDuration={0}
      >
        {getLayerNames().map((name) => {
          if (!showProjectFeatures && projectFeatureLayerNames.includes(name))
            return null;

          return (
            <StyledMenuItem
              onClick={() => handleLayerCheckboxClick(name)}
              value={name}
              key={name}
            >
              <ListItemIcon>
                <Checkbox
                  checked={visibleLayerIds.includes(name)}
                  name={name}
                  color="primary"
                />
              </ListItemIcon>
              <ListItemText primary={mapConfig.layerConfigs[name].layerLabel} />
            </StyledMenuItem>
          );
        })}
      </StyledMenu>
    </div>
  );

  return {
    visibleLayerIds,
    renderLayerSelect,
    mapStyleConfig,
    handleBasemapChange,
    mapStyle,
  };
}

export const layerSelectStyles = {
  layerSelectBox: {
    position: "absolute",
    top: 105,
    left: 35,
    background: theme.palette.background.mapControls,
    boxShadow: "0 0 0 2px rgb(0 0 0 / 10%);",
    borderRadius: 4,
    zIndex: 1,
  },
  layerSelectTitle: {
    fontWeight: "bold",
    padding: "10px 10px 0px 10px",
  },
  layerSelectText: {
    paddingRight: 10,
  },
  layerRadioGroup: {
    paddingLeft: 10,
  },
};

/**
 * Generates a list of all layers that are user drawn
 */
export const drawnLayerNames = Object.entries(mapConfig.layerConfigs)
  .filter(([layerName, layer]) => layer.layerDrawn)
  .map(([layerName, layer]) => layer.layerIdName);

/**
 * Reconstructs a GeoJSON collection and renames all its features using
 * a provided layer name id (as specified in the configuration settings).
 * @param {Object} projectOtherFeaturesCollection - A GeoJSON collection
 * @param {Object} newLayerNameConfig - An object containing a key value pair of names based on feature type
 */
export const useTransformProjectFeatures = (
  projectOtherFeaturesCollection,
  newLayerNameConfig // We need to generate a new collection
) => ({
  // First, enter the type (which never changes)
  type: "FeatureCollection",
  // Then, create the features attribute with the output of a map
  features: (projectOtherFeaturesCollection?.features ?? []).map((feature) => ({
    // For every feature, first copy the element
    ...feature,
    // Then, overwrite the feature's 'properties' attribute
    properties: {
      // With a copy of the existing feature's properties
      ...feature.properties,
      // And with an overwritten sourceLayer attribute (if it can find it)
      sourceLayer:
        // Try to find it in the configuration object
        newLayerNameConfig[feature.geometry.type] ??
        // or default to the original one if not found in the config
        feature.properties.sourceLayer,
    },
  })),
});

/**
 * Instantiates a saveActionState and a dispatch function
 * @return {Object}
 */
export const useSaveActionReducer = () => {
  const [saveActionState, saveActionDispatch] = useReducer(
    mapSaveActionReducer, // The reducer function handler
    null, // Initializer argument
    mapSaveActionInitialState // Initial state
  );

  return { saveActionState, saveActionDispatch };
};

/**
 * Combines an array of `LineString` or `MultiLineSting` geoJSON features into a single
 * geometry. Specifically used as helper to reconstruct line features which have been
 * split through mapbox's vector tiling
 * @param {Object} features - An array of at least one GeoJSON (or geojson-like) features.
 * @return {Object} The combined GeoJSON geometry object
 */
export const combineLineGeometries = (features) => {
  // assemble features into a collection, which turf requires
  let dummyFeatureCollection = {
    type: "FeatureCollection",
    features: features,
  };
  // combined returns a featureCollection with one (and only one) feature with combined geometries
  const combinedFeaturesCollection = combine(dummyFeatureCollection);
  return combinedFeaturesCollection.features[0].geometry;
};

/**
 * Test the AGOL response JSON for errors. The API will return a 200
 * response when a query fails.
 * an error response looks like this:
 * {
 *   error: {
 *      code: 400,
 *      message: "",
 *      details: ["'Invalid field: PROJECT_EXTENT_ID' parameter is invalid"],
 *    },
 * };
 * @param {Object} jsonResponse - The response JSON from AGOL
 * @return {Object} the response JSON, after logging an error if error
 **/
const handleAgolResponse = (jsonResponse) => {
  if (jsonResponse?.error) {
    console.error(`Error fetching geometry: ${JSON.stringify(jsonResponse)}`);
  }
  return jsonResponse;
};

/**
 * Fetch a CTN geosjon feature from ArcGIS Online based on it's project_extent_id
 * @param {String} projectExtentId - The unique ID of the feature to be queried
 * @param {String} ctnAGOLEndpoint - Base url of the feature service endpoint (global var)
 * @return {Object} Geojson featureCollection of the queried feature - or null if fetch error
 */
export const queryCtnFeatureService = async function (projectExtentId) {
  const params = {
    where: `CTN_SEGMENT_ID=${projectExtentId}`,
    outFields: "CTN_SEGMENT_ID",
    geometryPrecision: 6,
    f: "pgeojson",
  };

  const paramString = Object.entries(params)
    .map((param) => `${param[0]}=${encodeURIComponent(param[1])}`)
    .join("&");
  const url = `${ctnAGOLEndpoint}/query?${paramString}`;

  return await fetch(url)
    .then((response) => response.json())
    .then((jsonResponse) => {
      return handleAgolResponse(jsonResponse);
    })
    .catch((err) => {
      console.log("Error fetching geometry: " + JSON.stringify(err));
      return null;
    });
};
