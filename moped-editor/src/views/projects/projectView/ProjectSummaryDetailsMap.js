import React, { useState, useRef } from "react";
import ReactMapGL, { Layer, NavigationControl, Source } from "react-map-gl";
import { Box, Typography, makeStyles } from "@material-ui/core";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import {
  createProjectViewLayerConfig,
  MAPBOX_TOKEN,
  mapConfig,
  mapStyles,
  renderTooltip,
  sumFeaturesSelected,
  useHoverLayer,
} from "../../../utils/mapHelpers";

const useStyles = makeStyles({
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
});

const ProjectSummaryDetailsMap = ({
  selectedLayerIds,
  projectExtentGeoJSON,
}) => {
  const classes = useStyles();
  const mapRef = useRef();

  const [viewport, setViewport] = useState(mapConfig.mapInit);
  const { handleHover, featureId, hoveredCoords } = useHoverLayer();

  const handleLayerHover = e => {
    handleHover(e);
  };

  const handleViewportChange = viewport => setViewport(viewport);

  return (
    <Box className={classes.mapBox}>
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width="100%"
        height={500}
        interactiveLayerIds={["projectExtent"]}
        onHover={handleLayerHover}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={handleViewportChange}
      >
        <div className={classes.navStyle}>
          <NavigationControl showCompass={false} />
        </div>
        {projectExtentGeoJSON && (
          <Source type="geojson" data={projectExtentGeoJSON}>
            <Layer {...createProjectViewLayerConfig()} />
          </Source>
        )}
        {renderTooltip(featureId, hoveredCoords, classes.toolTip)}
      </ReactMapGL>
      <Typography className={classes.locationCountText}>
        {sumFeaturesSelected(selectedLayerIds)} locations in this project
      </Typography>
    </Box>
  );
};

export default ProjectSummaryDetailsMap;
