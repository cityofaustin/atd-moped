import React from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, FormControlLabel, Grid, InputLabel, Switch } from "@mui/material";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import { agolFieldCharMax } from "src/constants/projects";
import KnackComponentAutocomplete from "src/views/projects/projectView/ProjectComponents/KnackComponentAutocomplete";
import ProjectSaveButton from "src/views/projects/newProjectView/ProjectSaveButton";
import * as yup from "yup";

import {
  getSignalOptionLabel,
  getSignalOptionSelected,
  SOCRATA_ENDPOINT,
} from "src/utils/signalComponentHelpers";

/**
 * This validation schema considers the total number of characters allowed in the project full name
 * field in the component_arcgis_online_view feature service. This schema splits that limit in half
 * to allow equal space for the primary and secondary name fields that make up the full name.
 */
const projectNamesCharMax = agolFieldCharMax.projectNameFull / 2;

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
  isSignal: yup.boolean(),
});

const DefineProjectForm = ({ handleSave, loading, success, classes }) => {
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
    },
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const [isSignal] = watch(["isSignal"]);

  return (
    <form onSubmit={handleSubmit(handleSave)} style={{ padding: 25 }}>
      <Grid container spacing={3} style={{ margin: 20 }}>
        <Grid item xs={6}>
          {!isSignal && ( // if
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
          {isSignal && ( // else
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
          <Controller
            name="isSignal"
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
                // label="Use signal asset"
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
      <Box pt={2} pl={2} className={classes.buttons}>
        <ProjectSaveButton
          label={"Create"}
          loading={loading}
          success={success}
          // handleButtonClick={handleSubmit}
          // TODO: Add type=submit to button
        />
      </Box>
    </form>
  );
};

export default DefineProjectForm;
