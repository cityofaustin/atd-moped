import React, { useState, useRef, useCallback } from "react";
import ReactMapGL, { Layer, NavigationControl, Source } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { Box, Typography, makeStyles } from "@material-ui/core";
import { isEqual } from "lodash";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import {
  createProjectSelectLayerConfig,
  geocoderBbox,
  getGeoJSON,
  getInteractiveIds,
  getLayerSource,
  getFeatureId,
  isFeaturePresent,
  layerConfigs,
  MAPBOX_TOKEN,
  mapInit,
  renderTooltip,
  sumFeaturesSelected,
  toolTipStyles,
} from "../../../utils/mapHelpers";

export const useStyles = makeStyles({
  locationCountText: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  toolTip: toolTipStyles,
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

  const [viewport, setViewport] = useState(mapInit);
  const [vectorTilePolygonId, setVectorTilePolygonId] = useState(null);
  const [hoveredCoords, setHoveredCoords] = useState(null);

  const handleLayerHover = e => {
    const {
      srcEvent: { offsetX, offsetY },
    } = e;

    const vectorTilePolygonId = getFeatureId(e, "PROJECT_EXTENT_ID");

    if (!!vectorTilePolygonId) {
      setVectorTilePolygonId(vectorTilePolygonId);
      setHoveredCoords({ x: offsetX, y: offsetY });
    } else {
      setHoveredCoords(null);
      setVectorTilePolygonId(null);
    }
  };

  const handleLayerClick = e => {
    const vectorTilePolygonId = getFeatureId(e, "PROJECT_EXTENT_ID");
    const layerSource = getLayerSource(e);
    const selectedFeature = getGeoJSON(e);

    if (!!vectorTilePolygonId && !!layerSource) {
      const layerIds = selectedLayerIds[layerSource] || [];

      const updatedLayerIds = !layerIds.includes(vectorTilePolygonId)
        ? [...layerIds, vectorTilePolygonId]
        : layerIds.filter(id => id !== vectorTilePolygonId);

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
          bbox={geocoderBbox}
          position="top-right"
        />
        {layerConfigs.map(config => (
          <Source key={config.layerId} type="vector" tiles={[config.layerUrl]}>
            <Layer
              key={config.layerId}
              {...createProjectSelectLayerConfig(
                vectorTilePolygonId,
                config,
                selectedLayerIds
              )}
            />
          </Source>
        ))}
        {renderTooltip(vectorTilePolygonId, hoveredCoords, classes.toolTip)}
      </ReactMapGL>
      <Typography className={classes.locationCountText}>
        {sumFeaturesSelected(selectedLayerIds)} locations selected
      </Typography>
    </Box>
  );
};

export default NewProjectMap;
