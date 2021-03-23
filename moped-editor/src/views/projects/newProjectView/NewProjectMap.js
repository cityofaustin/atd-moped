import React, { useRef, useState } from "react";
import ReactMapGL, { Layer, NavigationControl, Source } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { Editor, DrawPointMode } from "react-map-gl-draw";
import { Box, makeStyles } from "@material-ui/core";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import {
  createProjectSelectLayerConfig,
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

const MODES = [{ id: "drawPoint", text: "Draw Point", handler: DrawPointMode }];

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
}) => {
  const classes = useStyles();
  const mapRef = useRef();
  const featureCount = sumFeaturesSelected(selectedLayerIds);

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

  /**
   * Adds or removes an interactive map feature from the project's feature collection and selected IDs array
   * @param {Object} e - Event object for click
   */
  const handleLayerClick = e => {
    const layerName = getLayerSource(e);

    if (!layerName) return;

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

  const [modeId, setModeId] = useState(null);
  const [modeHandler, setModeHandler] = useState(null);

  const switchMode = e => {
    const switchModeId = e.target.value === modeId ? null : e.target.value;
    const mode = MODES.find(m => m.id === switchModeId);
    const modeHandler = mode ? new mode.handler() : null;

    setModeId(modeId);
    setModeHandler(modeHandler);
  };

  const renderDrawToolbar = () => {
    return (
      <div
        style={{ position: "absolute", top: 60, right: 10, maxWidth: "320px" }}
      >
        <select onChange={switchMode}>
          <option value="">--Please choose a draw mode--</option>
          {MODES.map(mode => (
            <option key={mode.id} value={mode.id}>
              {mode.text}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <Box className={classes.mapBox}>
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width="100%"
        height="60vh"
        interactiveLayerIds={getInteractiveIds()}
        onHover={handleLayerHover}
        onClick={handleLayerClick}
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
        {Object.entries(mapConfig.layerConfigs).map(([sourceName, config]) => (
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
        ))}
        {renderLayerSelect()}
        <Editor
          // to make the lines/vertices easier to interact with
          clickRadius={12}
          mode={modeHandler}
        />
        {renderDrawToolbar()}
      </ReactMapGL>
      {renderFeatureCount(featureCount)}
    </Box>
  );
};

export default NewProjectMap;
