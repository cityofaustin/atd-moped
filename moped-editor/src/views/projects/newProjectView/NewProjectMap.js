import React, { useRef, useCallback, useState, useEffect } from "react";
import ReactMapGL, { Layer, NavigationControl, Source } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { Box, Icon, makeStyles, Typography } from "@material-ui/core";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "./NewProjectMap.css";

import {
  createProjectSelectLayerConfig,
  createProjectViewLayerConfig,
  createSelectedIdsObjectFromFeatureCollection,
  drawnLayerNames,
  getClickEditableLayerNames,
  getGeoJSON,
  getEditMapInteractiveIds,
  getLayerNames,
  getLayerSource,
  getFeatureId,
  isFeaturePresent,
  layerSelectStyles,
  MAPBOX_TOKEN,
  mapConfig,
  mapStyles,
  renderTooltip,
  countFeatures,
  useFeatureCollectionToFitBounds,
  useHoverLayer,
  useLayerSelect,
  renderFeatureCount,
  useTransformProjectFeatures,
} from "../../../utils/mapHelpers";

import { useMapDrawTools } from "../../../utils/mapDrawHelpers";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";

export const useStyles = makeStyles(theme => ({
  toolTip: mapStyles.toolTipStyles,
  layerSelectButton: {
    position: "absolute",
    top: ".5rem",
    right: "1rem",
    zIndex: 1,
    height: "3rem",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "white",
    },
  },
  mapBoxEditButtonGroup: {
    position: "absolute",
    top: ".5rem",
    right: "14rem",
    zIndex: 999,
  },
  mapBoxEditButtonGroupButton: {
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "white",
    },
  },
  mapStyleToggle: {
    position: "absolute",
    top: "-10.45rem",
    right: "-2.5rem;",
  },
  mapStyleToggleImage: {
    width: "5rem",
    borderRadius: ".5rem",
  },
  mapStyleToggleLabel: {
    position: "relative",
    bottom: "-1.3rem",
    fontSize: ".8rem",
    fontWeight: "bold",
  },
  mapStyleToggleLabelIcon: {
    position: "relative",
    bottom: "-1.5rem",
    fontSize: ".8rem",
    fontWeight: "bold",
    marginRight: "4px",
  },
  mapStyleToggleTypography: {
    position: "absolute",
    height: "100%",
    width: "100%",
    top: "0",
  },
  mapStyleToggleTypographyOpen: {
    backgroundColor: "rgba(0,0,0,.25)",
    position: "absolute",
    height: "100%",
    width: "100%",
    top: "0",
  },
  navStyle: {
    position: "absolute",
    bottom: "3rem",
    right: "1rem",
  },
  mapBox: {
    padding: 25,
    position: "relative",
  },
  mapBoxNoPadding: {
    padding: 0,
    position: "relative",
  },
  geocoderContainer: {
    display: "flex",
    height: 50,
    position: "absolute",
    alignItems: "center",
    width: "21rem",
    left: "1rem",
    top: ".5rem",
    // Keep geocoder input in set position when mapbox-gl-geocoder.css media queries kick in
    "@media (max-width:640px)": {
      top: 32,
    },
  },
  exampleWrapper: {
    position: "relative",
    marginTop: theme.spacing(3),
    height: 380,
  },
  speedDial: {
    right: "3.5rem !important",
    bottom: "2.2rem !important",
    position: "absolute",
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
  speedDialStreets: {
    color: "black",
    backgroundImage: "url(/moped/static/images/mapStreets.jpg) !important",
  },
  speedDialAerial: {
    color: "white",
    backgroundImage: "url(/moped/static/images/mapAerial.jpg) !important",
  },
  ...layerSelectStyles,
}));

/**
 * This the new project map editor component
 * @param {Object} featureCollection - A feature collection GeoJSON object (state)
 * @param {function} setFeatureCollection - The function to change the feature collection state
 * @param {Number} projectId - The current project id (optional)
 * @param {Object} projectFeatureCollection - A helper state containing a secondary feature collection (optional)
 * @param {function} refetchProjectDetails - A callback function to re-fetch the project's details  (optional)
 * @param {boolean} noPadding - Set to True if you wish for the map to have no padding (optional)
 * @param {boolean} newFeature - Set to True if this is a new feature for a project (optional
 * @param {Object} saveActionState - The current state of save action
 * @param {function} saveActionDispatch - Changes the state of save action
 * @param {JSX.Element} componentEditorPanel - An editor panel component (optional)
 * @return {JSX.Element}
 * @constructor
 */
const NewProjectMap = ({
  featureCollection,
  setFeatureCollection,
  projectId = null,
  projectFeatureCollection = null,
  refetchProjectDetails = null,
  noPadding = false,
  newFeature = false,
  saveActionState = null,
  saveActionDispatch = null,
  componentEditorPanel = null,
}) => {
  const classes = useStyles();

  const featureCount = countFeatures(featureCollection);
  const selectedLayerIds = createSelectedIdsObjectFromFeatureCollection(
    featureCollection
  );

  const mapRef = useRef();
  const mapGeocoderContainerRef = useRef();
  const mapEditToolsContainerRef = useRef();

  /**
   * Generate a viewport configuration object
   */
  const [viewport, setViewport] = useFeatureCollectionToFitBounds(
    mapRef,
    // If this is a new feature, use the project feature collection to retrieve the area
    newFeature ? projectFeatureCollection : featureCollection,
    false
  );

  /**
   * Basemap Speed Dial State
   */
  const [mapBasemapSpeedDialOpen, setBasemapSpeedDialOpen] = useState(false);

  const {
    handleLayerHover,
    featureText,
    featureId,
    hoveredCoords,
  } = useHoverLayer();

  const {
    visibleLayerIds,
    renderLayerSelect,
    mapStyleConfig,
    handleBasemapChange,
    mapStyle,
  } = useLayerSelect(getLayerNames(), classes);

  /**
   * Creates a geojson layer with all the other features of the project
   * and converts the feature type into whatever we specify. In this case,
   * we will use 'projectFeatures'.
   * @type {Object} otherProjectFeaturesCollection - GeoJSON Collection
   */
  const otherProjectFeaturesCollection = useTransformProjectFeatures(
    projectFeatureCollection,
    {
      LineString: "projectFeatures",
      Point: "projectFeaturePoints",
    }
  );

  const {
    isDrawing,
    setIsDrawing,
    renderMapDrawTools,
    saveDrawnPoints,
  } = useMapDrawTools(
    featureCollection,
    setFeatureCollection,
    projectId,
    refetchProjectDetails,
    viewport.zoom,
    saveActionDispatch
  );

  /**
   * Adds or removes an interactive map feature from the project's feature collection and selected IDs array
   * @param {Object} e - Event object for click
   */
  const handleLayerClick = e => {
    const layerName = getLayerSource(e);

    // If a user clicks a drawn point in the map, open draw UI
    if (drawnLayerNames.includes(layerName)) {
      setIsDrawing(true);
    }

    if (!layerName || !getClickEditableLayerNames().includes(layerName)) return;

    const clickedFeatureId = getFeatureId(e.features[0], layerName);
    const selectedFeature = getGeoJSON(e);

    const updatedFeatureCollection = isFeaturePresent(
      selectedFeature,
      featureCollection.features,
      layerName
    )
      ? {
          ...featureCollection,
          features: featureCollection.features.filter(
            feature => getFeatureId(feature, layerName) !== clickedFeatureId
          ),
        }
      : {
          ...featureCollection,
          features: [...featureCollection.features, selectedFeature],
        };

    setFeatureCollection(updatedFeatureCollection);
  };

  /**
   * Updates viewport on zoom, scroll, and other events
   * @param {Object} viewport - Mapbox object that stores properties of the map view
   */
  const handleViewportChange = useCallback(
    viewport => setViewport(prevViewport => ({ ...prevViewport, ...viewport })),
    [setViewport]
  );

  /**
   * Updates viewport on select of location from geocoder form
   * @param {Object} newViewport - Mapbox object that stores updated location for viewport
   */
  const handleGeocoderViewportChange = useCallback(
    newViewport => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange]
  );

  /**
   * Customize cursor depending on user actions
   * @param {object} pointerStates - Object containing pointer state keys and boolean values
   * @param {boolean} pointerStates.isHovering - Is user hovering an interactive feature
   * @param {boolean} pointerStates.isDragging - Is user dragging map
   */
  const getCursor = ({ isHovering, isDragging }) => {
    return isDragging
      ? "grabbing"
      : isHovering || isDrawing // Show pointer when user is drawing as well
      ? "pointer"
      : "default";
  };

  /**
   * Changes the current basemap and closes the speed dial menu
   * @param basemapName
   */
  const handleBasemapSpeedDialClose = basemapName => {
    setBasemapSpeedDialOpen(false);
    if (basemapName) handleBasemapChange(basemapName);
  };

  /**
   * Opens the speed dial menu
   */
  const handleBasemapSpeedDialOpen = () => {
    setBasemapSpeedDialOpen(true);
  };

  /**
   * Whenever a Save Action is initiated, save all drawn features
   * */
  useEffect(() => {
    // Ignore empty states
    if (!saveActionState) return;
    // If the process has been already initiated, we don't need to go any further
    if (saveActionState?.currentStep && saveActionState.currentStep > 1) return;
    // It looks like this is the first step
    if (
      saveActionState?.initiateFeatureSave &&
      saveActionState?.featuresSaved === false
    ) {
      saveDrawnPoints();
    }
  }, [saveActionState, saveDrawnPoints]);

  return (
    <Box className={noPadding ? classes.mapBoxNoPadding : classes.mapBox}>
      {/* The following div acts as an anchor and it specifies where the geocoder will live */}
      <div ref={mapGeocoderContainerRef} className={classes.geocoderContainer} />
      <div ref={mapEditToolsContainerRef} className={classes.mapBoxEditButtonGroup} />

      {/***************************************************************************
       Render these controls outside ReactMapGL so mouse events don't propagate to the map
       ***************************************************************************/}
      {/*
        The component editor panel is a JSX.Element that is null by default, it carries
        the component editing UI and functionality.
      */}
      {componentEditorPanel}
      {/* renderLayerSelect generates the layer select components */}
      {renderLayerSelect(projectFeatureCollection !== null)}

      {/***************************************************************************
                                       ReactMapGL
       ***************************************************************************/}
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width="100%"
        height="60vh"
        interactiveLayerIds={!isDrawing && getEditMapInteractiveIds()}
        onHover={!isDrawing ? handleLayerHover : null}
        onClick={!isDrawing ? handleLayerClick : null}
        getCursor={getCursor}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={handleViewportChange}
        mapStyle={mapStyleConfig}
      >
        <div className={classes.navStyle}>
          <NavigationControl showCompass={false} captureClick={false} />
        </div>
        {/***************************************************************************
         BaseMap Speed Dial
         ***************************************************************************/}
        <SpeedDial
          ariaLabel="Layers SpeedDial"
          className={classes.speedDial}
          hidden={false}
          icon={
            <Typography
              className={
                mapBasemapSpeedDialOpen
                  ? classes.mapStyleToggleTypographyOpen
                  : classes.mapStyleToggleTypography
              }
            >
              <Icon className={classes.mapStyleToggleLabelIcon}>layers</Icon>
              <span className={classes.mapStyleToggleLabel}>Map</span>
            </Typography>
          }
          onClose={() => handleBasemapSpeedDialClose(null)}
          onOpen={handleBasemapSpeedDialOpen}
          open={mapBasemapSpeedDialOpen}
          direction={"left"}
          FabProps={{
            className:
              mapStyle !== "streets"
                ? classes.speedDialStreets
                : classes.speedDialAerial,
          }}
        >
          <SpeedDialAction
            key={"streets"}
            icon={
              <Typography>
                <span className={classes.mapStyleToggleLabel}>Streets</span>
              </Typography>
            }
            tooltipTitle={"Streets Base Map"}
            tooltipPlacement={"top"}
            onClick={() => handleBasemapSpeedDialClose("streets")}
          />
          <SpeedDialAction
            key={"aerial"}
            icon={
              <Typography>
                <span className={classes.mapStyleToggleLabel}>Aerial</span>
              </Typography>
            }
            tooltipTitle={"Aerial Base Map"}
            tooltipPlacement={"top"}
            onClick={() => handleBasemapSpeedDialClose("aerial")}
          />
        </SpeedDial>

        {/* GEOCODER */}
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          bbox={mapConfig.geocoderBbox}
          containerRef={mapGeocoderContainerRef}
          marker={false}
          position="top-right"
        />

        {/* RENDER LAYERS */}
        {Object.entries(mapConfig.layerConfigs).map(([sourceName, config]) =>
          // If a config has a url, it is needs state to update selected/unselected layers
          config.layerUrl ? (
            <Source
              key={config.layerIdName}
              type="vector"
              tiles={[config.layerUrl]}
              maxzoom={config.layerMaxLOD || mapConfig.mapboxDefaultMaxZoom} // maxLOD found in vector tile layer metadata
            >
              <Layer
                key={config.layerIdName}
                {...createProjectSelectLayerConfig(
                  featureId,
                  sourceName,
                  selectedLayerIds,
                  visibleLayerIds
                )}
              />
            </Source>
          ) : (
            <Source
              key={config.layerIdName}
              id={config.layerIdName}
              type="geojson"
              data={{
                ...featureCollection,
                features: [
                  ...featureCollection.features,
                  ...(otherProjectFeaturesCollection?.features ?? []),
                ].filter(
                  feature => feature.properties.sourceLayer === sourceName
                ),
              }}
            >
              <Layer
                key={config.layerIdName}
                {...createProjectViewLayerConfig(
                  config.layerIdName,
                  visibleLayerIds
                )}
              />
            </Source>
          )
        )}

        {/* Street Tool Tip*/}
        {renderTooltip(featureText, hoveredCoords, classes.toolTip)}

        {/* Draw tools */}
        {renderMapDrawTools(mapEditToolsContainerRef)}
      </ReactMapGL>

      {/***************************************************************************
                        Feature Count & Draw Mode Controls
       ***************************************************************************/}
      {renderFeatureCount(featureCount, isDrawing)}
    </Box>
  );
};

export default NewProjectMap;
