import { useEffect } from "react";
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
  if (signal && signal?.properties && signal?.geometry) {
    /* 
    / preserves the feature's previous UUID if it's being edited. we are **not** preserving
    / any other feature properties when the feature is edited. so, for example, if the user
    / edits a signal component and the signal geometry in socrata has since changed, the new
    / geometry will be saved.
    */
    const featureUUID = signal?.id || uuidv4();
    const feature = {
      type: "Feature",
      properties: {
        ...signal?.properties,
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

export const useInitialSignalComponentValue = (
  editFeatureCollection,
  setSignal
) => {
  /*
  / initializes the selected signal value - handles case of editing existing component
  / tests for signal_id prop to ensure we're not handing a non-signal component (which happens
  / e.g. when an existing component's type is changed)
  */
  useEffect(() => {
    if (
      !editFeatureCollection ||
      editFeatureCollection.features.length === 0 ||
      !editFeatureCollection.features[0].properties.signal_id
    ) {
      setSignal(null);
      return;
    } else if (editFeatureCollection.features.length > 1) {
      /*
      / If a non-signal component is edited, all previously-defined feature geometries
      / will be dropped.
      */
      console.warn(
        "Found signal component with multiple feature geometries. All but one feature will be removed."
      );
    }
    setSignal(editFeatureCollection.features[0]);
    // only fire on init
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

/*
/ Hook which updates the component editor state based on the selected signal
*/
export const useSignalChangeEffect = (
  signal,
  setSelectedComponentSubtype,
  setEditFeatureCollection
) => {
  useEffect(() => {
    const signalSubtype = signal
      ? signal.properties.signal_type.toLowerCase()
      : "";
    const featureCollection = signalToFeatureCollection(signal);
    setSelectedComponentSubtype(signalSubtype);
    setEditFeatureCollection(featureCollection);
  }, [signal, setSelectedComponentSubtype, setEditFeatureCollection]);
};
