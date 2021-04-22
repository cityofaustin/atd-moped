import React, { useRef } from "react";
import ReactMapGL, {
  Layer,
  MapController,
  NavigationControl,
  Source,
} from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
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

class CustomMapController extends MapController {
  handleEvent(event) {
    console.log(event);
    super.handleEvent(event);
  }

  _onPan(event) {
    // ignore pan on map control input
    if (this._isMapControlInputNode(event.target)) {
      return;
    }

    super._onPan(event);
  }

  _onDoubleTap(event) {
    // ignore double taps on map control input
    if (this._isMapControlInputNode(event.target)) {
      return;
    }

    super._onDoubleTap(event);
  }

  _onHover(event) {
    // ignore double taps on map control input
    if (this._isMapControlInputNode(event.target)) {
      return;
    }

    super._onHover(event);
  }

  _isMapControlInputNode(node) {
    return node.classList.contains("mapboxgl-ctrl-geocoder--input");
  }
}

const customMapController = new CustomMapController();

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

  return (
    <Box className={classes.mapBox}>
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        controller={customMapController}
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
      </ReactMapGL>
      {renderFeatureCount(featureCount)}
    </Box>
  );
};

export default NewProjectMap;
