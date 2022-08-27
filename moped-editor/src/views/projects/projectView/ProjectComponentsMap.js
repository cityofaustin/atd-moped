import React, { useCallback, useEffect, useRef, useState } from "react";
import Map, { Layer, NavigationControl, Source } from "react-map-gl";
import GeocoderControl from "src/components/Maps/GeocoderControl";
import { Box, makeStyles } from "@material-ui/core";
import bboxPolygon from "@turf/bbox-polygon";
import booleanIntersects from "@turf/boolean-intersects";
import polygonToLine from "@turf/polygon-to-line";
import "mapbox-gl/dist/mapbox-gl.css";
import "./ProjectComponentsMap.css";

import {
  NewProjectDrawnLinesInvisibleStyle,
  NewProjectDrawnPointsInvisibleStyle,
} from "../../../styles/NewProjectDrawnFeatures";

import {
  combineLineGeometries,
  createProjectSelectLayerConfig,
  createProjectViewLayerConfig,
  createSelectedIdsObjectFromFeatureCollection,
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
  makeCommonComponentsMapStyles,
  renderTooltip,
  queryCtnFeatureService,
  useFeatureCollectionToFitBounds,
  useHoverLayer,
  useLayerSelect,
  useTransformProjectFeatures,
} from "../../../utils/mapHelpers";

import { useMapDrawTools } from "../../../utils/mapDrawHelpers";

import ProjectComponentsBaseMap from "./ProjectComponentsBaseMap";

// See https://github.com/visgl/react-map-gl/issues/1266#issuecomment-753686953
import mapboxgl from "mapbox-gl";
mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export const useStyles = makeStyles((theme) => ({
  toolTip: mapStyles.toolTipStyles,
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
  ...layerSelectStyles,
  ...makeCommonComponentsMapStyles(theme),
}));

const removeFeatureFromCollection = (selectedFeature, featureCollection) => {
  return {
    ...featureCollection,
    features: featureCollection.features.filter(
      (feature) =>
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
    selectedFeature.properties.sourceLayer === "ATD_ADMIN.CTN" &&
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
      (feature) =>
        getFeatureId(feature, selectedFeature.properties.sourceLayer) ===
        selectedFeatureId
    );

    if (splitFeatures.length > 1) {
      // Merge the split feature geometries together
      selectedFeature.geometry = combineLineGeometries(splitFeatures);
    }

    const bbox = map.getBounds().toArray().flat();
    const bboxLine = polygonToLine(bboxPolygon(bbox));
    const intersectsWithBounds = booleanIntersects(bboxLine, selectedFeature);

    if (intersectsWithBounds) {
      // this feature is rendered to the edge of the viewport and may (still) be fragmented.
      // we cannnot know with certainty, so we fetch it's complete geometry from AGOL to be
      // safe. also considered turf.booleanWithin() and turf.booleanContains - not reliable.
      queryCtnFeatureService(selectedFeatureId).then(
        (queriedFeatureCollection) => {
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
 * @param {Object} projectFeatureCollection - A helper state containing a secondary feature collection (optional)
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
const ProjectComponentsMap = ({
  featureCollection,
  setFeatureCollection,
  projectFeatureCollection = null,
  noPadding = false,
  newFeature = false,
  saveActionState = null,
  saveActionDispatch = null,
  componentEditorPanel = null,
  isSignalComponent = false,
  drawLines = null,
}) => {
  const classes = useStyles();
  const selectedLayerIds =
    createSelectedIdsObjectFromFeatureCollection(featureCollection);
  const mapRef = useRef();
  const mapEditToolsContainerRef = useRef();
  const mapBasemapContainerRef = useRef();
  /**
   * Generate a viewport configuration object
   */

  const [viewport, setViewport] = useState(mapConfig.mapInit);
  /**
   * Make use of a custom hook that fits to a provided feature collection.
   */
  const { fitMapToFeatureCollectionOnRender } = useFeatureCollectionToFitBounds(
    mapRef,
    // If this is a new feature, use the project feature collection to retrieve the area
    newFeature ? projectFeatureCollection : featureCollection,
    isSignalComponent
  );

  const { handleLayerHover, featureText, featureId, hoveredCoords } =
    useHoverLayer();

  const {
    visibleLayerIds,
    renderLayerSelect,
    mapStyleConfig,
    handleBasemapChange,
    mapStyle,
  } = useLayerSelect(getLayerNames());

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

  const shouldShowDrawTools = !isSignalComponent && drawLines !== null;
  /*
   * {boolean} isDrawing - Are draw tools enabled or disabled
   */
  const { isDrawing, renderMapDrawTools } = useMapDrawTools(
    featureCollection,
    setFeatureCollection,
    drawLines
  );

  const [cursor, setCursor] = useState("auto");
  const onMouseEnter = useCallback(() => setCursor("pointer"), []);
  const onMouseLeave = useCallback(() => setCursor("auto"), []);

  // Update cursor if we are drawing
  useEffect(() => {
    if (isDrawing) {
      setCursor(() => "crosshair");
    }
  }, [isDrawing]);

  /**
   * Adds or removes an interactive map feature from the project's feature collection and selected IDs array
   * @param {Object} e - Event object for click
   */
  const handleLayerClick = (e) => {
    const layerName = getLayerSource(e);

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
    (viewport) =>
      setViewport((prevViewport) => ({ ...prevViewport, ...viewport })),
    [setViewport]
  );

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
      saveActionDispatch({ type: "featuresSaved" });
    }
  }, [saveActionState, featureCollection, saveActionDispatch]);

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
      <Map
        {...viewport}
        ref={mapRef}
        maxZoom={20}
        style={{ width: "100%", height: "60vh" }}
        interactiveLayerIds={
          renderDrawLayers ? getEditMapInteractiveIds(drawLines) : []
        }
        onMouseMove={handleLayerHover}
        onMouseEnter={renderDrawLayers ? onMouseEnter : null}
        onClick={renderDrawLayers ? handleLayerClick : null}
        cursor={cursor}
        onMouseLeave={onMouseLeave}
        mapboxAccessToken={MAPBOX_TOKEN}
        onMove={(e) => handleViewportChange(e.viewState)}
        mapStyle={mapStyleConfig}
        onRender={fitMapToFeatureCollectionOnRender}
      >
        <NavigationControl
          showCompass={false}
          position="bottom-right"
          captureClick={false}
        />
        {/***************************************************************************
         BaseMap Speed Dial
         ***************************************************************************/}
        <ProjectComponentsBaseMap
          containerRef={mapBasemapContainerRef}
          handleBasemapChange={handleBasemapChange}
          mapStyle={mapStyle}
        />

        {/* GEOCODER */}
        <GeocoderControl
          marker={false}
          mapboxAccessToken={MAPBOX_TOKEN}
          position="top-left"
          flyTo={true}
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
              sourceName === "ATD_ADMIN.CTN_Intersections"
            ) {
              return null;
            }
            if (drawLines === false && sourceName === "ATD_ADMIN.CTN") {
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
                    (feature) => feature.properties.sourceLayer === sourceName
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
        {shouldShowDrawTools && renderMapDrawTools()}
      </Map>
    </Box>
  );
};

export default ProjectComponentsMap;
