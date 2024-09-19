import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Grid,
  Switch,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import DateFieldEditComponent from "../DateFieldEditComponent";
import { CheckCircle } from "@mui/icons-material";
import { GET_COMPONENTS_FORM_OPTIONS } from "src/queries/components";
import SignalComponentAutocomplete from "./SignalComponentAutocomplete";
import {
  ComponentOptionWithIcon,
  DEFAULT_COMPONENT_WORK_TYPE_OPTION,
  useComponentOptions,
  useComponentOptionsFilteredByLineRepresentation,
  useComponentOptionsWithoutSignals,
  useSubcomponentOptions,
  usePhaseOptions,
  useSubphaseOptions,
  useComponentTagsOptions,
  useWorkTypeOptions,
  useResetDependentFieldOnParentFieldChange,
  getOptionLabel,
  isOptionEqualToValue,
} from "./utils/form";
import ControlledAutocomplete from "../../../../components/forms/ControlledAutocomplete";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import { getSignalOptionLabel } from "src/utils/signalComponentHelpers";
import ComponentProperties from "./ComponentProperties";

import * as yup from "yup";

const defaultFormValues = {
  component: null,
  subcomponents: [],
  phase: null,
  subphase: null,
  tags: [],
  completionDate: null,
  locationDescription: null,
  description: null,
  work_types: [DEFAULT_COMPONENT_WORK_TYPE_OPTION],
  signal: null,
  srtsId: null,
};

const validationSchema = yup.object().shape({
  component: yup.object().required(),
  subcomponents: yup.array().optional(),
  phase: yup.object().nullable().optional(),
  subphase: yup.object().nullable().optional(),
  tags: yup.array().optional(),
  completionDate: yup
    .date()
    .nullable()
    .optional()
    .when("phase", {
      is: (phase) => !!phase,
      then: yup
        .date()
        .required("Must enter phase completion date if a phase is selected"),
    }),
  description: yup.string().nullable().optional(),
  work_types: yup.array().of(yup.object()).min(1).required(),
  // Signal field is required if the selected component inserts into the feature_signals table
  signal: yup.object().nullable(),
  srtsId: yup.string().nullable().optional(),
  locationDescription: yup.string().nullable().optional(),
});

const ComponentForm = ({
  formButtonText,
  onSave,
  initialFormValues = null,
}) => {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: initialFormValues ? initialFormValues : defaultFormValues,
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const areFormErrors = Object.keys(errors).length > 0;

  // Get and format component and subcomponent options
  const { data: optionsData, error } = useQuery(GET_COMPONENTS_FORM_OPTIONS);

  error && console.error(error);

  const isEditingExistingComponent = initialFormValues !== null;
  const isLineRepresentation =
    initialFormValues?.component?.data?.line_representation;

  const unfilteredComponentOptions = useComponentOptions(optionsData);
  const componentOptionsFilteredByLineRepresentation =
    useComponentOptionsFilteredByLineRepresentation({
      shouldFilterOptions: isEditingExistingComponent,
      options: unfilteredComponentOptions,
      isLineRepresentation,
    });
  // When we are editing component type of an existing component, we want to
  // prevent switching to a signal component for now.
  const componentOptionsWithoutSignals = useComponentOptionsWithoutSignals(
    componentOptionsFilteredByLineRepresentation
  );

  const phaseOptions = usePhaseOptions(optionsData);
  const [component, phase, completionDate, subcomponents, signal] = watch([
    "component",
    "phase",
    "completionDate",
    "subcomponents",
    "signal",
  ]);
  const subphaseOptions = useSubphaseOptions(phase?.data.moped_subphases);
  const assetFeatureTable =
    component?.data?.asset_feature_layer?.internal_table;
  const isSignalComponent = assetFeatureTable === "feature_signals";
  const componentTagsOptions = useComponentTagsOptions(optionsData);

  const workTypeOptions = useWorkTypeOptions(
    component?.value,
    optionsData?.moped_components
  );

  const subcomponentOptions = useSubcomponentOptions(
    component?.value,
    optionsData?.moped_components
  );
  const [useComponentPhase, setUseComponentPhase] = useState(
    !!initialFormValues?.phase || !!initialFormValues?.completionDate
  );

  useResetDependentFieldOnParentFieldChange({
    parentValue: watch("phase"),
    dependentFieldName: "subphase",
    comparisonVariable: "value",
    valueToSet: defaultFormValues.subphase,
    setValue,
  });

  useResetDependentFieldOnParentFieldChange({
    parentValue: watch("component"),
    dependentFieldName: "signal",
    comparisonVariable: "value",
    valueToSet: defaultFormValues.signal,
    setValue,
  });

  // todo: preserve subcomponent choices if allowed when switching b/t component types
  useResetDependentFieldOnParentFieldChange({
    parentValue: watch("component"),
    dependentFieldName: "subcomponents",
    comparisonVariable: "value",
    valueToSet: defaultFormValues.subcomponents,
    setValue,
    disable: isEditingExistingComponent,
  });

  // todo: preserve work type if allowed when switching b/t component types
  useResetDependentFieldOnParentFieldChange({
    parentValue: watch("component"),
    dependentFieldName: "work_types",
    comparisonVariable: "value",
    valueToSet: defaultFormValues.work_types,
    setValue,
    disable: isEditingExistingComponent,
  });

  useResetDependentFieldOnParentFieldChange({
    parentValue: watch("signal"),
    dependentFieldName: "locationDescription",
    comparisonVariable: "properties.id",
    valueToSet: signal
      ? // if the signal exists and the locationDescription is empty, set to option label
        getSignalOptionLabel(signal)
      : "",
    setValue,
  });

  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ControlledAutocomplete
            id="component"
            label="Component Type"
            options={
              isEditingExistingComponent
                ? componentOptionsWithoutSignals
                : unfilteredComponentOptions
            }
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            renderOption={(props, option, state) => (
              <ComponentOptionWithIcon
                key={option.value}
                option={option}
                state={state}
                props={props}
              />
            )}
            name="component"
            control={control}
            autoFocus
            helperText="Required"
            required={true}
          />
        </Grid>
        {isSignalComponent && (
          <Grid item xs={12}>
            <Controller
              id="signal"
              name="signal"
              control={control}
              shouldUnregister={true}
              render={({ field }) => (
                <SignalComponentAutocomplete
                  {...field}
                  signalType={component?.data?.component_subtype}
                />
              )}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <ControlledAutocomplete
            id="work_type"
            label="Work Type(s)"
            multiple
            options={workTypeOptions}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            name="work_types"
            control={control}
            error={!!errors?.work_types}
            helperText="Required"
            required={true}
          />
        </Grid>
        {/* Hide unless there are subcomponents for the chosen component
        or if there is a subcomponent chosen for the component */}
        {(subcomponentOptions.length !== 0 || subcomponents.length !== 0) && (
          <Grid item xs={12}>
            <ControlledAutocomplete
              id="subcomponents"
              label="Subcomponents"
              multiple
              options={subcomponentOptions}
              getOptionLabel={getOptionLabel}
              isOptionEqualToValue={isOptionEqualToValue}
              name="subcomponents"
              control={control}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <ControlledAutocomplete
            id="tags"
            label="Tags"
            multiple
            options={componentTagsOptions}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            name="tags"
            control={control}
          />
        </Grid>
        <Grid item xs={12}>
          <ControlledTextInput
            fullWidth
            label="Location description"
            name="locationDescription"
            size="small"
            control={control}
          />
        </Grid>
        <Grid item xs={12}>
          <ControlledTextInput
            fullWidth
            label="Description"
            name="description"
            size="small"
            multiline
            minRows={4}
            control={control}
          />
        </Grid>
        <Grid item xs={12}>
          <ControlledTextInput
            fullWidth
            label="SRTS Infrastructure ID"
            name="srtsId"
            size="small"
            control={control}
            helperText={
              "The Safe Routes to School infrastructure plan record identifier"
            }
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={useComponentPhase}
                onChange={() => setUseComponentPhase(!useComponentPhase)}
                name="useComponentPhase"
                color="primary"
                disabled={!!phase || !!completionDate}
              />
            }
            labelPlacement="start"
            label="Use component phase"
            style={{ color: "gray", marginLeft: 0 }}
          />
          {useComponentPhase && (
            <FormHelperText>
              Assign a phase to the component to differentiate it from the
              overall phase of this project
            </FormHelperText>
          )}
        </Grid>
        {useComponentPhase && (
          <>
            <Grid item xs={12}>
              <ControlledAutocomplete
                id="phase"
                label="Phase"
                options={phaseOptions}
                name="phase"
                control={control}
                autoFocus
              />
            </Grid>
            {subphaseOptions.length !== 0 && (
              <Grid item xs={12}>
                <ControlledAutocomplete
                  id="subphase"
                  label="Subphase"
                  options={subphaseOptions}
                  name="subphase"
                  control={control}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Controller
                id="completion-date"
                name="completionDate"
                control={control}
                render={({ field }) => {
                  return (
                    <DateFieldEditComponent
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                      variant="outlined"
                      label={"Completion date"}
                    />
                  );
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
      {initialFormValues && (
        <ComponentProperties component={initialFormValues} />
      )}
      <Grid container display="flex" justifyContent="flex-end">
        <Grid item sx={{ marginTop: 2, marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckCircle />}
            type="submit"
            disabled={!isDirty || areFormErrors}
          >
            {isSignalComponent && signal ? "Save" : formButtonText}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ComponentForm;
