import { useMemo } from "react";
import { featureTableFieldMap } from "./makeFeatures";
import { cloneDeep } from "@apollo/client/utilities";
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
 * Component features are returned as arrays for each feature type table.
 * We can use the featureTableFieldMap to unpack the component object. and
 * construct a valid geojson feature
 * @param {Object} component - component object from GET_PROJECT_COMPONENTS query
 * @returns {Array} - array of all component features
 */
export const getAllComponentFeatures = (component) => {
  const allComponentFeatures = [];

  Object.keys(featureTableFieldMap).forEach((featureTableName) => {
    if (component.hasOwnProperty(featureTableName)) {
      const feature = cloneDeep(component[featureTableName]);
      allComponentFeatures.push(feature);
    }
  });
  // Flatten array of arrays containing features from each feature table
  const allComponentFeaturesFlat = allComponentFeatures.flat();
  // Make features valid GeoJSON by adding type and properties attributes
  return allComponentFeaturesFlat.map((feature) => {
    feature.properties ??= {};
    // we need this property to tie individual map features back to their parent component
    feature.properties.project_component_id = component.project_component_id;
    feature.type = "Feature";
    return feature;
  });
};

/**
 * Take a component object and return a GeoJSON FeatureCollection of all component features
 * @param {Object} component - component object from GET_PROJECT_COMPONENTS query
 * @returns {Object} - GeoJSON FeatureCollection of all component features
 */
export const useComponentFeatureCollection = (component) =>
  useMemo(() => {
    if (!component)
      return {
        type: "FeatureCollection",
        features: [],
      };

    const allComponentFeatures = getAllComponentFeatures(component);

    return {
      type: "FeatureCollection",
      features: allComponentFeatures,
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

    const allComponentsFeatures = components.map((component) =>
      getAllComponentFeatures(component)
    );

    const geoJsonFeatures = allComponentsFeatures.flat();

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
