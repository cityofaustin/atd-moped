import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { TextField } from "@material-ui/core";

/*
/ MUI autocomplete filter function which limits number of options rendered in select menu
*/
export const filterSignalOptions = (
  options,
  { inputValue, getOptionLabel }
) => {
  // limits options to ensure fast rendering
  const limit = 40;
  // applies the default autcomplete matching behavior plus our limit filter
  const filteredOptions = options.filter(option =>
    getOptionLabel(option)
      .toLowerCase()
      .includes(inputValue.toLowerCase())
  );
  return filteredOptions.slice(0, limit);
};

/**
 * MUI autocomplete getOptionSelected function to which matches input signal value to
 * select options.
 */
export const getSignalOptionSelected = (option, value) =>
  option.properties?.signal_id === value.properties?.signal_id;

/**
 * MUI autocomplete getOptionLabel function to which formats the value rendered in
 * the select option menu
 */
export const getSignalOptionLabel = option =>
  // this label formatting mirrors the Data Tracker formatting
  `${option.properties.signal_id}: ${option.properties.location_name}`;

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

/*
/ Defines text input to render in MUI autocomplete
*/
export const renderSignalInput = params => (
  <TextField
    {...params}
    helperText="Required"
    label="Signal"
    variant="outlined"
  />
);

/**
 * Component definitions. The component_id must match a valid component in the
 * moped_components DB lookup table.
 */
export const COMPONENT_DEFINITIONS = {
  generic: {
    name: "Extent",
    description: "New Project Feature Extent",
    component_id: 0,
  },
  phb: {
    name: "PHB",
    description: "Pedestrian ssignal",
    component_id: 16,
  },
  traffic: {
    name: "Traffic signal",
    description: "Traffic signal",
    component_id: 18,
  },
};

/**
 * Get's the correct COMPONENT_DEFIINITION property based on the presence of a signal feature
 * @param {Boolean} fromSignalAsset - if signal autocomplete switch is active
 * @param {Object} featureCollection - The final GeoJSON to be inserted into a component
 * @return {Object} - The component definition pboject
 */
export const getComponentDef = (featureCollection, fromSignalAsset) => {
  const signalType = fromSignalAsset
    ? featureCollection.features[0].properties?.signal_type?.toLowerCase()
    : null;
  return signalType
    ? COMPONENT_DEFINITIONS[signalType]
    : COMPONENT_DEFINITIONS.generic;
};

/**
 * Generates a project component object that can be used in mutation.
 * @param {Boolean} fromSignalAsset - if signal autocomplete switch is active
 * @param {Object} featureCollection - The final GeoJSON to be inserted into a component
 * @return {Object} - The component mutation object
 */
export const generateProjectComponent = (
  featureCollection,
  fromSignalAsset
) => {
  const componentDef = getComponentDef(featureCollection, fromSignalAsset);
  return {
    name: "Extent",
    description: "Project full extent",
    component_id: componentDef.component_id,
    status_id: 1,
    moped_proj_features_components: {
      data: featureCollection.features.map(feature => ({
        name: componentDef.name,
        description: componentDef.description,
        status_id: 1,
        moped_proj_feature_object: {
          data: {
            status_id: 1,
            location: feature,
          },
        },
      })),
    },
  };
};

/**
 * Resets featureCollection and signal when fromSignalAsset toggle changes. Ensures we keep
 * form state clean in new project view.
 * @param {Boolean} fromSignalAsset - if signal autocomplete switch is active
 * @param {func} setSignal - signal state setter
 * @param {Object} setFeatureCollection - featureCollection state setter
 */
export const useSignalStateManager = (
  fromSignal,
  setSignal,
  setFeatureCollection
) => {
  useEffect(() => {
    setFeatureCollection({
      type: "FeatureCollection",
      features: [],
    });
    setSignal("");
  }, [setFeatureCollection, fromSignal, setSignal]);
};
