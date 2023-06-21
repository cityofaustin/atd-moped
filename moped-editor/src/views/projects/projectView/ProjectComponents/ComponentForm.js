import React, { useEffect, useState } from "react";
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
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { CheckCircle } from "@mui/icons-material";
import { ControlledAutocomplete } from "./utils/form";
import { GET_COMPONENTS_FORM_OPTIONS } from "src/queries/components";
import SignalComponentAutocomplete from "./SignalComponentAutocomplete";
import {
  ComponentOptionWithIcon,
  useComponentOptions,
  useSubcomponentOptions,
  usePhaseOptions,
  useSubphaseOptions,
  useComponentTagsOptions,
} from "./utils/form";
import * as yup from "yup";
import { format } from "date-fns";

const defaultFormValues = {
  component: null,
  subcomponents: [],
  phase: null,
  subphase: null,
  tags: [],
  completionDate: null,
  description: "",
  signal: null,
  srtsId: null,
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

/**
 * Return a Date object from a string date
 * @param {string} value - the string formatted date
 * @returns
 */
const parseDate = (value) => {
  if (value) {
    let newdate = new Date(value);
    return newdate;
  }
  return null;
};

const ComponentForm = ({
  formButtonText,
  onSave,
  initialFormValues = null,
}) => {
  const doesInitialValueHaveSubcomponents =
    initialFormValues?.subcomponents.length > 0;

  // TODO: Building the initialFormValues should happen in EditAttributesModal
  // const editDefaultFormValues = initialFormValues
  //   ? {
  //       component: makeComponentFormFieldValue(initialFormValues.component),
  //       description: initialFormValues.description,
  //       subcomponents: makeSubcomponentsFormFieldValues(
  //         initialFormValues.subcomponents
  //       ),
  //       signal: makeSignalFormFieldValue(initialFormValues.component),
  //       phase: makePhaseFormFieldValue(initialFormValues.component),
  //       subphase: makeSubphaseFormFieldValue(initialFormValues.component),
  //       completionDate: initialFormValues.component.completion_date,
  //       srtsId: initialFormValues.srtsId,
  //       tags: makeTagFormFieldValues(initialFormValues.tags),
  //     }
  //   : null;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isValid },
  } = useForm({
    defaultValues: initialFormValues ? initialFormValues : defaultFormValues,
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  // Get and format component and subcomponent options
  const {
    data: optionsData,
    loading: areOptionsLoading,
    error,
  } = useQuery(GET_COMPONENTS_FORM_OPTIONS);

  error && console.error(error);

  const componentOptions = useComponentOptions(optionsData);
  const phaseOptions = usePhaseOptions(optionsData);
  const { component, phase } = watch();
  const subphaseOptions = useSubphaseOptions(phase?.data.moped_subphases);
  const internalTable = component?.data?.feature_layer?.internal_table;
  const isSignalComponent = internalTable === "feature_signals";
  const [areSignalOptionsLoaded, setAreSignalOptionsLoaded] = useState(false);
  const onOptionsLoaded = () => setAreSignalOptionsLoaded(true);
  const componentTagsOptions = useComponentTagsOptions(optionsData);

  // Set the selected component after the component options are loaded
  // TODO: This should NOT happen when creating a new component
  useEffect(() => {
    if (areOptionsLoading || initialFormValues === null) return;

    setValue("component", initialFormValues.component);
  }, [areOptionsLoading, initialFormValues, setValue]);

  // TODO: The value of the signal is getting cleared on first load
  useEffect(() => {
    if (
      !areSignalOptionsLoaded ||
      !isSignalComponent ||
      initialFormValues === null
    )
      return;

    setValue("signal", initialFormValues.signal);
  }, [areSignalOptionsLoaded, initialFormValues, setValue, isSignalComponent]);

  const subcomponentOptions = useSubcomponentOptions(
    component?.value,
    optionsData?.moped_components
  );
  const [useComponentPhase, setUseComponentPhase] = useState(
    !!initialFormValues?.phase
  );

  // Reset signal field when component changes so signal matches component signal type
  useEffect(() => {
    setValue("signal", null);
  }, [component, setValue]);

  // reset subcomponent selections when component to ensure only allowed subcomponents
  // assumes component type cannot be changed when editing
  // todo: preserve allowed subcomponents when switching b/t component types
  useEffect(() => {
    if (!initialFormValues?.subcomponents) {
      setValue("subcomponents", []);
    }
  }, [subcomponentOptions, initialFormValues, setValue]);

  // Reset subphases field when phase changes so subphase options match phase
  useEffect(() => {
    if (!phase?.value) return;
    if (!initialFormValues) return;
    if (initialFormValues.phase?.value !== phase?.value) {
      setValue("subphase", null);
    }
  }, [phase, setValue, initialFormValues]);

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
                option={option}
                state={state}
                props={props}
              />
            )}
            name="component"
            control={control}
            autoFocus
            disabled={isEditingExistingComponent}
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
                  onOptionsLoaded={onOptionsLoaded}
                  signalType={component?.data?.component_subtype}
                />
              )}
            />
          </Grid>
        )}

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
                    <MobileDatePicker
                      {...field}
                      value={parseDate(field.value)}
                      onChange={(date) => {
                        const newDate = date
                          ? format(date, "yyyy-MM-dd OOOO")
                          : null;
                        field.onChange(newDate);
                      }}
                      format="MM/dd/yyyy"
                      variant="outlined"
                      label={"Completion date"}
                      slotProps={{
                        actionBar: { actions: ["accept", "cancel", "clear"] },
                      }}
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
            disabled={!isValid}
          >
            {isSignalComponent ? "Save" : formButtonText}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ComponentForm;
