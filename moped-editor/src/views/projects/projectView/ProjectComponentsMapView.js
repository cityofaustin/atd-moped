import React, { useCallback, useRef, useState } from "react";
import Map, { NavigationControl } from "react-map-gl";
import { Box, Button, Divider, Grid, makeStyles } from "@material-ui/core";
import "mapbox-gl/dist/mapbox-gl.css";
import GeocoderControl from "src/components/Maps/GeocoderControl";

import {
  createSummaryMapLayers,
  getSummaryMapInteractiveIds,
  MAPBOX_TOKEN,
  mapStyles,
  renderTooltip,
  useHoverLayer,
  useFeatureCollectionToFitBounds,
  useLayerSelect,
  getLayerNames,
  makeCommonComponentsMapStyles,
  mapConfig,
} from "../../../utils/mapHelpers";
import { KeyboardArrowUp } from "@material-ui/icons";
import ProjectComponentsBaseMap from "./ProjectComponentsBaseMap";
import MapToolsCollapse from "src/components/Maps/MapToolsCollapse";

// See https://github.com/visgl/react-map-gl/issues/1266#issuecomment-753686953
import mapboxgl from "mapbox-gl";
mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const useStyles = makeStyles((theme) => ({
  toolTip: mapStyles.toolTipStyles,
  locationCountText: {
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  layerSelectBox: {
    maxHeight: "35vh",
    overflow: "scroll",
    // Chrome
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "-ms-overflow-style": "none" /* IE and Edge */,
    "scrollbar-width": "none" /* Firefox */,
  },
  editButton: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  mapStyle: {
    position: "relative",
    padding: 0,
  },
  mapToolsDivider: {
    marginTop: ".5rem",
  },
  ...makeCommonComponentsMapStyles(theme),
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

  const [cursor, setCursor] = useState("grab");
  const onMouseEnter = useCallback(() => setCursor("pointer"), []);
  const onMouseLeave = useCallback(() => setCursor("grab"), []);

  const mapRef = useRef();

  const {
    visibleLayerIds,
    renderLayerSelect,
    mapStyleConfig,
    handleBasemapChange,
    mapStyle,
  } = useLayerSelect(getLayerNames());

  /**
   * Make use of a custom hook that returns a vector tile layer hover event handler
   * and the details to place and populate a tooltip.
   */
  const { handleLayerHover, featureText, hoveredCoords } = useHoverLayer();

  const [viewport, setViewport] = useState(mapConfig.mapInit);
  /**
   * Make use of a custom hook that fits to a provided feature collection.
   */
  const { fitMapToFeatureCollectionOnRender } = useFeatureCollectionToFitBounds(
    mapRef,
    projectFeatureCollection
  );

  /**
   * Updates viewport on zoom, scroll, and other events
   * @param {Object} viewport - Mapbox object that stores properties of the map view
   */
  const handleViewportChange = useCallback(
    (viewport) =>
      setViewport((prevViewport) => ({ ...prevViewport, ...viewport })),
    [setViewport]
  );

  /**
   * If we do have features, proceed to render map.
   */
  return (
    <Box className={noPadding ? classes.mapBoxNoPadding : classes.mapBox}>
      <MapToolsCollapse
        transitionInEditTools={editPanelCollapsed}
        onExitedEditTools={() => setEditPanelCollapsedShow(true)}
        transitionInShowTools={editPanelCollapsedShow}
        onShowToolsClick={() => setEditPanelCollapsedShow(false)}
        onExitShowTools={() => setEditPanelCollapsed(true)}
        showButtonText={"Show Components"}
      >
        <Grid>
          <Grid
            id={"moped-component-editor-container"}
            className={classes.layerSelectBox}
          >
            {children}
          </Grid>
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
      </MapToolsCollapse>

      {renderLayerSelect(false)}

      <Map
        /* Current state of viewport */
        {...viewport}
        onMove={(e) => handleViewportChange(e.viewState)}
        /* Object reference to this object */
        ref={mapRef}
        maxZoom={20}
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
        cursor={cursor}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        /* Updates state of viewport on zoom, scroll, and other events */
        mapStyle={mapStyleConfig}
        style={{ width: "100%", height: "60vh" }}
        onRender={fitMapToFeatureCollectionOnRender}
      >
        {/* Draw Navigation controls */}
        <NavigationControl showCompass={false} position="bottom-right" />

        {/* GEOCODER */}
        <GeocoderControl
          marker={false}
          mapboxAccessToken={MAPBOX_TOKEN}
          position="top-left"
          flyTo={true}
        />
        {/*
          If there is GeoJSON data, create sources and layers for
          each source layer in the project's GeoJSON FeatureCollection
        */}
        {projectFeatureCollection &&
          createSummaryMapLayers({
            type: "FeatureCollection",
            features: projectFeatureCollection.features.filter((feature) =>
              visibleLayerIds.includes(feature?.properties?.sourceLayer)
            ),
          })}

        {/* Draw tooltip on feature hover */}
        {renderTooltip(featureText, hoveredCoords, classes.toolTip)}
        <ProjectComponentsBaseMap
          handleBasemapChange={handleBasemapChange}
          mapStyle={mapStyle}
        />
      </Map>
    </Box>
  );
};

export default ProjectComponentsMapView;
