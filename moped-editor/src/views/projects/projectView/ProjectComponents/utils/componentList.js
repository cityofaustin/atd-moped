import { useMemo } from "react";

export const isSignalComponent = (component) =>
  component?.moped_components?.feature_layer?.internal_table ===
  "feature_signals";

/**
 * Format the list item's primary and secondary text
 * @param {object} component - the moped_component object
 * @returns {object} the component props for <ListItemText> as { primary, secondary }
 */
export const useComponentListItemText = (component) =>
  useMemo(() => {
    const listItemText = { primary: "", secondary: "-" };
    const componentName = component?.moped_components?.component_name;
    const componentSubtype = component?.moped_components?.component_subtype;
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
export const useIsComponentMapped = (component) =>
  useMemo(
    () =>
      component.feature_drawn_points?.length > 0 ||
      component.feature_drawn_lines?.length > 0 ||
      component.feature_intersections?.length > 0 ||
      component.feature_signals?.length > 0 ||
      component.feature_street_segments?.length > 0,
    [component]
  );
