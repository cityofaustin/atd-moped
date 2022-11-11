import { useMemo } from "react";
import { MAP_STYLES } from "./mapStyleSettings";

const mapStyles = MAP_STYLES;

export const useComponentFeatureCollection = (component) =>
  useMemo(() => {
    if (!component || !component?.features) return null;
    return { type: "FeatureCollection", features: component.features };
  }, [component]);

/**
 * Iterate through the mapStyles config to create an array of interactive layers
 */
export const interactiveLayerIds = Object.entries(mapStyles).reduce(
  (acc, [key, value]) => {
    if (value.isInteractive) {
      acc.push(key);
    }

    return acc;
  },
  []
);
