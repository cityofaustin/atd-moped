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
} from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { CheckCircle } from "@material-ui/icons";
import { ControlledAutocomplete } from "./utils/form";
import { GET_COMPONENTS_FORM_OPTIONS } from "src/queries/components";
import SignalComponentAutocomplete from "./SignalComponentAutocomplete";
import {
  ComponentOptionWithIcon,
  useComponentOptions,
  useSubcomponentOptions,
  usePhaseOptions,
  useSubphaseOptions,
  useInitialValuesOnAttributesEdit,
} from "./utils/form";
import * as yup from "yup";

const defaultFormValues = {
  component: null,
  subcomponents: [],
  phase: null,
  subphase: null,
  completionDate: null,
  description: "",
  signal: null,
};

const validationSchema = yup.object().shape({
  component: yup.object().required(),
  subcomponents: yup.array().optional(),
  phase: yup.object().nullable().optional(),
  subphase: yup.object().nullable().optional(),
  completionDate: yup.date().nullable().optional(),
  description: yup.string(),
  // Signal field is required if the selected component inserts into the feature_signals table
  signal: yup.object().when("component", {
    is: (val) => val?.data?.feature_layer?.internal_table === "feature_signals",
    then: yup.object().required(),
  }),
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
    formState: { isValid },
  } = useForm({
    defaultValues: defaultFormValues,
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  // Get and format component and subcomponent options
  const { data: optionsData, loading: areOptionsLoading } = useQuery(
    GET_COMPONENTS_FORM_OPTIONS
  );
  const componentOptions = useComponentOptions(optionsData);
  const phaseOptions = usePhaseOptions(optionsData);
  const { component, phase } = watch();
  const subphaseOptions = useSubphaseOptions(phase?.data.moped_subphases);
  const internalTable = component?.data?.feature_layer?.internal_table;
  const [areSignalOptionsLoaded, setAreSignalOptionsLoaded] = useState(false);
  const onOptionsLoaded = () => setAreSignalOptionsLoaded(true);

  const subcomponentOptions = useSubcomponentOptions(component);
  const [useComponentPhase, setUseComponentPhase] = useState(
    !!initialFormValues?.component.moped_phase
  );

  useInitialValuesOnAttributesEdit(
    initialFormValues,
    setValue,
    componentOptions,
    subcomponentOptions,
    phaseOptions,
    subphaseOptions,
    areSignalOptionsLoaded
  );

  // Reset signal field when component changes so signal matches component signal type
  useEffect(() => {
    setValue("signal", null);
  }, [component, setValue]);

  // Reset subphases field when phase changes so subphase options match phase
  useEffect(() => {
    if (!phase?.value) return;
    if (!initialFormValues) return;
    if (initialFormValues.phase?.phase_id !== phase?.value) {
      setValue("subphase", null);
    }
  }, [phase, setValue, initialFormValues]);

  const isEditingExistingComponent = initialFormValues !== null;
  const isSignalComponent = internalTable === "feature_signals";

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ControlledAutocomplete
            id="component"
            label="Component Type"
            options={areOptionsLoading ? [] : componentOptions}
            renderOption={(option) => (
              <ComponentOptionWithIcon option={option} />
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
              render={({ onChange, value, ref }) => (
                <SignalComponentAutocomplete
                  onChange={onChange}
                  value={value}
                  ref={ref}
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
          <TextField
            inputRef={register}
            fullWidth
            size="small"
            name="description"
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
                render={({ onChange, value, ref }) => (
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                      inputRef={ref}
                      value={value}
                      onChange={onChange}
                      clearable={true}
                      emptyLabel="mm/dd/yyyy"
                      format="MM/dd/yyyy"
                      variant="outlined"
                      label={"Completion date"}
                    />
                  </MuiPickersUtilsProvider>
                )}
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
