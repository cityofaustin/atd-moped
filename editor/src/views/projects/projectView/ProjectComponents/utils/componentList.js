import { useMemo } from "react";

export const isSignalComponent = (component) =>
  component.feature_signals?.length > 0;

/**
 * Format the list item's primary and secondary text
 * @param {object} component - the moped_component object
 * @returns {object} the component props for <ListItemText> as { primary, secondary }
 */
export const useComponentListItemText = (component) =>
  useMemo(() => {
    const listItemText = { primary: "", secondary: "-" };
    // New components that are being created don't have a moped_components property
    const componentName = component?.moped_components
      ? component?.moped_components?.component_name
      : component?.component_name;
    const componentSubtype = component?.moped_components
      ? component?.moped_components?.component_subtype
      : component?.component_subtype;
    listItemText.primary = componentSubtype
      ? `${componentName} - ${componentSubtype}`
      : componentName;
    listItemText.secondary = component.location_description;
    return listItemText;
  }, [component]);

/**
 * Identify if a component is map by checking all potential feature layers
 * for features.
 * @param {object} component - the moped_component object
 * @returns {object} true if any layer has features else false
 */
export const getIsComponentMapped = (component) =>
  component.feature_drawn_points?.length > 0 ||
  component.feature_drawn_lines?.length > 0 ||
  component.feature_intersections?.length > 0 ||
  component.feature_signals?.length > 0 ||
  component.feature_street_segments?.length > 0 ||
  component.feature_school_beacons?.length > 0;
