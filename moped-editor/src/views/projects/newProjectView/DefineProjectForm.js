import React from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, InputLabel, Switch, Box } from "@mui/material";
import { agolFieldCharMax } from "src/constants/projects";

const validationSchema = yup.object().shape({
  projectName: yup
    .string()
    .max(
      projectNamesCharMax,
      `Name must be ${projectNamesCharMax} characters or less`
    )
    .nullable()
    .required("Title cannot be blank"),
  projectSecondaryName: yup
    .string()
    .max(
      projectNamesCharMax,
      `Secondary name must be ${projectNamesCharMax} characters or less`
    )
    .nullable(),
  description: yup
    .string()
    .max(
      agolFieldCharMax.descriptionString,
      `Description must be ${agolFieldCharMax.descriptionString} characters or less`
    )
    .nullable()
    .required("Required"),
});

const DefineProjectForm = ({ handleSave }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: {
      projectName: null,
      projectSecondaryName: null,
      description: null,
    },
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const handleSave = () => {};

  return (
    <form onSubmit={handleSubmit(handleSave)} style={{ padding: 25 }}>
      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={6}>
          {!fromSignalAsset && ( // if
            <ControlledTextInput
              autoFocus
              variant="standard"
              fullWidth
              id="project_name"
              label="Project name"
              name="projectName"
              placeholder="Enter project name"
              control={control}
              error={!!errors?.projectName}
              helperText={errors?.projectName?.message}
            />
          )}
          {fromSignalAsset && ( // else
            <Box sx={{ marginBottom: "2.1rem" }}>
              <Controller
                id="signal"
                name="signal"
                control={control}
                shouldUnregister={true}
                render={({ field }) => (
                  <KnackComponentAutocomplete
                    {...field}
                    componentLabel="Signal"
                    signalType={component?.data?.component_subtype}
                    socrataEndpoint={SOCRATA_ENDPOINT}
                    isOptionEqualToValue={getSignalOptionSelected}
                    getOptionLabel={getSignalOptionLabel}
                  />
                )}
              />
            </Box>
          )}
          <ControlledTextInput
            variant="standard"
            fullWidth
            autoFocus
            id="secondary_name"
            name="projectSecondaryName"
            placeholder="Secondary name"
            label="Secondary name"
            control={control}
            error={!!errors?.projectSecondaryName}
            helperText={errors?.projectSecondaryName?.message}
          />
        </Grid>
        <Grid item xs={3}>
          <InputLabel>Use signal asset</InputLabel>
          <Switch
            variant="standard"
            type="checkbox"
            checked={fromSignalAsset}
            color="primary"
            name="use_signal_id"
            inputProps={{ "aria-label": "primary checkbox" }}
            onChange={(e) => setFromSignalAsset(e.target.checked)}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={6}>
          <ControlledTextInput
            variant="standard"
            fullWidth
            multiline
            minRows={4}
            maxRows={10}
            id="description"
            name="description"
            size="small"
            control={control}
            error={!!errors?.description}
            helperText={errors?.description?.message}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default DefineProjectForm;
