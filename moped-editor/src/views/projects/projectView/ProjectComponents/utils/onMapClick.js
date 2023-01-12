import { SOURCES } from "../mapSettings";

export const getClickedFeatureFromMap = (e) =>
  e.features.find((feature) => feature.layer.id.includes("project"));

/**
 * Filter out a previously added feature from the draft component
 * @param {Object} draftComponent - the draft component with .features
 * @param {Object} clickedDraftComponentFeature - the feature that was clicked on the map
 * that should be removed from the draft component
 * @returns {Object} the draft component with the clicked feature removed
 */
export const removeFeatureFromDraftComponent = (
  draftComponent,
  clickedDraftComponentFeature
) => {
  const { internal_table } = draftComponent;
  const ctnUniqueIdentifier = Object.values(SOURCES).find(
    (source) => source.table === internal_table
  )._featureIdProp;

  // Filter out feature by its unique identifier
  const filteredFeatures = draftComponent.features.filter((compFeature) => {
    return (
      compFeature.properties[ctnUniqueIdentifier] !==
      clickedDraftComponentFeature.properties[ctnUniqueIdentifier]
    );
  });

  return { ...draftComponent, features: filteredFeatures };
};
