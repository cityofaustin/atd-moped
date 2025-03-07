import React from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, FormControlLabel, Grid, InputLabel, Switch } from "@mui/material";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import { agolFieldCharMax, projectNamesCharMax } from "src/constants/projects";
import KnackComponentAutocomplete from "src/views/projects/projectView/ProjectComponents/KnackComponentAutocomplete";
import ProjectSaveButton from "src/views/projects/newProjectView/ProjectSaveButton";
import * as yup from "yup";

import {
  getSignalOptionLabel,
  getSignalOptionSelected,
  SOCRATA_ENDPOINT,
} from "src/utils/signalComponentHelpers";

// TODO: Make schema or parts of it reusable? https://github.com/jquense/yup?tab=readme-ov-file#composition-and-reuse
const validationSchema = yup.object().shape({
  projectName: yup
    .string()
    .nullable()
    .optional()
    .when("isSignalProject", {
      is: false,
      then: yup
        .string()
        .max(
          projectNamesCharMax,
          `Name must be ${projectNamesCharMax} characters or less`
        )
        .nullable()
        .required("Name cannot be blank"),
    }),
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
  signal: yup
    .object()
    .nullable()
    .optional()
    .when("isSignalProject", {
      is: true,
      then: yup.object().required("Required"),
    }),
  isSignalProject: yup.boolean(),
});

/**
 * DefineProjectForm Component
 * @param {Function} handleSave - The function to save the new project
 * @param {Boolean} loading - Loading state to show form submission
 * @param {Boolean} success - Success state to show successful form submission
 * @returns {JSX.Element}
 * @constructor
 */
const DefineProjectForm = ({ handleSave, loading, success }) => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    defaultValues: {
      projectName: null,
      projectSecondaryName: null,
      description: null,
      isSignalProject: false,
      signal: null,
    },
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const [isSignalProject] = watch(["isSignalProject"]);

  return (
    <form onSubmit={handleSubmit(handleSave)} style={{ padding: 25 }}>
      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={6}>
          {!isSignalProject && (
            <ControlledTextInput
              autoFocus
              variant="standard"
              fullWidth
              id="project_name"
              label="Project name"
              name="projectName"
              control={control}
              error={!!errors?.projectName}
              helperText={errors?.projectName?.message}
            />
          )}
          {isSignalProject && (
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
                    signalType={"TRAFFIC"}
                    socrataEndpoint={SOCRATA_ENDPOINT}
                    isOptionEqualToValue={getSignalOptionSelected}
                    getOptionLabel={getSignalOptionLabel}
                    textInputOptions={{ variant: "standard" }}
                  />
                )}
              />
            </Box>
          )}
          <ControlledTextInput
            variant="standard"
            fullWidth
            id="secondary_name"
            name="projectSecondaryName"
            label="Secondary name"
            control={control}
            error={!!errors?.projectSecondaryName}
            helperText={errors?.projectSecondaryName?.message}
          />
        </Grid>
        <Grid item xs={3}>
          <InputLabel>Use signal asset</InputLabel>
          <Controller
            name="isSignalProject"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                control={
                  <Switch
                    variant="standard"
                    type="checkbox"
                    color="primary"
                    checked={value}
                    onChange={onChange}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                }
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={6}>
          <ControlledTextInput
            variant="standard"
            fullWidth
            id="description"
            name="description"
            label="Description"
            size="small"
            control={control}
            error={!!errors?.description}
            helperText={errors?.description?.message}
          />
        </Grid>
      </Grid>
      <Box
        pt={2}
        pl={2}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <ProjectSaveButton
          label={"Create"}
          loading={loading}
          success={success}
          buttonOptions={{
            type: "submit",
            disabled: !isDirty || !isValid || loading,
          }}
        />
      </Box>
    </form>
  );
};

export default DefineProjectForm;
