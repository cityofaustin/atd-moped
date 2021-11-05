import React, { useCallback, useEffect, useRef } from "react";
import ReactMapGL, { Layer, NavigationControl, Source } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { Box, makeStyles } from "@material-ui/core";
import bboxPolygon from "@turf/bbox-polygon";
import booleanIntersects from "@turf/boolean-intersects";
import polygonToLine from "@turf/polygon-to-line";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "./NewProjectMap.css";

import {
  NewProjectDrawnLinesInvisibleStyle,
  NewProjectDrawnPointsInvisibleStyle,
} from "../../../styles/NewProjectDrawnFeatures";

import {
  combineLineGeometries,
  countFeatures,
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
  queryCtnFeatureService,
  useFeatureCollectionToFitBounds,
  useHoverLayer,
  useLayerSelect,
  renderFeatureCount,
  useTransformProjectFeatures,
} from "../../../utils/mapHelpers";

import { useMapDrawTools } from "../../../utils/mapDrawHelpers";

import NewProjectMapBaseMap from "./NewProjectMapBaseMap";

export const useStyles = makeStyles(theme => ({
  toolTip: mapStyles.toolTipStyles,
  layerSelectButton: {
    position: "absolute",
    top: ".5rem",
    right: "1rem",
    zIndex: 1,
    height: "3rem",
    width: "206px",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "white",
    },
  },
  mapBoxEditButtonGroup: {
    position: "absolute",
    top: ".5rem",
    right: "16rem",
    zIndex: 1,
  },
  mapBoxEditButtonGroupButton: {
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "white",
    },
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
    zIndex: 2,
    // Keep geocoder input in set position when mapbox-gl-geocoder.css media queries kick in
    "@media (max-width:640px)": {
      top: 32,
    },
  },
  speedDial: {
    right: "3.5rem !important",
    bottom: "4.5rem !important",
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
  ...layerSelectStyles,
}));

const removeFeatureFromCollection = (selectedFeature, featureCollection) => {
  return {
    ...featureCollection,
    features: featureCollection.features.filter(
      feature =>
        getFeatureId(feature, selectedFeature.properties.sourceLayer) !==
        getFeatureId(selectedFeature, selectedFeature.properties.sourceLayer)
    ),
  };
};

const addFeatureToCollection = (selectedFeature, featureCollection) => {
  return {
    ...featureCollection,
    features: [...featureCollection.features, selectedFeature],
  };
};

/**
 * Add or remove a feature from the current component featureCollection state
 * @param {Object} selectedFeature - The geojson feature to be added/removed
 * @param {Object} featureCollection - Current geojson featureCollection (state)
 * @param {function} setFeatureCollection - The function to change the feature collection state
 * @return {undefined} Side effect of calling setFeatureCollection with new state
 */
const commitFeatureCollectionUpdate = (
  selectedFeature,
  featureCollection,
  setFeatureCollection
) => {
  const handlerFunc = selectedFeature._isPresent
    ? removeFeatureFromCollection
    : addFeatureToCollection;
  const updatedFeatureCollection = handlerFunc(
    selectedFeature,
    featureCollection
  );
  setFeatureCollection(updatedFeatureCollection);
};

/**
 * Handles when a new map feature is selected and updates feature collection state.
 * Determines if the feature can be safely added directly to feature collection state,
 * or if the feature geometry may be clipped from tiling, in which case a copy of
 * the complete feature geometry is fetch from ArcGIS Online.
 * @param {Object} selectedFeature - The selected feature geojson
 * @param {Object} map - the Mapbox Map instance
 * @param {Object} featureCollection - A feature collection GeoJSON object (state)
 * @param {function} setFeatureCollection - The function to change the feature collection state
 * @return {undefined} Side effect of setting FeatureCollection with new state
 */
const handleSelectedFeatureUpdate = (
  selectedFeature,
  map,
  featureCollection,
  setFeatureCollection
) => {
  if (
    selectedFeature.properties.sourceLayer === "CTN" &&
    !selectedFeature._isPresent
  ) {
    // CTN (aka line) features that are being added to the feature collection may be clipped.

    // Query features in the current viewport
    const renderedFeatures = map.queryRenderedFeatures();

    const selectedFeatureId = getFeatureId(
      selectedFeature,
      selectedFeature.properties.sourceLayer
    );

    // Identify feature fragements by filtering for their common ID
    const splitFeatures = renderedFeatures.filter(
      feature =>
        getFeatureId(feature, selectedFeature.properties.sourceLayer) ===
        selectedFeatureId
    );

    if (splitFeatures.length > 1) {
      // Merge the split feature geometries together
      selectedFeature.geometry = combineLineGeometries(splitFeatures);
    }

    const bbox = map
      .getBounds()
      .toArray()
      .flat();
    const bboxLine = polygonToLine(bboxPolygon(bbox));
    const intersectsWithBounds = booleanIntersects(bboxLine, selectedFeature);

    if (intersectsWithBounds) {
      // this feature is rendered to the edge of the viewport and may (still) be fragmented.
      // we cannnot know with certainty, so we fetch it's complete geometry from AGOL to be
      // safe. also considered turf.booleanWithin() and turf.booleanContains - not reliable.
      queryCtnFeatureService(selectedFeatureId).then(
        queriedFeatureCollection => {
          // Update the selectedFeature geometry if a feature has been found. To potential
          // error cases are handled here:
          //    1. fetch error: queriedFeatureCollection is null
          //    2. feature is not found (queriedFeatureCollection.features is empty)
          // In both cases we simply use the geometry of the selectedFeature which may be
          // fragemented but is better than nothing.
          selectedFeature.geometry =
            queriedFeatureCollection?.features?.[0]?.geometry ||
            selectedFeature.geometry;
        }
      );
    }
  }
  commitFeatureCollectionUpdate(
    selectedFeature,
    featureCollection,
    setFeatureCollection
  );
  return;
};

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
 * @param {boolean} isSignalComponent - if component selected is a signal
 * @param {boolean} drawLines - if component selected should be represented by lines
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
  isSignalComponent = false,
  drawLines = null,
}) => {
  const classes = useStyles();

  const featureCount = countFeatures(featureCollection);
  const selectedLayerIds = createSelectedIdsObjectFromFeatureCollection(
    featureCollection
  );
  const mapRef = useRef();
  const mapGeocoderContainerRef = useRef();
  const mapEditToolsContainerRef = useRef();
  const mapBasemapContainerRef = useRef();
  /**
   * Generate a viewport configuration object
   */
  const [viewport, setViewport] = useFeatureCollectionToFitBounds(
    mapRef,
    // If this is a new feature, use the project feature collection to retrieve the area
    newFeature ? projectFeatureCollection : featureCollection,
    isSignalComponent
  );

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

  /*
   * {boolean} isDrawing - Are draw tools enabled or disabled
   * {function} setIsDrawing - Toggle isdrawing
   * {function} renderMapDrawTools - Function that returns JSX for the draw tools in the map
   * {function} saveDrawnPoints - Function that saves features drawn in the UI
   */
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

    let feature = getGeoJSON(e);
    // we need sourceLayer for many side effects!
    feature.properties.sourceLayer = layerName;

    feature._isPresent = isFeaturePresent(
      feature,
      featureCollection.features,
      feature.properties.sourceLayer
    );

    const map = mapRef.current.getMap();

    handleSelectedFeatureUpdate(
      feature,
      map,
      featureCollection,
      setFeatureCollection
    );
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

  // render the drawable layers if component has been selected (drawLines), not a component and not already drawing
  const renderDrawLayers =
    !isDrawing && !isSignalComponent && drawLines !== null;

  return (
    <Box className={noPadding ? classes.mapBoxNoPadding : classes.mapBox}>
      {/* These two lines act as a conditional global override of MapBox. */}
      {!visibleLayerIds.includes("drawnByUser") && (
        <NewProjectDrawnPointsInvisibleStyle />
      )}
      {!visibleLayerIds.includes("drawnByUserLine") && (
        <NewProjectDrawnLinesInvisibleStyle />
      )}

      {/* The following div acts as an anchor and it specifies where the geocoder will live */}
      <div
        ref={mapGeocoderContainerRef}
        className={classes.geocoderContainer}
      />
      <div
        ref={mapEditToolsContainerRef}
        className={classes.mapBoxEditButtonGroup}
      />
      <div ref={mapBasemapContainerRef} className={classes.speedDial} />

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
        maxZoom={20}
        width="100%"
        height="60vh"
        interactiveLayerIds={
          renderDrawLayers ? getEditMapInteractiveIds(drawLines) : []
        }
        onHover={renderDrawLayers ? handleLayerHover : null}
        onClick={renderDrawLayers ? handleLayerClick : null}
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
        <NewProjectMapBaseMap
          containerRef={mapBasemapContainerRef}
          handleBasemapChange={handleBasemapChange}
          mapStyle={mapStyle}
        />

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
        {drawLines !== null &&
          Object.entries(mapConfig.layerConfigs).map(([sourceName, config]) => {
            if (isSignalComponent && sourceName !== "drawnByUser") {
              // hides feature selecting and drawing layers when when component is a signal
              return null;
            }
            if (
              drawLines === true &&
              sourceName === "Project_Component_Points_prototype"
            ) {
              return null;
            }
            if (drawLines === false && sourceName === "CTN") {
              return null;
            }
            return config.layerUrl ? (
              // If a config has a url, it is needs state to update selected/unselected layers
              <Source
                key={config.layerIdName}
                type="vector"
                tiles={[config.layerUrl]}
                maxZoom={config.layerMaxLOD || mapConfig.mapboxDefaultMaxZoom} // maxLOD found in vector tile layer metadata
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
            );
          })}

        {/* Street Tool Tip*/}
        {renderTooltip(featureText, hoveredCoords, classes.toolTip)}

        {/* Draw tools */}
        {!isSignalComponent &&
          drawLines !== null &&
          renderMapDrawTools(mapEditToolsContainerRef, drawLines)}
      </ReactMapGL>

      {/* Feature Count */}
      {renderFeatureCount(featureCount, isDrawing)}
    </Box>
  );
};

export default NewProjectMap;
