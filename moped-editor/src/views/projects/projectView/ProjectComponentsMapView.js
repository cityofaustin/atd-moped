import React, { useCallback, useRef, useState } from "react";
import ReactMapGL, { NavigationControl } from "react-map-gl";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  makeStyles,
} from "@material-ui/core";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import {
  createSummaryMapLayers,
  getSummaryMapInteractiveIds,
  MAPBOX_TOKEN,
  mapStyles,
  renderTooltip,
  renderFeatureCount,
  countFeatures,
  useHoverLayer,
  useFeatureCollectionToFitBounds,
  mapConfig,
  useLayerSelect,
  getLayerNames,
} from "../../../utils/mapHelpers";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@material-ui/icons";
import Geocoder from "react-map-gl-geocoder";
import NewProjectMapBaseMap from "../newProjectView/NewProjectMapBaseMap";

const useStyles = makeStyles(theme => ({
  locationCountText: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  layerSelectBox: {
    maxHeight: "35vh",
    overflow: "scroll",
  },
  layerSelectButton: {
    position: "absolute",
    top: ".5rem",
    right: "1rem",
    zIndex: 1,
    height: "3rem",
    width: "184px",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "white",
    },
  },
  toolTip: mapStyles.toolTipStyles,
  navStyle: {
    position: "absolute",
    bottom: "3rem",
    right: "1rem",
  },
  mapBox: {
    padding: 25,
    position: "relative",
  },
  mapBoxNoPadding: {
    padding: 0,
    position: "relative",
  },
  editButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  geocoderContainer: {
    display: "flex",
    height: 50,
    position: "absolute",
    alignItems: "center",
    width: "21rem",
    left: "1rem",
    top: ".5rem",
    zIndex: 2,
    // Keep geocoder input in set position when mapbox-gl-geocoder.css media queries kick in
    "@media (max-width:640px)": {
      top: 32,
    },
  },
  mapStyle: {
    position: "relative",
    padding: 0,
  },
  mapTools: {
    position: "absolute",
    top: "4rem",
    left: "1rem",
    zIndex: "1",
    width: "21rem",
    background: theme.palette.common.white,
    border: "lightgray 1px solid",
    borderRadius: ".5rem",
    padding: ".5rem",
  },
  mapToolsShowHidden: {
    position: "absolute",
    top: "4rem",
    left: "1rem",
    zIndex: "1",
    width: "21rem",
    background: theme.palette.common.white,
    border: "lightgray 1px solid",
    borderRadius: ".5rem",
    padding: ".5rem",
    "&:hover": {
      background: theme.palette.common.white,
    },
  },
  mapToolsDivider: {
    marginTop: ".5rem",
  },
  speedDial: {
    right: "3.5rem !important",
    bottom: "4.5rem !important",
    position: "absolute",
    zIndex: 1,
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
}));

/**
 * THe project component map viewer
 * @param {Object} projectFeatureCollection - The features collection GeoJSON
 * @param {JSX.Element} children - Any components we want to render around the map
 * @param {boolean} noPadding - If true, we use no padding style in the map
 * @return {JSX.Element}
 * @constructor
 */
const ProjectComponentsMapView = ({
  projectFeatureCollection,
  children,
  noPadding,
}) => {
  const classes = useStyles();

  const [editPanelCollapsed, setEditPanelCollapsed] = useState(true);
  const [editPanelCollapsedShow, setEditPanelCollapsedShow] = useState(false);

  const mapRef = useRef();
  const mapGeocoderContainerRef = useRef();
  const mapBasemapContainerRef = useRef();

  const featureCount = countFeatures(projectFeatureCollection);

  const {
    visibleLayerIds,
    renderLayerSelect,
    mapStyleConfig,
    handleBasemapChange,
    mapStyle,
  } = useLayerSelect(getLayerNames(), classes);

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
   * @param {Object} viewport - Mapbox object that stores properties of the map view
   */
  const handleViewportChange = useCallback(
    viewport => setViewport(prevViewport => ({ ...prevViewport, ...viewport })),
    [setViewport]
  );

  /**
   * Updates viewport on select of location from geocoder form
   * @param {Object} newViewport - Mapbox object that stores updated location for viewport
   */
  const handleGeocoderViewportChange = useCallback(
    newViewport => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange]
  );

  /**
   * If we do have features, proceed to render map.
   */
  return (
    <Box className={noPadding ? classes.mapBoxNoPadding : classes.mapBox}>
      {/* The following div acts as an anchor and it specifies where the geocoder will live */}
      <div
        ref={mapGeocoderContainerRef}
        className={classes.geocoderContainer}
      />
      <div ref={mapBasemapContainerRef} className={classes.speedDial} />
      <Collapse
        in={editPanelCollapsedShow}
        onExit={() => setEditPanelCollapsed(true)}
      >
        <Button
          className={classes.mapToolsShowHidden}
          size={"small"}
          onClick={() => setEditPanelCollapsedShow(false)}
          startIcon={<KeyboardArrowDown />}
        >
          Show Components
        </Button>
      </Collapse>
      <Collapse
        className={classes.mapTools}
        in={editPanelCollapsed}
        onExited={() => setEditPanelCollapsedShow(true)}
      >
        <Grid>
          <Grid className={classes.layerSelectBox}>{children}</Grid>
          <Grid item xs={12}>
            <Divider className={classes.mapToolsDivider} />
            <Button
              onClick={() => setEditPanelCollapsed(false)}
              startIcon={<KeyboardArrowUp />}
              fullWidth
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </Collapse>

      {renderLayerSelect(false)}

      <ReactMapGL
        /* Current state of viewport */
        {...viewport}
        /* Object reference to this object */
        ref={mapRef}
        maxZoom={20}
        width="100%"
        height="60vh"
        /* Access Key */
        mapboxApiAccessToken={MAPBOX_TOKEN}
        /* Get the IDs from the layerConfigs object to set as interactive in the summary map */
        /* If specified: Pointer event callbacks will only query the features under the pointer of these layers.
                      The getCursor callback will receive isHovering: true when hover over features of these layers */
        interactiveLayerIds={getSummaryMapInteractiveIds(
          projectFeatureCollection
        )}
        /* Gets and sets data from a map feature used to populate and place a tooltip */
        onHover={handleLayerHover}
        /* Updates state of viewport on zoom, scroll, and other events */
        onViewportChange={handleViewportChange}
        mapStyle={mapStyleConfig}
      >
        {/* Draw Navigation controls with specific styles */}
        <span className={classes.navStyle}>
          <NavigationControl showCompass={false} />
        </span>

        {/* GEOCODER */}
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          bbox={mapConfig.geocoderBbox}
          containerRef={mapGeocoderContainerRef}
          marker={false}
          position="top-right"
        />
        {/*
          If there is GeoJSON data, create sources and layers for
          each source layer in the project's GeoJSON FeatureCollection
        */}
        {projectFeatureCollection &&
          createSummaryMapLayers({
            type: "FeatureCollection",
            features: projectFeatureCollection.features.filter(feature =>
              visibleLayerIds.includes(feature?.properties?.sourceLayer)
            ),
          })}

        {/* Draw tooltip on feature hover */}
        {renderTooltip(featureText, hoveredCoords, classes.toolTip)}
        <NewProjectMapBaseMap
          containerRef={mapBasemapContainerRef}
          handleBasemapChange={handleBasemapChange}
          mapStyle={mapStyle}
        />
      </ReactMapGL>
      {renderFeatureCount(featureCount)}
    </Box>
  );
};

export default ProjectComponentsMapView;
