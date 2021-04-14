import React, { useRef } from "react";
import ReactMapGL, { Layer, NavigationControl, Source } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { Box, Button, makeStyles, Switch, Typography } from "@material-ui/core";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import {
  createProjectSelectLayerConfig,
  createProjectViewLayerConfig,
  getClickEditableLayerNames,
  getGeoJSON,
  getInteractiveIds,
  getLayerNames,
  getLayerSource,
  getFeatureId,
  isFeaturePresent,
  layerSelectStyles,
  MAPBOX_TOKEN,
  mapConfig,
  mapStyles,
  sumFeaturesSelected,
  useFeatureCollectionToFitBounds,
  useHoverLayer,
  useLayerSelect,
  renderFeatureCount,
} from "../../../utils/mapHelpers";

import { useMapDrawTools } from "../../../utils/mapDrawHelpers";

export const useStyles = makeStyles({
  toolTip: mapStyles.toolTipStyles,
  navStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: "10px",
  },
  mapBox: {
    padding: 25,
  },
  ...layerSelectStyles,
});

const NewProjectMap = ({
  selectedLayerIds,
  setSelectedLayerIds,
  featureCollection,
  setFeatureCollection,
  projectId = null,
  refetchProjectDetails,
}) => {
  const classes = useStyles();
  const mapRef = useRef();
  const featureCount = sumFeaturesSelected(featureCollection);

  const [viewport, setViewport] = useFeatureCollectionToFitBounds(
    mapRef,
    featureCollection,
    false
  );

  const { handleLayerHover, featureId } = useHoverLayer();

  const { visibleLayerIds, renderLayerSelect } = useLayerSelect(
    getLayerNames(),
    classes
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
    selectedLayerIds,
    refetchProjectDetails,
    viewport
  );

  /**
   * Adds or removes an interactive map feature from the project's feature collection and selected IDs array
   * @param {Object} e - Event object for click
   */
  const handleLayerClick = e => {
    const layerName = getLayerSource(e);

    if (!layerName || !getClickEditableLayerNames().includes(layerName)) return;

    const clickedFeatureId = getFeatureId(e.features[0], layerName);
    const selectedFeature = getGeoJSON(e);

    const layerIds = selectedLayerIds[layerName] || [];

    const updatedLayerIds = !layerIds.includes(clickedFeatureId)
      ? [...layerIds, clickedFeatureId]
      : layerIds.filter(id => id !== clickedFeatureId);

    const updatedSelectedIds = {
      ...selectedLayerIds,
      [layerName]: updatedLayerIds,
    };

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

    setSelectedLayerIds(updatedSelectedIds);
    setFeatureCollection(updatedFeatureCollection);
  };

  /**
   * Updates viewport on zoom, scroll, and other events
   * @param {Object} viewport - Mapbox object that stores properties of the map view
   */
  const handleViewportChange = viewport => setViewport(viewport);

  /**
   * Updates viewport on select of location from geocoder form
   * @param {Object} newViewport - Mapbox object that stores updated location for viewport
   */
  const handleGeocoderViewportChange = newViewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return handleViewportChange({
      ...newViewport,
      ...geocoderDefaultOverrides,
    });
  };

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

  return (
    <Box className={classes.mapBox}>
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width="100%"
        height="60vh"
        interactiveLayerIds={!isDrawing && getInteractiveIds()}
        onHover={!isDrawing ? handleLayerHover : null}
        onClick={!isDrawing ? handleLayerClick : null}
        getCursor={getCursor}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={handleViewportChange}
      >
        <div className={classes.navStyle}>
          <NavigationControl showCompass={false} />
        </div>
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          bbox={mapConfig.geocoderBbox}
          position="top-right"
        />
        {Object.entries(mapConfig.layerConfigs).map(([sourceName, config]) =>
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
                  ...featureCollection.features.filter(
                    feature => feature.properties.sourceLayer === sourceName
                  ),
                ],
              }}
            >
              <Layer
                key={config.layerIdName}
                {...createProjectViewLayerConfig(config.layerIdName)}
              />
            </Source>
          )
        )}
        {renderLayerSelect()}
        {isDrawing && renderMapDrawTools()}
      </ReactMapGL>
      {renderFeatureCount(featureCount)}
      <Switch
        checked={isDrawing}
        onChange={() => setIsDrawing(!isDrawing)}
        color="primary"
        name="mapDrawSwitch"
        inputProps={{ "aria-label": "primary checkbox" }}
      />
      <Typography>Draw Mode</Typography>
      {isDrawing && (
        <Button variant="contained" color="primary" onClick={saveDrawnPoints}>
          Save Drawn Points
        </Button>
      )}
    </Box>
  );
};

export default NewProjectMap;
