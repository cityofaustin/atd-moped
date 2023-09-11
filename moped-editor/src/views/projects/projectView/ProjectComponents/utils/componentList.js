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
    if (isSignalComponent(component)) {
      const signalLocationName = component?.feature_signals?.[0]?.location_name;
      const signalId = component?.feature_signals?.[0]?.signal_id;
      listItemText.secondary = `${signalId}: ${signalLocationName}`;
    } else {
      listItemText.secondary = component.description
    }
    return listItemText;
  }, [component]);
