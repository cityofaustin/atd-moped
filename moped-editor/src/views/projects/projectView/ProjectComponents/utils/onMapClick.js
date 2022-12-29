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
  // remove project feature, ignore underlying CTN features
  const filteredFeatures = draftComponent.features.filter((compFeature) => {
    return !(
      compFeature.properties.id ===
        clickedDraftComponentFeature.properties.id &&
      compFeature.properties._layerId ===
        clickedDraftComponentFeature.properties._layerId
    );
  });

  return { ...draftComponent, features: filteredFeatures };
};
