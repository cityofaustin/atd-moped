import { useMemo } from "react";
import { useMediaQuery, useTheme } from "@material-ui/core";
import booleanIntersects from "@turf/boolean-intersects";
import circle from "@turf/circle";

/* Filters a feature collection down to one type of geometry */
export const useFeatureTypes = (featureCollection, geomType) =>
  useMemo(() => {
    const features = featureCollection.features.filter((feature) => {
      const thisGeom = feature.geometry.type.toLowerCase();
      return thisGeom.includes(geomType);
    });
    return { type: "FeatureCollection", features };
  }, [featureCollection, geomType]);

/*
Bit of a hack to generate intersection labels from nearby streets. 
this relies on nearby lines being avaialble in-memory, which 
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

/* This form stuff was obvi quick and dirty, prob best to use
RFH or whatever we already have in prod */
export const COMPONENT_FORM_FIELDS = [
  {
    key: "type",
    label: "Component Type",
    type: "autocomplete",
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
  },
];

export const initialComponentFormState = COMPONENT_FORM_FIELDS.reduce(
  (prev, curr) => {
    prev[curr.key] = "";
    return prev;
  },
  {}
);

export function componentFormStateReducer(state, { key, value, action }) {
  if (action === "update") {
    return { ...state, [key]: value };
  } else {
    return initialComponentFormState;
  }
}

// See https://github.com/mui/material-ui/issues/10739#issuecomment-1001530270
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
  return currentToolbarMinHeight.minHeight;
}
