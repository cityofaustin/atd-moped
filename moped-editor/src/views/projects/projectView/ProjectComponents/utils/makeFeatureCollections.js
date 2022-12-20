import { useMemo } from "react";
import { featureTableFieldMap } from "./makeFeatures";

/**
 * Create an object map of component feature collections by component id
 * Ex. { 1: { type: "FeatureCollection", features: [...] } }
 * @param {Object} data - data returned by GET_PROJECT_COMPONENTS query
 * @returns {Object} - map of component feature collections by component id
 */
export const useComponentFeatureCollectionsMap = (data) =>
  useMemo(() => {
    if (!data?.project_geography) return {};

    const componentGeographyMap = {};

    data.project_geography.forEach((component) => {
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
  }, [data]);

export const getAllComponentFeatures = (component) => {
  const allComponentFeatures = [];

  Object.keys(featureTableFieldMap).forEach((key) => {
    if (component.hasOwnProperty(key))
      allComponentFeatures.push(component[key]);
  });

  return allComponentFeatures;
};

export const useComponentFeatureCollection = (component) =>
  useMemo(() => {
    if (component === null)
      return {
        type: "FeatureCollection",
        features: [],
      };

    const allComponentFeatures = getAllComponentFeatures(component);

    Object.keys(featureTableFieldMap).forEach((key) => {
      if (component.hasOwnProperty(key))
        allComponentFeatures.push(component[key]);
    });

    // Make features valid GeoJSON by adding type and properties attributes
    const geoJsonFeatures = allComponentFeatures.flat().map((component) => ({
      ...component,
      type: "Feature",
      properties: {},
    }));

    return {
      type: "FeatureCollection",
      features: geoJsonFeatures,
    };
  }, [component]);

// returns geojson of features across all components
export const useAllComponentsFeatureCollection = (components) =>
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
