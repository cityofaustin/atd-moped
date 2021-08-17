import React, { useState, useRef, useCallback } from "react";
import MapDrawToolbar from "../views/projects/newProjectView/MapDrawToolbar";
import { Editor } from "react-map-gl-draw";
import {
  DrawLineStringMode,
  DrawPointMode,
  EditingMode,
  RENDER_STATE,
  SHAPE,
} from "react-map-gl-draw";
import { v4 as uuidv4 } from "uuid";
import { get } from "lodash";
import theme from "../theme/index";
import { mapStyles, drawnLayerNames } from "../utils/mapHelpers";

export const MODES = [
  {
    id: "disableDrawMode",
    text: "Select & Move",
    handler: null,
    icon: "icon-pointer.svg",
  },
  {
    id: "drawPoint",
    text: "Draw Point",
    handler: DrawPointMode,
    icon: "icon-draw-marker.svg",
  },
  {
    id: "drawLine",
    text: "Draw Line",
    handler: DrawLineStringMode,
    icon: "icon-draw-lines.svg",
  },
  {
    id: "edit",
    text: "Select Point",
    handler: EditingMode,
    icon: "icon-delete.svg",
  },
];

const STROKE_COLOR = theme.palette.primary.main;
const FILL_COLOR = theme.palette.primary.main;

const SELECTED_STYLE = {
  stroke: STROKE_COLOR,
  strokeWidth: 8,
  fill: FILL_COLOR,
  fillOpacity: 0,
};

const HOVERED_STYLE = {
  stroke: STROKE_COLOR,
  strokeWidth: 8,
  fill: FILL_COLOR,
  fillOpacity: 0,
};

const DEFAULT_STYLE = {
  stroke: theme.palette.primary.main,
  strokeWidth: 4,
  fill: theme.palette.secondary.main,
  fillOpacity: 1,
};

/**
 * Interpolate a feature width based on the zoom level of map
 * Adapted from Mapbox GL JS linear interpolation using a formula linked below
 * https://github.com/mapbox/mapbox-gl-js/blob/d66ff288e7ab2e917e9e676bee942dd6a46171e7/src/style-spec/expression/definitions/interpolate.js
 * https://matthew-brett.github.io/teaching/linear_interpolation.html
 * @param {number} currentZoom - Current zoom level from the map
 * @param {number} minZoom - Minimum zoom level from the current bracket
 * @param {number} maxZoom - Maximum zoom level from the current bracket
 * @param {number} minPixelWidth - Minimum pixel width from the current bracket
 * @param {number} maxPixelWidth - Maximum pixel width from the current bracket
 * @return {number} Interpolated pixel width
 */
function linearInterpolation(
  currentZoom,
  minZoom,
  maxZoom,
  minPixelWidth,
  maxPixelWidth
) {
  return (
    ((currentZoom - minZoom) * (maxPixelWidth - minPixelWidth)) /
      (maxZoom - minZoom) +
    minPixelWidth
  );
}

/**
 * Calculate the circle radius using the circle radius steps in mapStyles and the map zoom level
 * @param {number} currentZoom - Current zoom level from the map
 * @return {number} Circle radius in pixels
 */
const getCircleRadiusByZoom = currentZoom => {
  const { stops } = mapStyles.circleRadiusStops;
  const [bottomZoom, bottomPixelWidth] = stops[0];
  const [topZoom, topPixelWidth] = stops[stops.length - 1];

  // Loop through the [zoom, radius in pixel] nested arrays in mapStyles.circleRadiusStops
  // to find which two elements the current zoom level falls between
  for (let i = 0; i < stops.length - 1; i++) {
    const [minZoom, minPixelWidth] = stops[i];
    const [maxZoom, maxPixelWidth] = stops[i + 1];

    // If current zoom is less than zoom in the first element
    if (currentZoom < bottomZoom) {
      return bottomPixelWidth;
    }

    // If current zoom is greater than zoom in the last element
    if (currentZoom >= topZoom) {
      return topPixelWidth;
    }

    // If the current zoom falls somewhere between
    if (currentZoom >= minZoom && currentZoom < maxZoom) {
      return linearInterpolation(
        currentZoom,
        minZoom,
        maxZoom,
        minPixelWidth,
        maxPixelWidth
      );
    }
  }
};

// https://github.com/uber/nebula.gl/tree/master/modules/react-map-gl-draw#styling-related-options
/**
 * Style a feature based on feature type and draw render state
 * @param {object} featureStyle - Contains data about feature render state and type (shape)
 * @param {object} featureStyle.feature - A GeoJSON feature
 * @param {string} featureStyle.state - String describing the render state of a drawn feature (SELECTED or HOVERED)
 * @return {object} React style object applied to a feature
 */
export function getFeatureStyle({ feature, state, currentZoom }) {
  const type = feature.properties.shape || feature.geometry.type;
  let style = null;

  const CIRCLE_RADIUS = getCircleRadiusByZoom(currentZoom);

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
    case SHAPE.LINE_STRING:
      style.fillOpacity = 0;
      break;
    default:
  }

  return style;
}

/**
 * Retrieve a list of features that were drawn using the UI exposed from useMapDrawTools
 * @param {object} featureCollection - GeoJSON feature collection containing project extent
 * @return {array} List of features that originated from the draw UI
 */
const getDrawnFeaturesFromFeatureCollection = featureCollection =>
  featureCollection.features.filter(feature =>
    drawnLayerNames.includes(feature.properties.sourceLayer)
  );

/**
 * Return the difference between two arrays of GeoJSON objects
 * @param {string} featureProperty- GeoJSON property key used to compare arrays of GeoJSON features
 * @param {array}  arrayOne - The first array of GeoJSON features
 * @param {array}  arrayTwo - The second array of GeoJSON features
 * @return {array} List of features that are different
 */
const findDifferenceByFeatureProperty = (featureProperty, arrayOne, arrayTwo) =>
  arrayOne.filter(
    arrayOneFeature =>
      !arrayTwo.some(
        arrayTwoFeature =>
          arrayOneFeature.properties[featureProperty] ===
          arrayTwoFeature.properties[featureProperty]
      )
  );

/**
 * Custom hook that builds draw tools and is used to enable or disable them
 * @param {object} featureCollection - GeoJSON feature collection to store drawn points within
 * @param {function} setFeatureCollection - Setter for GeoJSON feature collection state
 * @param {string} projectId - ID of the project associated with the extent being edited
 * @param {function} refetchProjectDetails - Called to update the props passed to the edit maps and show up-to-date features
 * @param {number} currentZoom - Current zoom level of the map
 * @return {UseMapDrawToolsObject} Object that exposes a function to render draw tools and setter/getter for isDrawing state
 */
/**
 * @typedef {object} UseLayerObject
 * @property {boolean} isDrawing - Are draw tools enabled or disabled
 * @property {function} setIsDrawing - Toggle draw tools
 * @property {function} renderMapDrawTools - Function that returns JSX for the draw tools in the map
 * @property {function} saveDrawnPoints - Function that saves features drawn in the UI
 * @property {function} saveActionDispatch - Function that helps us send signals to other components
 */
export function useMapDrawTools(
  featureCollection,
  setFeatureCollection,
  projectId,
  refetchProjectDetails,
  currentZoom,
  saveActionDispatch
) {
  const mapEditorRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [modeId, setModeId] = useState(null);
  const [modeHandler, setModeHandler] = useState(null);

  /**
   * Returns true if lineStringA has the same coordinates as lineStringB
   * @param {Object} lineStringA - A line string feature object to compare
   * @param {Object} lineStringB - Another line string feature object to compare against
   * @return {boolean}
   */
  const lineStringEqual = (lineStringA, lineStringB) => {
    const lineStringCoordinatesA = lineStringA?.geometry?.coordinates ?? [];
    const lineStringCoordinatesB = lineStringB?.geometry?.coordinates ?? [];

    return (
      // Test both have more than one pair of coordinates
      lineStringCoordinatesA.length > 1 &&
      lineStringCoordinatesB.length > 1 &&
      // Test they both have the same length
      lineStringCoordinatesA.length === lineStringCoordinatesB.length &&
      // Test every element in both lines is equivalent
      lineStringCoordinatesA.every(
        (coordinatePair, currentIndex) =>
          coordinatePair[0] === lineStringCoordinatesB[currentIndex][0] &&
          coordinatePair[1] === lineStringCoordinatesB[currentIndex][1]
      ) // 'every' returns true if every comparison (the predicate) in the array returns true
    );
  };

  /**
   * Returns true if lineStringA has the same coordinates as lineStringB
   * @param featurePointA - A point to compare
   * @param featurePointB - Another point to compare against
   * @return {boolean}
   */
  const pointEqual = (featurePointA, featurePointB) => {
    return (
      featurePointA?.geometry?.coordinates[0] ===
        featurePointB?.geometry?.coordinates[0] &&
      featurePointA?.geometry?.coordinates[1] ===
        featurePointB?.geometry?.coordinates[1]
    );
  };

  /**
   * Returns true if the 'feature' is of indicated 'type'
   * @param {String} type - The type as a string (ie. Point, LineString)
   * @param {Object} feature - The object feature to evaluate
   * @return {boolean}
   */
  const isFeatureOfType = (type, feature) => {
    return (
      (feature?.geometry?.type ?? "no type found").toLowerCase() ===
      (type ?? "type not provided").toLowerCase()
    );
  };

  /**
   * Compares the type for two features, returns true if they are both equal
   * @param {Object} featureA - A feature object
   * @param {Object} featureB - The feature object to compare against
   * @return {boolean}
   */
  const featureTypesEqual = (featureA, featureB) =>
    (featureA?.geometry?.type ?? 1) === (featureB?.geometry?.type ?? 0);

  /**
   * Add existing drawn points in the project extent feature collection to the draw UI so they are editable
   */
  const initializeExistingDrawFeatures = useCallback(
    ref => {
      if (ref) {
        // Only add features that are not already present in the draw UI to avoid duplicates
        const drawnFeatures = getDrawnFeaturesFromFeatureCollection(
          featureCollection
        );

        // Collect all the features in the map
        const featuresAlreadyInDrawMap = ref.getFeatures();

        // Retrieve only the features that are present in state, but not the map
        const featuresToAdd = findDifferenceByFeatureProperty(
          "PROJECT_EXTENT_ID",
          drawnFeatures,
          featuresAlreadyInDrawMap
        );

        // Draw the features
        ref.addFeatures(featuresToAdd);
      }
    },
    [featureCollection]
  );

  /**
   * Updates state and mutates additions and deletions of points drawn with the UI
   */
  const saveDrawnPoints = (runActionDispatch = true) => {
    // If there is a map reference, get it's features or assume empty array
    const drawnFeatures = mapEditorRef.current
      ? mapEditorRef.current.getFeatures()
      : [];

    // Filter out anything without a source layer
    const newDrawnFeatures = drawnFeatures.filter(
      feature => !drawnLayerNames.includes(feature?.properties?.sourceLayer)
    );

    const drawnFeaturesWithSourceAndId = newDrawnFeatures
      .map(feature => {
        const featureUUID = uuidv4();

        return {
          ...feature,
          id: featureUUID,
          properties: {
            ...feature.properties,
            renderType: feature.geometry.type,
            PROJECT_EXTENT_ID: featureUUID,
            sourceLayer:
              feature.geometry.type === "LineString"
                ? "drawnByUserLine"
                : "drawnByUser",
          },
        };
      })
      .reverse() // Reverse the order so the new get removed first
      .filter(
        // Filter anything that already exists in the collection by its coordinates
        drawnFeature =>
          // For every new drawn feature, check against every feature in featureCollection
          featureCollection.features
            // First remove any features that are not of the current type
            .filter(fcFeatures => featureTypesEqual(fcFeatures, drawnFeature))
            // Then check every element left
            .every(
              currentFeatureInCollection =>
                // Verify they are the same type and that they are not equal!
                featureTypesEqual(drawnFeature, currentFeatureInCollection) &&
                (!pointEqual(drawnFeature, currentFeatureInCollection) ||
                  !lineStringEqual(drawnFeature, currentFeatureInCollection))
            ) // If so, return false meaning the filter will exclude them
      ); // If the feature is excluded, then it's technically deleted since it's not part of the new state

    // Add a UUID and layer name to the new features for retrieval and styling

    /**
     * Generate a new state including the existing data and any
     * new features with source and id.
     */

    const updatedFeatureCollection = {
      ...featureCollection,
      features: [
        ...featureCollection.features,
        ...drawnFeaturesWithSourceAndId,
      ],
    };

    // Update the new state
    setFeatureCollection(updatedFeatureCollection);

    // Dispatch featuresSaved action
    if (saveActionDispatch && runActionDispatch)
      saveActionDispatch({ type: "featuresSaved" });
  };

  /**
   * Takes the click event and sets the draw mode handler and selected mode ID
   * @param {Object} e - A click event from a draw toolbar button
   */
  const switchMode = e => {
    const switchModeId = e.target.id === modeId ? null : e.target.id;
    const mode = MODES.find(m => m.id === switchModeId);
    const currentModeHandler = mode && mode.handler ? new mode.handler() : null;

    // If the button clicked is disableDrawMode, disable drawing...
    if (mode?.id === "disableDrawMode") setIsDrawing(false);
    // Else, enable it!
    else setIsDrawing(true);

    setModeId(switchModeId);
    setModeHandler(currentModeHandler);
  };

  /**
   * Deletes whatever object is selected
   * https://github.com/uber/nebula.gl/tree/master/modules/react-map-gl-draw#options
   * @param {object} selected - Holds data about the selected feature
   */
  const onSelect = selected => {
    // Retrieve a list of all features in the map
    const currentFeatures = mapEditorRef.current.getFeatures();
    // Remove the feature from the draw UI feature list
    if (selected.selectedEditHandleIndexes.length) {
      try {
        mapEditorRef.current.deleteHandles(
          selected.selectedFeatureIndex,
          selected.selectedEditHandleIndexes
        );
      } catch (error) {
        console.log(error.message);
      }
      return;
    }

    if (
      selected.selectedFeatureIndex === null ||
      selected.selectedFeatureIndex === undefined
    ) {
      return;
    }

    // Then, remove the feature from the feature collection of the project extent
    const featureToDelete = currentFeatures[selected.selectedFeatureIndex];
    const featureIdGetPath = "properties.PROJECT_EXTENT_ID";
    const featureIdToDelete = get(featureToDelete, featureIdGetPath);

    /**
     * There are duplicates, we need to delete all occurrences of a point.
     * It's not ideal but the code works. Hopefully in the future we can optimize.
     */
    const featuresToDelete = currentFeatures
      // From the currentFeatures, find any duplicates by their coordinates and return the index
      .map((feature, index) =>
        pointEqual(feature, featureToDelete) ? index : -1
      )
      // Keep positive integers only
      .filter(i => i >= 0);

    // Delete the selected feature from the map (including duplicates)...
    mapEditorRef.current.deleteFeatures(featuresToDelete);

    // Regenerate a new feature collection without the selected feature
    const updatedFeatureCollection = {
      ...featureCollection,
      features: [
        ...featureCollection.features
          .filter(
            // Keep the features that are not equal to featureIdToDelete
            feature => get(feature, featureIdGetPath) !== featureIdToDelete
          )
          .filter(
            // Keep the features (points or lines) that are not duplicates
            featureInCollection =>
              (isFeatureOfType("Point", featureInCollection) &&
                !pointEqual(featureToDelete, featureInCollection)) ||
              (isFeatureOfType("LineString", featureInCollection) &&
                !lineStringEqual(featureToDelete, featureInCollection))
          ),
      ],
    };

    // Update our state
    setFeatureCollection(updatedFeatureCollection);
  };

  /**
   * This function gets called on any update coming from the map.
   * https://nebula.gl/docs/api-reference/react-map-gl-draw/react-map-gl-draw
   * @param {String} editType - The name of the event type
   */
  const onUpdate = ({ editType }) => {
    // If the current event is a new feature (point or line)
    if (editType === "addFeature") {
      // Save without running dispatch
      saveDrawnPoints(false); // False = no dispatch
    }
  };

  /**
   * Renders the toolbar and buttons that control the map draw UI
   * @return {JSX.Element} The toolbar for the map draw UI
   */
  const renderDrawToolbar = containerRef => {
    return (
      <MapDrawToolbar
        containerRef={containerRef}
        selectedModeId={modeId}
        onSwitchMode={switchMode}
      />
    );
  };

  /**
   * Renders the map editor and its toolbar
   * @return {JSX.Element} The whole map draw UI
   */
  const renderMapDrawTools = containerRef => (
    <>
      <Editor
        ref={ref => {
          initializeExistingDrawFeatures(ref);
          mapEditorRef.current = ref;
        }}
        featureStyle={featureStyleObj =>
          getFeatureStyle({ ...featureStyleObj, currentZoom })
        }
        onSelect={onSelect}
        onUpdate={onUpdate}
        clickRadius={12}
        mode={modeHandler}
      />
      {renderDrawToolbar(containerRef)}
    </>
  );

  return {
    isDrawing,
    setIsDrawing,
    renderMapDrawTools,
    saveDrawnPoints,
  };
}
