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
    const componentName = component?.moped_components?.component_name;
    const componentSubtype = component?.moped_components?.component_subtype;
    listItemText.primary = componentSubtype
      ? `${componentName} - ${componentSubtype}`
      : componentName;
    listItemText.secondary = component.location_description;
    return listItemText;
  }, [component]);
