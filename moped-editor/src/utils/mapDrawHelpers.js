import React, { useState, useRef } from "react";
import ComponentsDrawControl from "src/components/Maps/ComponentsDrawControl";
import { get } from "lodash";
import { drawnLayerNames } from "../utils/mapHelpers";

/**
 * Retrieve a list of features that were drawn using the UI exposed from useMapDrawTools
 * @param {object} featureCollection - GeoJSON feature collection containing project extent
 * @return {array} List of features that originated from the draw UI
 */
const getDrawnFeaturesFromFeatureCollection = (featureCollection) =>
  featureCollection.features.filter((feature) =>
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
    (arrayOneFeature) =>
      !arrayTwo.some(
        (arrayTwoFeature) =>
          arrayOneFeature.properties[featureProperty] ===
          arrayTwoFeature.properties[featureProperty]
      )
  );

/**
 * Custom hook that builds draw tools and is used to enable or disable them
 * @param {object} featureCollection - GeoJSON feature collection to store drawn points within
 * @param {function} setFeatureCollection - Setter for GeoJSON feature collection state
 * @param {boolean} drawLines - Should map draw tools create line strings
 * @return {UseMapDrawToolsObject} Object that exposes a function to render draw tools and setter/getter for isDrawing state
 */
/**
 * @typedef {object} UseLayerObject
 * @property {boolean} isDrawing - Are draw tools enabled or disabled
 * @property {function} setIsDrawing - Toggle draw tools
 * @property {function} renderMapDrawTools - Function that returns JSX for the draw tools in the map
 */
export function useMapDrawTools(
  featureCollection,
  setFeatureCollection,
  drawLines
) {
  const drawControlsRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);

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
   * Returns true if featurePointA has the same coordinates as featurePointB
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

  const initializeExistingDrawFeatures = () => {
    // Only add features that are not already present in the draw UI to avoid duplicates
    const drawnFeatures =
      getDrawnFeaturesFromFeatureCollection(featureCollection);

    // Collect all the features that the draw UI is tracking
    const featureCollectionAlreadyInDrawMap = drawControlsRef.current.getAll();
    const featuresAlreadyInDrawMap = featureCollectionAlreadyInDrawMap.features;

    // Retrieve only the features that are present in state, but not the map
    const featuresToAdd = findDifferenceByFeatureProperty(
      "PROJECT_EXTENT_ID",
      drawnFeatures,
      featuresAlreadyInDrawMap
    );

    // Draw the features
    featuresToAdd.forEach((feature) => drawControlsRef.current.add(feature));
  };

  /**
   * Updates state and mutates additions and deletions of points drawn with the UI
   */
  const saveDrawnPoints = (features) => {
    const drawnFeatures = features;

    const makeDrawnFeaturesWithMetadata = (
      previousFeatureCollection,
      features
    ) =>
      features
        .map((feature) => {
          return {
            ...feature,
            properties: {
              ...feature.properties,
              renderType: feature.geometry.type,
              PROJECT_EXTENT_ID: feature.id,
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
          (drawnFeature) =>
            // For every new drawn feature, check against every feature in featureCollection
            previousFeatureCollection.features
              // First remove any features that are not of the current type
              .filter((fcFeatures) =>
                featureTypesEqual(fcFeatures, drawnFeature)
              )
              // Then check every element left
              .every(
                (currentFeatureInCollection) =>
                  // Verify they are the same type and that they are not equal!
                  featureTypesEqual(drawnFeature, currentFeatureInCollection) &&
                  (!pointEqual(drawnFeature, currentFeatureInCollection) ||
                    !lineStringEqual(drawnFeature, currentFeatureInCollection))
              ) // If so, return false meaning the filter will exclude them
        ); // If the feature is excluded, then it's technically deleted since it's not part of the new state

    // Update our state with callback to keep draw tool additions in sync with other state updates
    setFeatureCollection((prevFeatureCollection) => {
      // 1. New drawn features (onCreate)
      const newDrawnFeatures = drawnFeatures.filter((feature) => {
        const doesFeatureHaveDrawnSourceLayer = drawnLayerNames.includes(
          feature?.properties?.sourceLayer
        );
        const hasFeatureAlreadyBeenAddedToFeatureCollection =
          prevFeatureCollection.features.find(
            (addedFeature) => feature.id === addedFeature.id
          )
            ? true
            : false;

        return (
          !doesFeatureHaveDrawnSourceLayer &&
          !hasFeatureAlreadyBeenAddedToFeatureCollection
        );
      });

      // 2. New drawn feature that were dragged (onUpdate)
      const newDrawnFeaturesThatHaveBeenDragged = drawnFeatures.filter(
        (feature) => {
          const doesFeatureHaveDrawnSourceLayer = drawnLayerNames.includes(
            feature?.properties?.sourceLayer
          );
          const hasFeatureAlreadyBeenAddedToFeatureCollection =
            prevFeatureCollection.features.find(
              (addedFeature) => feature.id === addedFeature.id
            )
              ? true
              : false;

          return (
            !doesFeatureHaveDrawnSourceLayer &&
            hasFeatureAlreadyBeenAddedToFeatureCollection
          );
        }
      );

      // 3. Existing drawn feature that were dragged and already have needed metadata (onUpdate)
      const existingDrawnFeaturesThatHaveBeenDragged = drawnFeatures.filter(
        (feature) => {
          const doesFeatureHaveDrawnSourceLayer = drawnLayerNames.includes(
            feature?.properties?.sourceLayer
          );
          const hasFeatureAlreadyBeenAddedToFeatureCollection =
            prevFeatureCollection.features.find(
              (addedFeature) => feature.id === addedFeature.id
            )
              ? true
              : false;

          return (
            doesFeatureHaveDrawnSourceLayer &&
            hasFeatureAlreadyBeenAddedToFeatureCollection
          );
        }
      );

      // 4. Collect all features that don't fit into #1, #2, or #3 so we retain previously drawn features
      const allTheOtherFeatures = prevFeatureCollection.features.filter(
        (feature) => {
          const doesFeatureHaveDrawnSourceLayer = drawnLayerNames.includes(
            feature?.properties?.sourceLayer
          );
          const isNewFeature = newDrawnFeatures.find(
            (drawnFeature) => feature.id === drawnFeature.id
          );
          const isNewFeatureThanHasBeenDragged =
            newDrawnFeaturesThatHaveBeenDragged.find(
              (drawnFeature) => feature.id === drawnFeature.id
            );
          const wasFeatureDragged =
            existingDrawnFeaturesThatHaveBeenDragged.find(
              (drawnFeature) => feature.id === drawnFeature.id
            );

          return (
            doesFeatureHaveDrawnSourceLayer &&
            !wasFeatureDragged &&
            !isNewFeatureThanHasBeenDragged &&
            !isNewFeature
          );
        }
      );

      // Feed newly drawn or newly drawn and dragged before saving features to the function
      // that gives them needed metadata
      const drawnFeaturesWithSourceAndId = makeDrawnFeaturesWithMetadata(
        prevFeatureCollection,
        [...newDrawnFeatures, ...newDrawnFeaturesThatHaveBeenDragged]
      );

      /**
       * Generate a new state including the existing data and any
       * new features with source and id.
       */
      const updatedFeatureCollection = {
        ...prevFeatureCollection,
        features: [
          ...drawnFeaturesWithSourceAndId,
          ...existingDrawnFeaturesThatHaveBeenDragged,
          ...allTheOtherFeatures,
        ],
      };

      return updatedFeatureCollection;
    });
  };

  /**
   * Callback fired after a single feature is deleted
   * @param {object} e - Event
   */
  const onDelete = (e) => {
    // Remove the feature from the feature collection of the project extent
    const featureToDelete = e.features[0];
    const featureIdGetPath = "properties.PROJECT_EXTENT_ID";
    const featureIdToDelete = get(featureToDelete, featureIdGetPath);

    // Regenerate a new feature collection without the selected feature
    const updateFeatureCollection = (previousFeatureCollection) => ({
      ...previousFeatureCollection,
      features: [
        ...previousFeatureCollection.features
          .filter(
            // Keep the features that are not equal to featureIdToDelete
            (feature) =>
              !featureIdToDelete ||
              get(feature, featureIdGetPath) !== featureIdToDelete
          )
          .filter(
            // Keep the features (points or lines) that are not duplicates
            (featureInCollection) =>
              (isFeatureOfType("Point", featureInCollection) &&
                !pointEqual(featureToDelete, featureInCollection)) ||
              (isFeatureOfType("LineString", featureInCollection) &&
                !lineStringEqual(featureToDelete, featureInCollection))
          ),
      ],
    });

    // Update our state with callback to keep draw tool deletions in sync with other state updates
    setFeatureCollection((prevCollection) =>
      updateFeatureCollection(prevCollection)
    );
  };

  /**
   * This function gets called after creating a drawn feature
   */
  const onCreate = (e) => {
    const { features } = e;

    saveDrawnPoints(features);
  };

  const onModeChange = (e) => {
    // If we are not drawing, set isDrawing to false so we can select layer features as components
    const { mode } = e;

    if (mode === "draw_point" || mode === "draw_line_string") {
      setIsDrawing(true);
    } else {
      setIsDrawing(false);
    }
  };

  const onUpdate = (e) => {
    const wasFeatureMoved = e.action === "move";

    // if the feature was dragged, we need to update its location
    if (wasFeatureMoved) {
      saveDrawnPoints(e.features);
    }
  };

  /*
   * direct_select allows more complex interactions like breaking line strings into midpoints
   * but we only want users to select and deselect with simple_select mode so we override on load
   * @see https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#simple_select
   *  @see https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/API.md#direct_select
   **/
  const overrideDirectSelect = () => {
    drawControlsRef.current.modes.DIRECT_SELECT = "simple_select";
  };

  /**
   * Renders the map editor and its toolbar
   * @return {JSX.Element} The whole map draw UI
   */
  const renderMapDrawTools = () => (
    <ComponentsDrawControl
      ref={drawControlsRef}
      onCreate={onCreate}
      onDelete={onDelete}
      onUpdate={onUpdate}
      drawLines={drawLines}
      onModeChange={onModeChange}
      initializeExistingDrawFeatures={initializeExistingDrawFeatures}
      overrideDirectSelect={overrideDirectSelect}
    />
  );

  return {
    isDrawing,
    renderMapDrawTools,
  };
}
