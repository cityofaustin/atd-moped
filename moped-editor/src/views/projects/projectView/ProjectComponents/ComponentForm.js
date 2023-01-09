import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid, TextField } from "@material-ui/core";
import { CheckCircle } from "@material-ui/icons";
import { ControlledAutocomplete } from "./utils/form";
import { GET_COMPONENTS_FORM_OPTIONS } from "src/queries/components";
import SignalComponentAutocomplete from "../SignalComponentAutocomplete";
import {
  ComponentOptionWithIcon,
  useComponentOptions,
  useSubcomponentOptions,
  useInitialValuesOnAttributesEdit,
} from "./utils/form";
import * as yup from "yup";

const defaultFormValues = {
  component: null,
  subcomponents: [],
  description: "",
  signal: null,
};

const validationSchema = yup.object().shape({
  component: yup.object().required(),
  subcomponents: yup.array().optional(),
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
  const { component, signal } = watch();
  const internalTable = component?.data?.feature_layer?.internal_table;
  const [areSignalOptionsLoaded, setAreSignalOptionsLoaded] = useState(false);

  const subcomponentOptions = useSubcomponentOptions(component);

  useInitialValuesOnAttributesEdit(
    initialFormValues,
    setValue,
    componentOptions,
    subcomponentOptions,
    areSignalOptionsLoaded
  );

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
                  setAreOptionsLoaded={setAreSignalOptionsLoaded}
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
