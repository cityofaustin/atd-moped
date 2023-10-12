import { useMemo, useEffect, useState } from "react";
import { Icon } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { featureSignalsRecordToKnackSignalRecord } from "src/utils/signalComponentHelpers";
import { isSignalComponent } from "./componentList";
import {
  RoomOutlined as RoomOutlinedIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";
import theme from "src/theme/index";
import { get } from "lodash";

/**
 * Allows the component work type to be defaulted to `New` -
 * this value matches the `moped_work_types.id` value in the DB.
 */
export const DEFAULT_COMPONENT_WORK_TYPE_OPTION = { value: 7, label: "New" };

/**
 * Not all component type records have a value in the subtype column but let's concatenate them if they do
 * @param {string} component_name The name of the component
 * @param {string} component_subtype The name value in the component_subtype column of the component record
 * @returns {string}
 */
export const makeComponentLabel = ({ component_name, component_subtype }) => {
  return component_subtype
    ? `${component_name} - ${component_subtype}`
    : `${component_name}`;
};

/**
 * Create component tag label out of the type and name
 * @param {string} type The type of the component tag
 * @param {string} name The name of the component tag
 * @returns {string}
 */
export const makeComponentTagLabel = ({ type, name }) => {
  return `${type} - ${name}`;
};

/**
 * Take the moped_components records data response and create options for a MUI autocomplete
 * @param {Object} data Data returned with moped_components records
 * @returns {Array} The options with value, label, and full data object to produce the subcomponents options
 */
export const useComponentOptions = (data) =>
  useMemo(() => {
    if (!data) return [];

    const options = data.moped_components.map((comp) => ({
      value: comp.component_id,
      label: makeComponentLabel(comp),
      data: comp,
    }));

    return options;
  }, [data]);

/**
 * Take options returned by useComponentOptions and filter them by line representation of the component
 * currently being edited to keep from switching between lines and points after creation.
 * @param {Boolean} shouldFilterOptions Should the options be filtered at all
 * @param {Array} options Component options returned from useComponentOptions for Autocomplete
 * @param {Boolean} isLineRepresentation is component being edited line represented or not (line or point)
 * @returns {Array} The options with value, label, and full data object to produce the subcomponents options
 */
export const useComponentOptionsFilteredByLineRepresentation = ({
  shouldFilterOptions,
  options,
  isLineRepresentation,
}) =>
  useMemo(() => {
    if (!shouldFilterOptions) return options;

    return options.filter(
      (component) => component.data.line_representation === isLineRepresentation
    );
  }, [shouldFilterOptions, options, isLineRepresentation]);

/**
 * Take options returned by useComponentOptions and filters out signal components.
 * @param {Array} options Component Autocomplete options
 * @returns {Array} The options with value, label, and full data object to produce the subcomponents options
 */
export const useComponentOptionsWithoutSignals = (options) =>
  useMemo(() => {
    return options.filter(
      (option) =>
        option.data.feature_layer?.internal_table !== "feature_signals"
    );
  }, [options]);

/**
 * Take the data nested in the chosen moped_components option and produce a list of subcomponents options (if there are some)
 * for a MUI autocomplete
 * @param {Integer} componentId The unique ID of the moped_component
 * @param {Object[]} optionsData And array of moped_components records
 * @returns {Array} The subcompnent options with value and label
 */
export const useSubcomponentOptions = (componentId, optionsData) =>
  useMemo(() => {
    if (!componentId || !optionsData) return [];

    const subcomponents = optionsData.find(
      (option) => option.component_id === componentId
    )?.moped_components_subcomponents;

    if (!subcomponents) return [];

    const options = subcomponents.map((subComp) => ({
      value: subComp.moped_subcomponent.subcomponent_id,
      label: subComp.moped_subcomponent.subcomponent_name,
    }));

    return options;
  }, [componentId, optionsData]);

/**
 * Take the data nested in the chosen moped_components option and produce a list of work type options (if there are some)
 * for a MUI autocomplete
 * @param {Integer} componentId The unique ID of the moped_component
 * @param {Object[]} optionsData And array of moped_components records
 * @returns {Array} The work type options with value and label
 */
export const useWorkTypeOptions = (componentId, optionsData) =>
  useMemo(() => {
    if (!componentId || !optionsData) return [];

    const workTypes = optionsData.find(
      (option) => option.component_id === componentId
    )?.moped_component_work_types;

    if (!workTypes) return [];

    const options = workTypes.map((workType) => ({
      value: workType.moped_work_type.id,
      label: workType.moped_work_type.name,
    }));

    return options;
  }, [componentId, optionsData]);

/**
 * Take the moped_phases records data response and create options for a MUI autocomplete
 * @param {Object} data Data returned with moped_phases records
 * @returns {Array} The options with value, label, and full data object to produce the phases options
 */
export const usePhaseOptions = (data) =>
  useMemo(() => {
    if (!data) return [];

    const options = data.moped_phases.map((phase) => ({
      value: phase.phase_id,
      label: phase.phase_name,
      data: phase,
    }));

    return options;
  }, [data]);

/**
 * Take the moped_subphases records data response and create options for a MUI autocomplete
 * @param {Object} data Data returned with moped_subphases records
 * @returns {Array} The options with value, label, and full data object to produce the phases options
 */
export const useSubphaseOptions = (subphases) =>
  useMemo(() => {
    if (!subphases) return [];

    const options = subphases.map((subphase) => ({
      value: subphase.subphase_id,
      label: subphase.subphase_name,
      data: subphase,
    }));

    return options;
  }, [subphases]);

/**
 * Take the moped_component_tags records data response and create options for a MUI autocomplete
 * @param {Object} data Data returned with moped_component_tags records
 * @returns {Array} The options with value, label, and full data object to produce the component tags options
 */
export const useComponentTagsOptions = (data) =>
  useMemo(() => {
    if (!data) return [];

    const options = data.moped_component_tags.map((tag) => ({
      value: tag.id,
      label: makeComponentTagLabel(tag),
      data: tag,
    }));

    return options;
  }, [data]);

/**
 * Create the value for the required component autocomplete including component metadata for dependent fields
 * @param {Object} component - The component record
 * @returns {Object} the field value
 */
export const makeComponentFormFieldValue = (component) => {
  return {
    value: component.component_id,
    label: makeComponentLabel(component.moped_components),
    data: {
      // Include component subcomponents and metadata about the internal_table needed for the form
      ...component.moped_components,
    },
  };
};

/**
 * Create the values for the subcomponents autocomplete
 * @param {Array} subcomponents - The subcomponent records
 * @returns {Object} the field value
 */
export const makeSubcomponentsFormFieldValues = (subcomponents) => {
  return subcomponents.map((subcomponent) => ({
    value: subcomponent.subcomponent_id,
    label: subcomponent.moped_subcomponent?.subcomponent_name,
  }));
};

/**
 * Create the values for the work types autocomplete
 * @param {Array} workTypes - The work type records
 * @returns {Object} the field value
 */
export const makeWorkTypesFormFieldValues = (workTypes) => {
  return workTypes.map((workType) => ({
    value: workType.moped_work_type.id,
    label: workType.moped_work_type.name,
  }));
};

/**
 * Create the value for the signal autocomplete if the component is a signal component
 * @param {Object} component - The component record
 * @returns {Object} the field value
 */
export const makeSignalFormFieldValue = (component) => {
  if (!isSignalComponent(component)) return null;

  const componentSignal = component?.feature_signals?.[0];
  const knackFormatSignalOption =
    featureSignalsRecordToKnackSignalRecord(componentSignal);

  return knackFormatSignalOption;
};

/**
 * Create the value for the phase autocomplete including phase metadata for dependent fields
 * @param {Object} phase - The component phase record
 * @returns {Object} the field value
 */
export const makePhaseFormFieldValue = (phase) => {
  if (!phase) return null;

  return {
    value: phase?.phase_id,
    label: phase?.phase_name,
    data: {
      // Include component phase metadata needed for subphase options that correspond with selected phase
      ...phase,
    },
  };
};

/**
 * Create the value for the subphase autocomplete
 * @param {Object} subphase - The component subphase record
 * @returns {Object} the field value
 */
export const makeSubphaseFormFieldValue = (subphase) => {
  if (!subphase) return null;

  return {
    value: subphase?.subphase_id,
    label: subphase?.subphase_name,
  };
};

/**
 * Create the value for the component tags field
 * @param {Array} tags - The component tag records
 * @returns {Object} the field value
 */
export const makeTagFormFieldValues = (tags) => {
  return tags.map((tag) => ({
    value: tag.component_tag_id,
    label: makeComponentTagLabel(tag.moped_component_tag),
  }));
};

const useComponentIconByLineRepresentationStyles = makeStyles(() => ({
  icon: (props) => ({
    color: props.color,
  }),
}));

export const ComponentIconByLineRepresentation = ({
  lineRepresentation,
  color,
}) => {
  const classes = useComponentIconByLineRepresentationStyles({ color });

  if (lineRepresentation === true)
    return <TimelineIcon className={classes.icon} />;
  if (lineRepresentation === false)
    return <RoomOutlinedIcon className={classes.icon} />;
  /* Fall back to a blank icon to keep labels lined up */
  if (lineRepresentation === null) return <Icon className={classes.icon} />;
};

const useComponentOptionWithIconStyles = makeStyles((theme) => ({
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing(1),
  },
  optionContainer: {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    margin: theme.spacing(1),
  },
}));

/**
 * Renders an option with icon based on the type of geometry (if it exists) and component type label
 * @param {Object} option - Autocomplete option object with label, value, and data about component type
 * @return {JSX.Element}
 */
export const ComponentOptionWithIcon = ({ option, state, props }) => {
  const classes = useComponentOptionWithIconStyles();
  const { data: { line_representation = null } = {} } = option;

  return (
    <span className={classes.optionContainer} {...props}>
      <span className={classes.iconContainer}>
        <ComponentIconByLineRepresentation
          lineRepresentation={line_representation}
          color={theme.palette.primary.main}
        />{" "}
      </span>
      {option.label}
    </span>
  );
};

/**
 * Watch parent field and reset dependent field to default value when parent field changes
 * @param {Object} parentValue - Option object with value and label
 * @param {string} dependentFieldName - Name of the dependent field
 * @param {*} valueToSet - Any value to set the dependent field to
 * @param {Function} setValue - React Hook Form setValue function
 * @param {Boolean} disable - Disable the reset
 * @returns {Object} the field value
 */
export const useResetDependentFieldOnParentFieldChange = ({
  parentValue,
  dependentFieldName,
  comparisonVariable,
  valueToSet,
  setValue,
  disable = false,
}) => {
  // Track previous value to compare new value
  const [previousParentFormValue, setPreviousParentValue] =
    useState(parentValue);

  // when the parent value changes, compare to previous value
  // if it is different, reset the dependent field to its default
  useEffect(() => {
    // keep update from firing if the parent value hasn't changed
    if (
      get(parentValue, comparisonVariable) ===
      get(previousParentFormValue, comparisonVariable)
    )
      return;
    if (disable) return;

    setValue(dependentFieldName, valueToSet);
    setPreviousParentValue(parentValue);
  }, [
    parentValue,
    previousParentFormValue,
    setValue,
    comparisonVariable,
    dependentFieldName,
    valueToSet,
    disable,
  ]);
};

/**
 * Defines how to get the autocomplete option label value.
 * See MUI autocomplete docs.
 */
export const getOptionLabel = (option) => option?.label || "";

/**
 * Defines how to match the current select option to an object
 * in the options array. See MUI autocomplete docs.
 */
export const isOptionEqualToValue = (option, selectedOption) =>
  option?.value === selectedOption?.value;
