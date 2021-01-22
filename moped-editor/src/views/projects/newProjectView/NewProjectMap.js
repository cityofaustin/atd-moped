import React, { useState, useRef, useCallback } from "react";
import ReactMapGL, { Layer, NavigationControl, Source } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { Box, Typography, makeStyles } from "@material-ui/core";
import { isEqual } from "lodash";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import {
  createProjectSelectLayerConfig,
  getGeoJSON,
  getInteractiveIds,
  getLayerSource,
  getFeatureId,
  isFeaturePresent,
  MAPBOX_TOKEN,
  mapConfig,
  mapStyles,
  renderTooltip,
  sumFeaturesSelected,
  useHoverLayer,
} from "../../../utils/mapHelpers";

export const useStyles = makeStyles({
  locationCountText: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
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
});

const NewProjectMap = ({
  selectedLayerIds,
  setSelectedLayerIds,
  featureCollection,
  setFeatureCollection,
}) => {
  const classes = useStyles();
  const mapRef = useRef();

  const [viewport, setViewport] = useState(mapConfig.mapInit);
  const { handleHover, featureId, hoveredCoords } = useHoverLayer();

  const handleLayerHover = e => {
    handleHover(e);
  };

  const handleLayerClick = e => {
    const layerSource = getLayerSource(e);

    if (!layerSource) return;

    const clickedFeatureId = getFeatureId(
      e,
      mapConfig.layerConfigs[layerSource].layerIdField
    );
    const selectedFeature = getGeoJSON(e);

    if (!!clickedFeatureId && !!layerSource) {
      const layerIds = selectedLayerIds[layerSource] || [];

      const updatedLayerIds = !layerIds.includes(clickedFeatureId)
        ? [...layerIds, clickedFeatureId]
        : layerIds.filter(id => id !== clickedFeatureId);

      const updatedSelectedIds = {
        ...selectedLayerIds,
        [layerSource]: updatedLayerIds,
      };

      const updatedFeatureCollection = isFeaturePresent(
        selectedFeature,
        featureCollection.features
      )
        ? {
            ...featureCollection,
            features: featureCollection.features.filter(
              feature => !isEqual(feature, selectedFeature)
            ),
          }
        : {
            ...featureCollection,
            features: [...featureCollection.features, selectedFeature],
          };

      setSelectedLayerIds(updatedSelectedIds);
      setFeatureCollection(updatedFeatureCollection);
    }
  };

  const handleViewportChange = viewport => setViewport(viewport);

  const handleGeocoderViewportChange = useCallback(newViewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return handleViewportChange({
      ...newViewport,
      ...geocoderDefaultOverrides,
    });
  }, []);

  return (
    <Box className={classes.mapBox}>
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width="100%"
        height={500}
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
          >
            <Layer
              key={config.layerIdName}
              {...createProjectSelectLayerConfig(
                featureId,
                sourceName,
                selectedLayerIds
              )}
            />
          </Source>
        ))}
        {renderTooltip(featureId, hoveredCoords, classes.toolTip)}
      </ReactMapGL>
      <Typography className={classes.locationCountText}>
        {sumFeaturesSelected(selectedLayerIds)} locations selected
      </Typography>
    </Box>
  );
};

export default NewProjectMap;
