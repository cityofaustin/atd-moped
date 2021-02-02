import React, { useState, useRef, useEffect } from "react";
import ReactMapGL, {
  Layer,
  NavigationControl,
  Source,
  WebMercatorViewport,
} from "react-map-gl";
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

  const [viewport, setViewport] = useState(mapConfig.mapInit);
  const { handleLayerHover, featureId, hoveredCoords } = useHoverLayer();

  /**
   * Updates viewport on zoom, scroll, and other events
   * @param {Object} viewport - Mapbox object that stores properties of the map view
   */
  const handleViewportChange = viewport => setViewport(viewport);

  useEffect(() => {
    const currentMap = mapRef.current;
    const mapBounds = createZoomBbox(projectExtentGeoJSON);

    /**
     * Takes the existing viewport and transforms it to fit the project's features
     * @param {Object} viewport - Describes the map view
     * @return {Object} Viewport object with updated attributes based on project's features
     */
    const fitViewportToBounds = viewport => {
      const featureViewport = new WebMercatorViewport({
        viewport,
        width: currentMap._width,
        height: currentMap._height,
      });
      const newViewport = featureViewport.fitBounds(mapBounds, {
        padding: 100,
      });

      const { longitude, latitude, zoom } = newViewport;

      return {
        ...viewport,
        longitude,
        latitude,
        zoom,
      };
    };

    setViewport(viewport => fitViewportToBounds(viewport));
  }, [projectExtentGeoJSON]);

  return (
    <Box>
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width={"100%"}
        height={"60vh"}
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
