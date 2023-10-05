import { useMemo, useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import booleanIntersects from "@turf/boolean-intersects";
import circle from "@turf/circle";
import { MAP_STYLES } from "../mapStyleSettings";
import { fitBoundsOptions } from "../mapSettings";
import bbox from "@turf/bbox";

/**
 * Iterate through the map styles config to create an array of interactive layers
 */
export const interactiveLayerIds = Object.entries(MAP_STYLES).reduce(
  (acc, [key, value]) => {
    if (value.isInteractive) {
      acc.push(key);
    }

    return acc;
  },
  []
);

/* Filters a feature collection down to one type of geometry */
export const useFeatureTypes = (featureCollection, geomType) =>
  useMemo(() => {
    if (!featureCollection)
      return {
        type: "FeatureCollection",
        features: [],
      };

    const features = featureCollection.features.filter((feature) => {
      const thisGeom = feature.geometry.type.toLowerCase();
      return thisGeom.includes(geomType);
    });

    return { type: "FeatureCollection", features: features };
  }, [featureCollection, geomType]);

/*
Bit of a hack to generate intersection labels from nearby streets. 
this relies on nearby lines being available in-memory, which 
is not guaranteed. a reliable solution would be query the AGOL streets
layer on-the-fly to grab street names - not sure if this is worth it TBH 
*/
export const getIntersectionLabel = (point, lines) => {
  var radius = 10;
  var options = {
    steps: 10,
    units: "meters",
  };
  var circ = circle(point.geometry.coordinates, radius, options);
  const streets = lines.features
    .filter((lineFeature) =>
      booleanIntersects(lineFeature.geometry, circ.geometry)
    )
    .map((street) => street.properties.FULL_STREET_NAME);
  const uniqueStreets = [...new Set(streets)].sort();
  return uniqueStreets.join(" / ");
};

/**
 * Use MUI-exposed breakpoints and toolbar height to size content below the toolbar
 * @returns {number} Current pixel height of the toolbar
 * @see https://github.com/mui/material-ui/issues/10739#issuecomment-1001530270
 */
export function useAppBarHeight() {
  const {
    mixins: { toolbar },
    breakpoints,
  } = useTheme();
  const toolbarDesktopQuery = breakpoints.up("sm");
  const toolbarLandscapeQuery = `${breakpoints.up(
    "xs"
  )} and (orientation: landscape)`;
  const isDesktop = useMediaQuery(toolbarDesktopQuery);
  const isLandscape = useMediaQuery(toolbarLandscapeQuery);
  let currentToolbarMinHeight;
  if (isDesktop) {
    currentToolbarMinHeight = toolbar[toolbarDesktopQuery];
  } else if (isLandscape) {
    currentToolbarMinHeight = toolbar[toolbarLandscapeQuery];
  } else {
    currentToolbarMinHeight = toolbar;
  }

  return currentToolbarMinHeight?.minHeight;
}

/**
 * Zoom to a feature collection using Mapbox fitBounds on a map instance
 * @param {Object} mapRef - React ref that stores the Mapbox map instance (mapRef.current)
 * @param {Object} featureCollection - GeoJSON feature collection
 * @param {Object} fitBoundsOptions - Mapbox fitBounds options
 */
export const zoomMapToFeatureCollection = (
  mapRef,
  featureCollection,
  fitBoundsOptions
) => {
  if (!mapRef?.current) return;

  const bboxOfFeatureCollection = bbox(featureCollection);

  /**
   * There is a known issue with fitBounds throwing an error with padding on smaller screens
   * So, we try to fitBounds with padding, and if that fails, we try again without padding
   * @see https://stackoverflow.com/a/76011418
   * */
  try {
    return mapRef.current.fitBounds(bboxOfFeatureCollection, fitBoundsOptions);
  } catch {
    console.log("fitBounds failed, trying again without padding", {
      fitBoundsOptions,
      screenWidth: window.innerWidth,
    });
  }

  try {
    mapRef.current.fitBounds(bboxOfFeatureCollection);
  } catch {
    console.log("Unable to fitBounds to feature collection", featureCollection);
  }
};

/**
 * Use Mapbox fitBounds to zoom to existing project components feature collection
 * @param {Object} mapRef - React ref that stores the Mapbox map instance (mapRef.current)
 * @param {Object} featureCollection - feature collection of project components
 * @param {boolean} refreshOnComponentsUpdate - if true, zoom to components on every update
 */
export const useZoomToExistingComponents = (
  mapRef,
  featureCollection,
  refreshOnComponentsUpdate = false
) => {
  const [hasMapZoomedInitially, setHasMapZoomedInitially] = useState(false);

  useEffect(() => {
    if (!(featureCollection.features.length > 0) || hasMapZoomedInitially)
      return;
    if (!mapRef?.current) return;

    zoomMapToFeatureCollection(
      mapRef,
      featureCollection,
      fitBoundsOptions.zoomToExtent
    );

    !refreshOnComponentsUpdate && setHasMapZoomedInitially(true);
  }, [
    featureCollection,
    hasMapZoomedInitially,
    mapRef,
    refreshOnComponentsUpdate,
  ]);
};

/**
 * Adds or removes custom css class based on if drawn features are selected
 * returns function to update trashbutton state
 */
export const useTrashButtonClickable = () =>
{
  const [isTrashButtonClickable, toggleTrashButtonClickable] = useState(false);
  useEffect(() => {
    if (isTrashButtonClickable) {
      document
        .getElementsByClassName("mapbox-gl-draw_trash")[0]
        .classList.remove("disable-trash");
    } else {
      document
        .getElementsByClassName("mapbox-gl-draw_trash")[0]
        .classList.add("disable-trash");
    }
  }, [isTrashButtonClickable]);
  return toggleTrashButtonClickable;
}
