import React, { useState, useRef, useCallback } from "react";
import ReactMapGL, { Layer, NavigationControl } from "react-map-gl";
import { Box, Typography, makeStyles } from "@material-ui/core";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import {
  createProjectLayerConfig,
  getVectorTilePolygonId,
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

const ProjectMap = () => {
  const classes = useStyles();
  const mapRef = useRef();

  const [viewport, setViewport] = useState(mapInit);
  const [vectorTilePolygonId, setVectorTilePolygonId] = useState("");
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredCoords, setHoveredCoords] = useState(null);

  const handleLayerHover = e => {
    const {
      srcEvent: { offsetX, offsetY },
    } = e;

    const vectorTilePolygonId = getVectorTilePolygonId(e);

    if (!!vectorTilePolygonId) {
      setVectorTilePolygonId(vectorTilePolygonId);
      setHoveredFeature(vectorTilePolygonId);
      setHoveredCoords({ x: offsetX, y: offsetY });
    } else {
      setHoveredFeature(null);
      setHoveredCoords(null);
      setVectorTilePolygonId(null);
    }
  };

  const handleViewportChange = viewport => setViewport(viewport);

  return (
    <Box className={classes.mapBox}>
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width="100%"
        height={500}
        interactiveLayerIds={["location-polygons"]}
        onHover={handleLayerHover}
        onClick={handleLayerClick}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={handleViewportChange}
      >
        <div className={classes.navStyle}>
          <NavigationControl showCompass={false} />
        </div>
        <Layer
          key={"location-polygons"}
          {...createProjectLayerConfig(
            vectorTilePolygonId,
            "asmp_polygons",
            selectedIds
          )}
        />
        {renderTooltip(hoveredFeature, hoveredCoords, classes.toolTip)}
      </ReactMapGL>
      <Typography className={classes.locationCountText}>
        {sumFeaturesSelected(selectedIds)} locations in this project
      </Typography>
    </Box>
  );
};

export default ProjectMap;
