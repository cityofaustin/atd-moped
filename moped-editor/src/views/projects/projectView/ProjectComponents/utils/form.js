import { useMemo, useEffect } from "react";
import { Icon, makeStyles } from "@material-ui/core";
import {
  RoomOutlined as RoomOutlinedIcon,
  Timeline as TimelineIcon,
} from "@material-ui/icons";

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
 * Take the data nested in the chosen moped_components option and produce a list of subcomponents options (if there are some)
 * for a MUI autocomplete
 * @param {Object} component Data stored in the currently selected component record
 * @returns {Array} The options with value and label
 */
export const useSubcomponentOptions = (component) =>
  useMemo(() => {
    console.log("this ran", component);
    const subcomponents = component?.data?.moped_subcomponents;
    console.log(subcomponents);
    if (!subcomponents) return [];

    const options = subcomponents.map((subComp) => ({
      value: subComp.subcomponent_id,
      label: subComp.subcomponent_name,
    }));

    return options;
  }, [component]);

export const useInitialValuesOnAttributesEdit = (
  initialFormValues,
  setValue,
  componentOptions,
  subcomponentOptions
) => {
  // Set the selected component after the component options are loaded
  useEffect(() => {
    if (!initialFormValues) return;
    if (componentOptions.length === 0) return;

    setValue("component", {
      value: initialFormValues.component.component_id,
      label: componentOptions.find(
        (option) => option.value === initialFormValues.component.component_id
      ).label,
      data: {
        moped_subcomponents:
          initialFormValues.component.moped_components.moped_subcomponents,
      },
    });
  }, [componentOptions, initialFormValues, setValue]);

  // Set the selected subcomponent after the subcomponent options are loaded
  useEffect(() => {
    if (!initialFormValues) return;
    if (subcomponentOptions.length === 0) return;
    if (initialFormValues.subcomponents.length === 0) return;

    const selectedSubcomponents = initialFormValues.subcomponents.map(
      (subcomponent) => ({
        value: subcomponent,
        label: subcomponentOptions.find(
          (option) => option.value === subcomponent.subcomponent_id
        ).label,
      })
    );

    setValue("subcomponents", selectedSubcomponents);
  }, [subcomponentOptions, initialFormValues, setValue]);

  // Set the description once
  useEffect(() => {
    if (!initialFormValues) return;

    setValue("description", initialFormValues.description);
  }, [initialFormValues, setValue]);
};

const useComponentOptionWithIconStyles = makeStyles((theme) => ({
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

/**
 * Renders an option with icon based on the type of geometry (if it exists) and component type label
 * @param {Object} option - Autocomplete option object with label, value, and data about component type
 * @return {JSX.Element}
 */
export const ComponentOptionWithIcon = ({ option }) => {
  const classes = useComponentOptionWithIconStyles();
  const { data: { line_representation = null } = {} } = option;

  return (
    <>
      <span className={classes.iconContainer}>
        {line_representation === true && <TimelineIcon />}
        {line_representation === false && <RoomOutlinedIcon />}
        {/* Fall back to a blank icon to keep labels lined up */}
        {line_representation === null && <Icon />}
      </span>{" "}
      {option.label}
    </>
  );
};
