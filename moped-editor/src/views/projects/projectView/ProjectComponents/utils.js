import { useMemo } from "react";
import { makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import booleanIntersects from "@turf/boolean-intersects";
import circle from "@turf/circle";
import { v4 as uuidv4 } from "uuid";
import { Icon } from "@material-ui/core";
import {
  RoomOutlined as RoomOutlinedIcon,
  Timeline as TimelineIcon,
} from "@material-ui/icons";

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

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

/**
 * Renders an option with icon based on the type of geometry (if it exists) and component type label
 * @param {Object} option - Autocomplete option object with label, value, and data about component type
 * @return {JSX.Element}
 */
export const ComponentOptionWithIcon = ({ option }) => {
  const classes = useStyles();
  const { data: { line_representation = null } = {} } = option;

  return (
    <>
      <span className={classes.iconContainer}>
        {line_representation === true && <TimelineIcon />}
        {line_representation === false && <RoomOutlinedIcon />}
        {/* Fall back to a blank icon to keep labels lined up */}
        {line_representation === null && <Icon />}
      </span>{" "}
      {option.label}
    </>
  );
};

/*
 * Components need a unique id generated on creation to avoid collisions
 */
export const makeRandomComponentId = () => uuidv4();

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

  return currentToolbarMinHeight.minHeight;
}

/**
 * Not all component type records have a value in the subtype column but let's concatenate them if they do
 * @param {string} component_name The name of the component
 * @param {string} component_subtype The name value in the component_subtype column of the component record
 * @returns {string}
 */
export const makeComponentLabel = ({ component_name, component_subtype }) => {
  return component_subtype
    ? `${component_name} - ${component_subtype}`
    : `${component_name}`;
};

/**
 * Take the moped_components records data response and create options for a MUI autocomplete
 * @param {Object} data Data returned with moped_components records
 * @returns {Array} The options with value, label, and full data object to produce the subcomponents options
 */
export const useComponentOptions = (data) =>
  useMemo(() => {
    if (!data) return [];

    const options = data.moped_components.map((comp) => ({
      value: comp.component_id,
      label: makeComponentLabel(comp),
      data: comp,
    }));

    return options;
  }, [data]);

/**
 * Take the data nested in the chosen moped_components option and produce a list of subcomponents options (if there are some)
 * for a MUI autocomplete
 * @param {Object} component Data stored in the currently selected component record
 * @returns {Array} The options with value and label
 */
export const useSubcomponentOptions = (component) =>
  useMemo(() => {
    const subcomponents = component?.data?.moped_subcomponents;
    if (!subcomponents) return [];

    const options = subcomponents.map((subComp) => ({
      value: subComp.subcomponent_id,
      label: subComp.subcomponent_name,
    }));

    return options;
  }, [component]);
