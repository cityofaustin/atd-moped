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

export const makeFeatureIdToComponentIdMap = (components) => {
  const featureIdToComponentIdMap = {};

  //

  return featureIdToComponentIdMap;
};
