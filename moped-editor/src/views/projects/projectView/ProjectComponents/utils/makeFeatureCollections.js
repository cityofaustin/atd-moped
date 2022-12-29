import { useMemo } from "react";
import { featureTableFieldMap } from "./makeFeatures";

/**
 * Take a project_geography record and return a valid GeoJSON feature
 * TODO: We should look into returning GeoJSON features directly from the DB
 * @param {Object} record - project_geography record from GET_PROJECT_COMPONENTS query
 * @returns {Object} - GeoJSON feature
 */
export const makeFeatureFromProjectGeographyRecord = (record) => ({
  type: "Feature",
  properties: { ...record.attributes },
  geometry: record.geometry,
});

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
      const currentFeature = makeFeatureFromProjectGeographyRecord(component);

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

/**
 * Component features are returned as arrays for each feature type table.
 * We can use the featureTableFieldMap to unpack the component object.
 * @param {Object} component - component object from GET_PROJECT_COMPONENTS query
 * @returns {Array} - array of all component features
 */
export const getAllComponentFeatures = (component) => {
  const allComponentFeatures = [];

  Object.keys(featureTableFieldMap).forEach((key) => {
    if (component.hasOwnProperty(key))
      allComponentFeatures.push(component[key]);
  });

  // Flatten array of arrays containing features from each feature table
  return allComponentFeatures.flat();
};

/**
 * Take a component object and return a GeoJSON FeatureCollection of all component features
 * @param {Object} component - component object from GET_PROJECT_COMPONENTS query
 * @returns {Object} - GeoJSON FeatureCollection of all component features
 */
export const useComponentFeatureCollection = (component) =>
  useMemo(() => {
    if (component === null)
      return {
        type: "FeatureCollection",
        features: [],
      };

    const allComponentFeatures = getAllComponentFeatures(component);

    // Make features valid GeoJSON by adding type and properties attributes
    const geoJsonFeatures = allComponentFeatures.map((component) => ({
      ...component,
      type: "Feature",
      properties: {},
    }));

    return {
      type: "FeatureCollection",
      features: geoJsonFeatures,
    };
  }, [component]);

/**
 * Take all project components and return a GeoJSON FeatureCollection of all components features
 * @param {Array} components - all components returned by GET_PROJECT_COMPONENTS query
 * @returns {Object} - GeoJSON FeatureCollection of all components features
 */
export const useAllComponentsFeatureCollection = (components) =>
  useMemo(() => {
    if (components === null || components.length === 0)
      return {
        type: "FeatureCollection",
        features: [],
      };

    const allComponentsFeatures = [];

    components.forEach((component) => {
      const allComponentFeatures = getAllComponentFeatures(component);
      allComponentsFeatures.push(allComponentFeatures);
    });

    // Make features valid GeoJSON by adding type and properties attributes
    const geoJsonFeatures = allComponentsFeatures.flat().map((component) => ({
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
