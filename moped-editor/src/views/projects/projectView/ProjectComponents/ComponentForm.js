import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import DateFieldEditComponent from "../DateFieldEditComponent";
import { CheckCircle } from "@mui/icons-material";
import { GET_COMPONENTS_FORM_OPTIONS } from "src/queries/components";
import SignalComponentAutocomplete from "./SignalComponentAutocomplete";
import {
  ControlledAutocomplete,
  ComponentOptionWithIcon,
  useComponentOptions,
  useSubcomponentOptions,
  usePhaseOptions,
  useSubphaseOptions,
  useComponentTagsOptions,
  useWorkTypeOptions,
  useResetDependentFieldOnAutocompleteChange,
} from "./utils/form";
import * as yup from "yup";

const defaultFormValues = {
  component: null,
  subcomponents: [],
  phase: null,
  subphase: null,
  tags: [],
  completionDate: null,
  description: "",
  signal: null,
  srtsId: "",
};

const validationSchema = yup.object().shape({
  component: yup.object().required(),
  subcomponents: yup.array().optional(),
  phase: yup.object().nullable().optional(),
  subphase: yup.object().nullable().optional(),
  tags: yup.array().optional(),
  completionDate: yup.date().nullable().optional(),
  description: yup.string(),
  // Signal field is required if the selected component inserts into the feature_signals table
  signal: yup
    .object()
    .nullable()
    .when("component", {
      is: (val) =>
        val?.data?.feature_layer?.internal_table === "feature_signals",
      then: yup.object().required(),
    }),
  srtsId: yup.string().nullable().optional(),
});

const ComponentForm = ({
  formButtonText,
  onSave,
  initialFormValues = null,
}) => {
  const doesInitialValueHaveSubcomponents =
    initialFormValues?.subcomponents.length > 0;

  const {
    register,
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
  const {
    data: optionsData,
    loading: areOptionsLoading,
    error,
  } = useQuery(GET_COMPONENTS_FORM_OPTIONS);

  error && console.error(error);

  const componentOptions = useComponentOptions(optionsData);
  const phaseOptions = usePhaseOptions(optionsData);
  const [component, phase] = watch(["component", "phase"]);
  const subphaseOptions = useSubphaseOptions(phase?.data.moped_subphases);
  const internalTable = component?.data?.feature_layer?.internal_table;
  const isSignalComponent = internalTable === "feature_signals";
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
    !!initialFormValues?.phase
  );

  useResetDependentFieldOnAutocompleteChange({
    parentValue: watch("phase"),
    dependentFieldName: "subphase",
    valueToSet: defaultFormValues.subphase,
    setValue,
  });

  useResetDependentFieldOnAutocompleteChange({
    parentValue: watch("component"),
    dependentFieldName: "signal",
    valueToSet: defaultFormValues.signal,
    setValue,
  });

  // todo: preserve allowed subcomponents when switching b/t component types
  useResetDependentFieldOnAutocompleteChange({
    parentValue: watch("component"),
    dependentFieldName: "subcomponents",
    valueToSet: defaultFormValues.subcomponents,
    setValue,
  });

  const isEditingExistingComponent = initialFormValues !== null;

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ControlledAutocomplete
            id="component"
            label="Component Type"
            options={areOptionsLoading ? [] : componentOptions}
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
            disabled={isEditingExistingComponent}
            helperText="Required"
          />
        </Grid>

        {isSignalComponent && (
          <Grid item xs={12}>
            <Controller
              id="signal"
              name="signal"
              control={control}
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
            name="work_types"
            control={control}
          />
        </Grid>
        {/* Hide unless there are subcomponents for the chosen component */}
        {(subcomponentOptions.length !== 0 ||
          doesInitialValueHaveSubcomponents) && (
          <Grid item xs={12}>
            <ControlledAutocomplete
              id="subcomponents"
              label="Subcomponents"
              multiple
              options={subcomponentOptions}
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
            name="tags"
            control={control}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...register("description")}
            fullWidth
            size="small"
            id="description"
            label={"Description"}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            multiline
            minRows={4}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...register("srtsId")}
            fullWidth
            size="small"
            id="srtsId"
            label={"SRTS Infrastructure ID"}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
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
                required
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
      <Grid container spacing={4} display="flex" justifyContent="flex-end">
        <Grid item style={{ margin: 5 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CheckCircle />}
            type="submit"
            disabled={!isDirty || areFormErrors}
          >
            {isSignalComponent ? "Save" : formButtonText}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ComponentForm;
