import React, { useRef } from "react";
import Map, { NavigationControl } from "react-map-gl";
import { Box, makeStyles } from "@material-ui/core";
import "mapbox-gl/dist/mapbox-gl.css";

import {
  createSummaryMapLayers,
  getSummaryMapInteractiveIds,
  MAPBOX_TOKEN,
  mapStyles,
  renderTooltip,
  countFeatures,
  useHoverLayer,
  useFeatureCollectionToFitBounds,
  basemaps,
} from "../../../../utils/mapHelpers";

const useStyles = makeStyles({
  locationCountText: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  toolTip: mapStyles.toolTipStyles,
});

const ProjectSummaryMap = ({ projectFeatureCollection }) => {
  const classes = useStyles();
  const mapRef = useRef();
  const featureCount = countFeatures(projectFeatureCollection);

  /**
   * Make use of a custom hook that returns a vector tile layer hover event handler
   * and the details to place and populate a tooltip.
   */
  const { handleLayerHover, featureText, hoveredCoords } = useHoverLayer();

  /**
   * Make use of a custom hook that initializes a map viewport
   * and fits it to a provided feature collection.
   */
  const [viewport, setViewport] = useFeatureCollectionToFitBounds(
    mapRef,
    projectFeatureCollection
  );

  /**
   * Updates viewport on zoom, scroll, and other events
   * @param {Object} updatedViewPort - Mapbox object that stores properties of the map view
   */
  const handleViewportChange = (updatedViewPort) =>
    setViewport(updatedViewPort);

  /**
   * Let's throw an error intentionally if there are no features for a project.
   */
  if (featureCount < 1) {
    // Throw an error if this component was called without features to render.
    throw Error("Map error: Cannot render or edit maps with no features");
  }

  /**
   * If we do have features, proceed to render map.
   */
  return (
    <Box>
      <Map
        /* Current state of viewport */
        {...viewport}
        /* Object reference to this object */
        ref={mapRef}
        maxZoom={20}
        style={{ width: "100%", height: "60vh" }}
        /* Access Key */
        mapboxAccessToken={MAPBOX_TOKEN}
        /* Get the IDs from the layerConfigs object to set as interactive in the summary map */
        /* If specified: Pointer event callbacks will only query the features under the pointer of these layers.
              The getCursor callback will receive isHovering: true when hover over features of these layers */
        interactiveLayerIds={getSummaryMapInteractiveIds(
          projectFeatureCollection
        )}
        /* Gets and sets data from a map feature used to populate and place a tooltip */
        onMouseMove={handleLayerHover}
        /* Updates state of viewport on zoom, scroll, and other events */
        onMove={handleViewportChange}
        mapStyle={basemaps.streets}
      >
        {/* Draw Navigation controls with specific styles */}
        <NavigationControl showCompass={false} position="bottom-right" />
        {/*
          If there is GeoJSON data, create sources and layers for
          each source layer in the project's GeoJSON FeatureCollection
        */}
        {projectFeatureCollection &&
          createSummaryMapLayers(projectFeatureCollection)}
        {/* Draw tooltip on feature hover */}
        {renderTooltip(featureText, hoveredCoords, classes.toolTip)}
      </Map>
    </Box>
  );
};

export default ProjectSummaryMap;
