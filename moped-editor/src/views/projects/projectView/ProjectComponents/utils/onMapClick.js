export const getClickedFeatureFromMap = (e) =>
  e.features.find((feature) => feature.layer.id.includes("project"));
