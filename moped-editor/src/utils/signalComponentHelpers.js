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
export const getSignalOptionLabel = option =>
  // this label formatting mirrors the Data Tracker formatting
  `${option.properties.signal_id}: ${option.properties.location_name}`;

/**
 * Imitate a "drawn point" feature from a traffic signal geojson feature. Sets required
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
        // I was considering changing this to be INTERSECTIONID, but since the sourceLayer is being saved
        // as "drawnByUser" and not "ATD_ADMIN.CTN_Intersections", I've left it as PROJECT_EXTENT_ID
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
export const renderSignalInput = (
  params,
  signalError = false,
  variant = "standard"
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
    />
  );
};

/**
 * Get's the correct COMPONENT_DEFIINITION property based on the presence of a signal feature
 * @param {Boolean} fromSignalAsset - if signal autocomplete switch is active
 * @param {Object} featureCollection - The final GeoJSON to be inserted into a component
 * @param {Object[]} componentData - Array of moped_components from DB
 * @return {Object} - The component definition of the component
 */
export const getComponentDef = (
  featureCollection,
  fromSignalAsset,
  componentData
) => {
  // try to extract a signal_type from the component
  const signalType = fromSignalAsset
    ? featureCollection?.features?.[0].properties?.signal_type
    : null;

  let componentDef;

  if (signalType) {
    // try to locate a matching component def
    componentDef = componentData.find(
      component =>
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

/**
 * Generates a project component object that can be used in mutation.
 * @param {Boolean} fromSignalAsset - if signal autocomplete switch is active
 * @param {Object} featureCollection - The final GeoJSON to be inserted into a component
 * @return {Object} - The component mutation object
 */
export const generateProjectComponent = (
  featureCollection,
  fromSignalAsset,
  componentData
) => {
  const componentDef = getComponentDef(
    featureCollection,
    fromSignalAsset,
    componentData
  );

  return {
    name: componentDef.component_name,
    description: componentDef.description,
    component_id: componentDef.component_id,
    moped_proj_features: {
      data: featureCollection.features.map(feature => ({
        feature: feature,
      })),
    },
  };
};
