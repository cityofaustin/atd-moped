import React from "react";
import { useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Grid } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { ComponentOptionWithIcon } from "./utils/form";
import ControlledAutocomplete from "./ControlledAutocomplete";

import * as yup from "yup";

const validationSchema = yup.object().shape({
  projectComponentId: yup.string.required(),
});

const ComponentForm = ({
  formButtonText,
  onSave,
  initialFormValues = null,
  projectComponentId,
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: { projectComponentId },
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const areFormErrors = Object.keys(errors).length > 0;

  // Get projects for autocomplete
  //   const { data: optionsData, error } = useQuery(GET_COMPONENTS_FORM_OPTIONS);

  //   error && console.error(error);

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ControlledAutocomplete
            id="component"
            label="Component Type"
            options={[]}
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
            disabled={isSignalComponent && isEditingExistingComponent}
            autoFocus
            helperText="Required"
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
