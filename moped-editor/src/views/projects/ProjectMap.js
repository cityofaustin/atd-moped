import React, { useState, useRef, useCallback } from "react";
import ReactMapGL, { Layer, NavigationControl } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import { Box, Typography, makeStyles } from "@material-ui/core";
import { isEqual } from "lodash";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import {
  createProjectLayerConfig,
  getGeoJSON,
  getLayerSource,
  getPolygonId,
  isFeaturePresent,
  MAPBOX_TOKEN,
  mapInit,
  renderTooltip,
  sumFeaturesSelected,
} from "./mapHelpers";

const useStyles = makeStyles(theme => ({
  locationCountText: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  toolTip: {
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
  navStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: "10px",
  },
  mapBox: {
    padding: 25,
  },
}));

const ProjectMap = ({
  selectedIds,
  setSelectedIds,
  featureCollection,
  setFeatureCollection,
}) => {
  const classes = useStyles();
  const mapRef = useRef();

  const [viewport, setViewport] = useState(mapInit);
  const [polygonId, setPolygonId] = useState("");
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredCoords, setHoveredCoords] = useState(null);

  const handleHover = e => {
    const {
      srcEvent: { offsetX, offsetY },
    } = e;

    const polygonId = getPolygonId(e);

    if (!!polygonId) {
      setPolygonId(polygonId);
      setHoveredFeature(polygonId);
      setHoveredCoords({ x: offsetX, y: offsetY });
    } else {
      setHoveredFeature(null);
      setHoveredCoords(null);
      setPolygonId(null);
    }
  };

  const handleClick = e => {
    const polygonId = getPolygonId(e);
    const layerSource = getLayerSource(e);
    const selectedFeature = getGeoJSON(e);

    if (!!polygonId && !!layerSource) {
      const layerIds = selectedIds[layerSource] || [];

      const updatedLayerIds = !layerIds.includes(polygonId)
        ? [...layerIds, polygonId]
        : layerIds.filter(id => id !== polygonId);

      const updatedSelectedIds = {
        ...selectedIds,
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

      setSelectedIds(updatedSelectedIds);
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
        interactiveLayerIds={["location-polygons"]}
        onHover={handleHover}
        onClick={handleClick}
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
          position="top-right"
        />

        <Layer
          key={"location-polygons"}
          {...createProjectLayerConfig(polygonId, "asmp_polygons", selectedIds)}
        />

        {renderTooltip(hoveredFeature, hoveredCoords, classes.toolTip)}
      </ReactMapGL>
      <Typography className={classes.locationCountText}>
        {sumFeaturesSelected(selectedIds)} locations selected
      </Typography>
    </Box>
  );
};

export default ProjectMap;
