import React from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, FormControlLabel, Grid, Switch } from "@mui/material";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import { agolValidation } from "src/constants/projects";
import KnackComponentAutocomplete from "src/views/projects/projectView/ProjectComponents/KnackComponentAutocomplete";
import ProjectSaveButton from "src/views/projects/newProjectView/ProjectSaveButton";
import * as yup from "yup";

import {
  getSignalOptionLabel,
  getSignalOptionSelected,
  SOCRATA_ENDPOINT,
} from "src/utils/signalComponentHelpers";

const validationSchema = yup.object().shape({
  projectName: yup.string().nullable().optional().when("isSignalProject", {
    is: false,
    then: agolValidation.projectName,
  }),
  projectSecondaryName: agolValidation.projectSecondaryName,
  description: agolValidation.description,
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
    <Box
      component="form"
      onSubmit={handleSubmit(handleSave)}
      sx={{ paddingX: 9, paddingY: 9 }}
    >
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item sm={6} xs={12}>
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
              )}
            </Grid>
            <Grid item sm={6} xs={12} alignContent="flex-end">
              <Controller
                name="isSignalProject"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    label="Use signal asset"
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
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item sm={6} xs={12}>
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
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item sm={6} xs={12}>
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
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 8,
          marginRight: 1,
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
    </Box>
  );
};

export default DefineProjectForm;
