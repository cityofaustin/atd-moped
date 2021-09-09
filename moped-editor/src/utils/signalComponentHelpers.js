import { v4 as uuidv4 } from "uuid";

/**
 * Immitate a "drawn point" feature from a traffic signal goejosn feature. Sets required
 * fields so that featureCollection can be used in the DB mutation on submit
 * @param {Object} signal - A GeoJSON feature or a falsey object (e.g. "" from empty input)
 * @return {Object} A geojson feature collection with the signal feature or 0 features
 */
 export const signalToFeatureCollection = signal => {
  let featureCollection = {
    type: "FeatureCollection",
    features: [],
  };
  if (signal) {
    /* 
    / preserves the feature's previous UUID if it's being edited. we are **not** preserving
    / any other feature properties when the feature is edited. so, for example, if the user
    / edits a signal component and the signal geometry in socrata has since changed, the new
    / geometry will be saved.
    */
    const featureUUID = signal.id || uuidv4();
    const feature = {
      type: "Feature",
      properties: {
        ...signal.properties,
        renderType: "Point",
        PROJECT_EXTENT_ID: featureUUID,
        sourceLayer: "drawnByUser",
      },
      geometry: signal.geometry,
      id: featureUUID,
    };
    featureCollection.features.push(feature);
  }
  return featureCollection;
};
