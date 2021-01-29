import React, { useState, useRef, useEffect } from "react";
import ReactMapGL, {
  Layer,
  NavigationControl,
  Source,
  WebMercatorViewport,
} from "react-map-gl";
import { AutoSizer } from "react-virtualized";
import { Box, Button, makeStyles } from "@material-ui/core";
import { EditLocation as EditLocationIcon } from "@material-ui/icons";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import {
  createProjectViewLayerConfig,
  MAPBOX_TOKEN,
  mapConfig,
  mapStyles,
  renderTooltip,
  renderFeatureCount,
  sumFeaturesSelected,
  useHoverLayer,
  createZoomBbox,
} from "../../../utils/mapHelpers";

const useStyles = makeStyles({
  mapBox: { width: "100%", height: "60vh" },
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
  editButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});

const ProjectSummaryMap = ({
  selectedLayerIds,
  projectExtentGeoJSON,
  setIsEditing,
}) => {
  const classes = useStyles();
  const mapRef = useRef();
  const featureCount = sumFeaturesSelected(selectedLayerIds);
  const mapBounds = createZoomBbox(projectExtentGeoJSON);

  const [viewport, setViewport] = useState(mapConfig.mapInit);
  const { handleLayerHover, featureId, hoveredCoords } = useHoverLayer();

  /**
   * Updates viewport on zoom, scroll, and other events
   * @param {Object} viewport - Mapbox object that stores properties of the map view
   */
  const handleViewportChange = viewport => setViewport(viewport);

  useEffect(() => {
    // if (projectExtentGeoJSON.features.length === 0) return;
    const vp = new WebMercatorViewport({
      viewport,
      width: 500,
      height: 500,
    });

    const newViewport = vp.fitBounds(mapBounds, { padding: 40 });
    console.log(newViewport);
    const { longitude, latitude, zoom } = newViewport;
    setViewport({
      ...viewport,
      longitude,
      latitude,
      zoom,
    });
  }, []);

  return (
    <Box className={classes.mapBox}>
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width={"100%"}
        height={"100%"}
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEditing(true)}
          startIcon={<EditLocationIcon />}
          className={classes.editButton}
        >
          Edit
        </Button>
      </ReactMapGL>
      {renderFeatureCount(featureCount)}
    </Box>
  );
};

export default ProjectSummaryMap;
