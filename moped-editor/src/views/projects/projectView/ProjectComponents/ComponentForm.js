import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Controller, useForm } from "react-hook-form";
import { Button, Grid, TextField } from "@material-ui/core";
import { CheckCircle } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import { GET_COMPONENTS_FORM_OPTIONS } from "src/queries/components";
import {
  ComponentOptionWithIcon,
  useComponentOptions,
  useSubcomponentOptions,
} from "./utils/map";

const defaultFormValues = {
  component: {},
  subcomponents: [],
  description: "",
};

const ControlledAutocomplete = ({
  id,
  options,
  renderOption,
  name,
  control,
  label,
  autoFocus = false,
  multiple = false,
}) => (
  <Controller
    id={id}
    name={name}
    control={control}
    render={({ onChange, value, ref }) => (
      <Autocomplete
        options={options}
        multiple={multiple}
        getOptionLabel={(option) => option?.label || ""}
        getOptionSelected={(option, value) => option?.value === value?.value}
        renderOption={renderOption}
        value={value}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={ref}
            size="small"
            label={label}
            variant="outlined"
            autoFocus={autoFocus}
          />
        )}
        onChange={(_event, option) => onChange(option)}
      />
    )}
  />
);

const ComponentForm = ({
  formButtonText,
  onSave,
  initialFormValues = null,
}) => {
  const doesInitialValueHaveSubcomponents =
    initialFormValues?.subcomponents.length > 0;

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: defaultFormValues,
  });

  // Get and format component and subcomponent options
  const { data: optionsData, loading: areOptionsLoading } = useQuery(
    GET_COMPONENTS_FORM_OPTIONS
  );
  const componentOptions = useComponentOptions(optionsData);
  const { component } = watch();
  const subcomponentOptions = useSubcomponentOptions(component);

  console.log({ optionsData, componentOptions, subcomponentOptions });

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
  }, [componentOptions]);

  // useEffect(() => {
  //   if (subcomponentOptions.length === 0) return;
  //   if (initialFormValues.subcomponents.length === 0) return;

  //   const selectedSubcomponents = initialFormValues.subcomponents.map(
  //     (subcomponent) => ({
  //       value: subcomponent,
  //       label: subcomponentOptions.find(
  //         (option) => option.value === subcomponent
  //       ).label,
  //     })
  //   );
  //   console.log(subcomponentOptions);

  //   setValue("subcomponents", selectedSubcomponents);
  // }, [subcomponentOptions]);

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
          >
            {formButtonText}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ComponentForm;
