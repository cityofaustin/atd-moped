import { useMemo } from "react";
import { featureTableFieldMap } from "./makeFeatures";

/**
 * Create an object map of component feature collections by component id
 * Ex. { 1: { type: "FeatureCollection", features: [...] } }
 * @param {Array} components - components returned by GET_PROJECT_COMPONENTS query
 * @returns {Object} - map of component feature collections by component id
 */
export const makeComponentFeatureCollectionsMap = (components) => {
  const componentGeographyMap = {};

  components.forEach((component) => {
    const currentComponentId = component.component_id;

    const currentFeature = {
      type: "Feature",
      properties: { ...component.attributes },
      geometry: component.geometry,
    };

    if (!componentGeographyMap[currentComponentId]) {
      componentGeographyMap[currentComponentId] = {
        type: "FeatureCollection",
        features: [currentFeature],
      };
    } else {
      componentGeographyMap[currentComponentId] = {
        type: "FeatureCollection",
        features: [
          ...componentGeographyMap[currentComponentId].features,
          currentFeature,
        ],
      };
    }
  });

  return componentGeographyMap;
};

// returns geojson of features across all components
export const useProjectFeatures = (components) =>
  useMemo(() => {
    if (components === null || components.length === 0)
      return {
        type: "FeatureCollection",
        features: [],
      };

    const allComponentfeatures = [];

    components.forEach((component) => {
      Object.keys(featureTableFieldMap).forEach((key) => {
        if (component.hasOwnProperty(key))
          allComponentfeatures.push(component[key]);
      });
    });

    // Make features valid GeoJSON by adding type and properties attributes
    const geoJsonFeatures = allComponentfeatures.flat().map((component) => ({
      ...component,
      type: "Feature",
      properties: {},
    }));

    return {
      type: "FeatureCollection",
      features: geoJsonFeatures,
    };
  }, [components]);

export const useDraftComponentFeatures = (draftComponent) =>
  useMemo(() => {
    return {
      type: "FeatureCollection",
      features: draftComponent?.features || [],
    };
  }, [draftComponent]);
