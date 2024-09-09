import React, { useEffect } from "react";
import { TextField } from "@mui/material";

/*
 * Socrata Endpoint for Signals and PHBs
 */
export const SOCRATA_ENDPOINT =
  "https://data.austintexas.gov/resource/p53x-x73x.geojson?$select=signal_id,location_name,location,signal_type,id&$order=signal_id asc&$limit=9999";

/*
 * Socrata endpoint for school beacons
 */
export const SOCRATA_ENDPOINT_SCHOOL_BEACONS =
  "https://data.austintexas.gov/resource/mzsm-hucz.geojson?$select=school_zone_beacon_id,beacon_name,beacon_id,zone_name,location,id&$order=school_zone_beacon_id asc&$limit=9999";

/**
 * An array to use as the default value for
 * moped_proj_component_work_type: 7 = "New"
 */
const DEFAULT_SIGNAL_WORK_TYPE = [{ work_type_id: 7 }];

/**
 * MUI autocomplete getOptionSelected function to which matches input signal value to
 * select options.
 */
export const getSignalOptionSelected = (option, value) => {
  const optionId = option?.properties?.id;
  const valueId = value?.properties?.id;

  // Socrata returns a string for the signal_id, but the value is a number
  return optionId.toString() === valueId.toString();
};

/**
 * MUI autocomplete getOptionLabel function to which formats the value rendered in
 * the select option menu
 */
export const getSignalOptionLabel = (option) =>
  // this label formatting mirrors the Data Tracker formatting
  `${option.properties.signal_id}: ${option.properties.location_name}`;

/**
 * Sets required fields so that a Knack traffic signal record can be inserted into the feature_signals table
 * @param {Object} signal - A GeoJSON feature or a falsey object (e.g. "" from empty input)
 * @return {Object} A geojson feature collection with the signal feature or 0 features
 */
export const knackSignalRecordToFeatureSignalsRecord = (signal) => {
  if (signal && signal?.properties && signal?.geometry) {
    const featureSignalsRecord = {
      // MultiPoint coordinates are an array of arrays, so we wrap the coordinates
      geography: {
        ...signal.geometry,
        type: "MultiPoint",
        coordinates: [signal.geometry.coordinates],
      },
      knack_id: signal.properties.id,
      location_name: signal.properties.location_name,
      signal_type: signal.properties.signal_type, // make it say school beacon?
      signal_id: signal.properties.signal_id, // and then what here?
    };

    return featureSignalsRecord;
  }
};

/**
 * Format a feature_signals table record to the format of options in the SignalComponentAutocomplete
 * @param {Object} featureSignalsRecord - A feature_signals table record
 * @return {Object} A record in the format of options in the SignalComponentAutocomplete
 */
export const featureSignalsRecordToKnackSignalRecord = (
  featureSignalsRecord
) => {
  const { geometry, ...restOfFeatureSignalRecord } = featureSignalsRecord;
  const { knack_id } = restOfFeatureSignalRecord;

  const knackFormatSignalOption = {
    type: "Feature",
    geometry: { ...geometry, coordinates: geometry.coordinates.flat() },
    properties: { ...restOfFeatureSignalRecord, id: knack_id },
  };

  return knackFormatSignalOption;
};

/*
/ Defines text input to render in MUI autocomplete
*/
export const renderSignalInput = (
  params,
  signalError = false,
  size = "medium"
) => {
  return (
    <TextField
      {...params}
      variant="standard"
      error={signalError}
      InputLabelProps={{ required: false }}
      label="Signal"
      required
      helperText="Required"
      size={size}
    />
  );
};

/**
 * Gets the correct COMPONENT_DEFINITION property based on the presence of a signal feature
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
    component_id: componentDef.component_id,
    location_description: signalRecord.location_name.trim(),
    feature_signals: {
      data: [signalRecord],
    },
    // create default value for component work type, which
    // is a required field enforced through the UI
    moped_proj_component_work_types: {
      data: DEFAULT_SIGNAL_WORK_TYPE,
    },
  };
};

/**
 * MUI autocomplete getOptionSelected function to which matches input signal value to
 * select options.
 */
export const getSchoolZoneBeaconOptionSelected = (option, value) => {
  const optionId = option?.properties?.id;
  const valueId = value?.properties?.id;
  // Socrata returns a string for the signal_id, but the value is a number
  return optionId.toString() === valueId.toString();
};

/**
 * MUI autocomplete getOptionLabel function to which formats the value rendered in
 * the select option menu
 */
export const getSchoolZoneBeaconOptionLabel = (option) =>
  // CHECK THIS this label formatting mirrors the Data Tracker formatting
  `${option.properties.zone_name}: ${option.properties.beacon_name} ${option.properties.beacon_id}`;
