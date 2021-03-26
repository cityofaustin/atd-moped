import React, { useRef, useState } from "react";
import ReactMapGL, { Layer, NavigationControl, Source } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";
import {
  Editor,
  DrawPointMode,
  EditingMode,
  RENDER_STATE,
  SHAPE,
} from "react-map-gl-draw";
import { Box, makeStyles } from "@material-ui/core";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import {
  createProjectSelectLayerConfig,
  getGeoJSON,
  getInteractiveIds,
  getLayerNames,
  getLayerSource,
  getFeatureId,
  isFeaturePresent,
  layerSelectStyles,
  MAPBOX_TOKEN,
  mapConfig,
  mapStyles,
  sumFeaturesSelected,
  useFeatureCollectionToFitBounds,
  useHoverLayer,
  useLayerSelect,
  renderFeatureCount,
} from "../../../utils/mapHelpers";

const MODES = [
  { id: "drawPoint", text: "Draw Point", handler: DrawPointMode },
  { id: "edit", text: "Edit Point", handler: EditingMode },
];

const STROKE_COLOR = "rgb(38, 181, 242)";
const FILL_COLOR = "rgb(189,189,189)";
const CIRCLE_RADIUS = 8;

const SELECTED_STYLE = {
  stroke: STROKE_COLOR,
  strokeWidth: 2,
  fill: FILL_COLOR,
  fillOpacity: 0.3,
};

const HOVERED_STYLE = {
  stroke: STROKE_COLOR,
  strokeWidth: 2,
  fill: FILL_COLOR,
  fillOpacity: 0.3,
};

const DEFAULT_STYLE = {
  stroke: "#000",
  strokeWidth: 2,
  fill: FILL_COLOR,
  fillOpacity: 0.1,
};

// https://github.com/uber/nebula.gl/blob/17aa19903bda8e5caaf14b6d25da624a1d317919/examples/react-map-gl-draw/style.js#L100
export function getFeatureStyle({ feature, state }) {
  const type = feature.properties.shape || feature.geometry.type;
  let style = null;

  switch (state) {
    case RENDER_STATE.SELECTED:
      style = { ...SELECTED_STYLE };
      break;

    case RENDER_STATE.HOVERED:
      style = { ...HOVERED_STYLE };
      break;

    default:
      style = { ...DEFAULT_STYLE };
  }

  switch (type) {
    case SHAPE.POINT:
      style.r = CIRCLE_RADIUS;
      break;

    default:
  }

  return style;
}

export const useStyles = makeStyles({
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
  ...layerSelectStyles,
});

const NewProjectMap = ({
  selectedLayerIds,
  setSelectedLayerIds,
  featureCollection,
  setFeatureCollection,
}) => {
  const classes = useStyles();
  const mapRef = useRef();
  const featureCount = sumFeaturesSelected(selectedLayerIds);

  const [viewport, setViewport] = useFeatureCollectionToFitBounds(
    mapRef,
    featureCollection,
    false
  );

  const { handleLayerHover, featureId } = useHoverLayer();

  const { visibleLayerIds, renderLayerSelect } = useLayerSelect(
    getLayerNames(),
    classes
  );

  /**
   * Adds or removes an interactive map feature from the project's feature collection and selected IDs array
   * @param {Object} e - Event object for click
   */
  const handleLayerClick = e => {
    const layerName = getLayerSource(e);

    if (!layerName) return;

    const clickedFeatureId = getFeatureId(e.features[0], layerName);
    const selectedFeature = getGeoJSON(e);

    const layerIds = selectedLayerIds[layerName] || [];

    const updatedLayerIds = !layerIds.includes(clickedFeatureId)
      ? [...layerIds, clickedFeatureId]
      : layerIds.filter(id => id !== clickedFeatureId);

    const updatedSelectedIds = {
      ...selectedLayerIds,
      [layerName]: updatedLayerIds,
    };

    const updatedFeatureCollection = isFeaturePresent(
      selectedFeature,
      featureCollection.features,
      layerName
    )
      ? {
          ...featureCollection,
          features: featureCollection.features.filter(
            feature => getFeatureId(feature, layerName) !== clickedFeatureId
          ),
        }
      : {
          ...featureCollection,
          features: [...featureCollection.features, selectedFeature],
        };

    setSelectedLayerIds(updatedSelectedIds);
    setFeatureCollection(updatedFeatureCollection);
  };

  /**
   * Updates viewport on zoom, scroll, and other events
   * @param {Object} viewport - Mapbox object that stores properties of the map view
   */
  const handleViewportChange = viewport => setViewport(viewport);

  /**
   * Updates viewport on select of location from geocoder form
   * @param {Object} newViewport - Mapbox object that stores updated location for viewport
   */
  const handleGeocoderViewportChange = newViewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return handleViewportChange({
      ...newViewport,
      ...geocoderDefaultOverrides,
    });
  };

  // TODO: Add drawn points to GeoJSON
  // TODO: Update cursor when drawing
  // TODO: Style the points

  const mapEditorRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [modeId, setModeId] = useState(null);
  const [modeHandler, setModeHandler] = useState(null);

  const switchMode = e => {
    const switchModeId = e.target.value === modeId ? null : e.target.value;
    const mode = MODES.find(m => m.id === switchModeId);
    const modeHandler = mode ? new mode.handler() : null;

    setModeId(modeId);
    setModeHandler(modeHandler);
    setIsDrawing(true);
  };

  const handleFeatureDraw = drawObject => {
    const features = mapEditorRef.current.getFeatures();
    console.log(features);

    // const pointFeature = {
    //   id, // an unique identified generated inside react-map-gl-draw library
    //   geometry: {
    //     coordinates, // latitude longitude pairs of the geometry points
    //     type // geojson type, one of `Point`, `LineString`, or `Polygon`
    //   },
    //   properties: {
    //     renderType, // Mainly used for styling, one of `Point`, `LineString`, `Polygon`, or `Rectangle`. Different from `geometry.type`. i.e. a rectangle's renderType is `Rectangle`, and `geometry.type` is `Polygon`. An incomplete (not closed) Polygon's renderType is `Polygon`, `geometry.type` is `LineString`
    //     ...otherProps // other properties user passed in
    //   }
    // }

    // pointCoords &&
    //   setEditFeatures(prevFeatures => [...prevFeatures, pointCoords]);
  };

  const renderDrawToolbar = () => {
    return (
      <div
        style={{ position: "absolute", top: 60, right: 10, maxWidth: "320px" }}
      >
        <select onChange={switchMode}>
          <option value="">--Please choose a draw mode--</option>
          {MODES.map(mode => (
            <option key={mode.id} value={mode.id}>
              {mode.text}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <Box className={classes.mapBox}>
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width="100%"
        height="60vh"
        interactiveLayerIds={!isDrawing && getInteractiveIds()}
        onHover={!isDrawing && handleLayerHover}
        onClick={!isDrawing && handleLayerClick}
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
            maxzoom={config.layerMaxLOD || mapConfig.mapboxDefaultMaxZoom} // maxLOD found in vector tile layer metadata
          >
            <Layer
              key={config.layerIdName}
              {...createProjectSelectLayerConfig(
                featureId,
                sourceName,
                selectedLayerIds,
                visibleLayerIds
              )}
            />
          </Source>
        ))}
        {renderLayerSelect()}
        <Editor
          ref={mapEditorRef}
          onUpdate={handleFeatureDraw}
          featureStyle={getFeatureStyle}
          // to make the lines/vertices easier to interact with
          clickRadius={12}
          mode={modeHandler}
        />
        {renderDrawToolbar()}
      </ReactMapGL>
      {renderFeatureCount(featureCount)}
    </Box>
  );
};

export default NewProjectMap;
