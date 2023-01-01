import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { TextField } from "@material-ui/core";

/*
 * Socrata Endpoint
 */
export const SOCRATA_ENDPOINT =
  "https://data.austintexas.gov/resource/p53x-x73x.geojson?$select=signal_id,location_name,location,signal_type,id&$order=signal_id asc&$limit=9999";

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
export const getSignalOptionLabel = (option) =>
  // this label formatting mirrors the Data Tracker formatting
  `${option.properties.signal_id}: ${option.properties.location_name}`;

/**
 * Imitate a "drawn point" feature from a traffic signal geojson feature. Sets required
 * fields so that a Knack feature can be inserted into the feature_signals table
 * @param {Object} signal - A GeoJSON feature or a falsey object (e.g. "" from empty input)
 * @return {Object} A geojson feature collection with the signal feature or 0 features
 */
export const knackSignalRecordToFeatureSignalsRecord = (signal) => {
  if (signal && signal?.properties && signal?.geometry) {
    /* 
    / preserves the feature's previous UUID if it's being edited. we are **not** preserving
    / any other feature properties when the feature is edited. so, for example, if the user
    / edits a signal component and the signal geometry in socrata has since changed, the new
    / geometry will be saved.
    */
    const featureUUID = signal?.id || uuidv4();
    const featureSignalsRecord = {
      // MultiPoint coordinates are an array of arrays, so we wrap the coordinates
      geography: {
        ...signal.geometry,
        type: "MultiPoint",
        coordinates: [signal.geometry.coordinates],
      },
      knack_id: signal.properties.id,
      location_name: signal.properties.location_name,
      signal_type: signal.properties.signal_type,
      signal_id: signal.properties.signal_id,
      // I was considering changing this to be INTERSECTIONID, but since the sourceLayer is being saved
      // as "drawnByUser" and not "ATD_ADMIN.CTN_Intersections", I've left it as PROJECT_EXTENT_ID
      project_extent_id: featureUUID,
      source_layer: "drawnByUser",
    };

    return featureSignalsRecord;
  }
};

/*
/ Defines text input to render in MUI autocomplete
*/
export const renderSignalInput = (
  params,
  signalError = false,
  variant = "standard",
  size = "medium"
) => {
  return (
    <TextField
      {...params}
      error={signalError}
      InputLabelProps={{ required: false }}
      label="Signal"
      required
      helperText="Required"
      variant={variant}
      size={size}
    />
  );
};

/**
 * Get's the correct COMPONENT_DEFIINITION property based on the presence of a signal feature
 * @param {Boolean} fromSignalAsset - if signal autocomplete switch is active
 * @param {Object} signalRecord - The signal record to be inserted into a project and its component
 * @param {Object[]} componentData - Array of moped_components from DB
 * @return {Object} - The component definition of the component
 */
export const getComponentDef = (
  signalRecord,
  fromSignalAsset,
  componentData
) => {
  // try to extract a signal_type from the component
  const signalType = fromSignalAsset ? signalRecord?.signal_type : null;

  let componentDef;

  if (signalType) {
    // try to locate a matching component def
    componentDef = componentData.find(
      (component) =>
        component.component_subtype.toLowerCase() === signalType.toLowerCase()
    );
    // we must destructure to append a description prop
    componentDef = componentDef
      ? {
          ...componentDef,
          description: `Signal - ${componentDef.component_subtype}`,
        }
      : componentDef;
  }
  if (componentDef) return componentDef;

  // otherwise use generic extent
  return {
    component_name: "Project Extent - Generic",
    description: "Project Extent - Generic",
    component_id: 0,
  };
};

/**
 * Resets signal when fromSignalAsset toggle changes. Ensures we keep
 * form state clean in new project view.
 * @param {Boolean} fromSignalAsset - if signal autocomplete switch is active
 * @param {func} setSignal - signal state setter
 * @param {Function} setSignalRecord - signal record state setter
 */
export const useSignalStateManager = (
  fromSignal,
  setSignal,
  setSignalRecord
) => {
  useEffect(() => {
    setSignal("");
    setSignalRecord(null);
  }, [fromSignal, setSignal, setSignalRecord]);
};

/**
 * Generates a project component object that can be used in mutation.
 * @param {Object} signalRecord - The signal record to be inserted into a project and its component
 * @param {Boolean} fromSignalAsset - if signal autocomplete switch is active
 * @param {Array} componentData - Array of moped_components from DB
 * @return {Object} - The component mutation object
 */
export const generateProjectComponent = (
  signalRecord,
  fromSignalAsset,
  componentData
) => {
  const componentDef = getComponentDef(
    signalRecord,
    fromSignalAsset,
    componentData
  );

  return {
    name: componentDef.component_name,
    description: componentDef.description,
    component_id: componentDef.component_id,
    feature_signals: {
      data: [signalRecord],
    },
  };
};
