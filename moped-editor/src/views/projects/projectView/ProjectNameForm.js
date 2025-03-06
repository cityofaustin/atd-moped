import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { Box, Grid, Icon, IconButton } from "@mui/material";

import ProjectStatusBadge from "src/views/projects/projectView/ProjectStatusBadge";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import { UPDATE_PROJECT_NAMES_QUERY } from "src/queries/project";
import { agolFieldCharMax } from "src/constants/projects";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

/**
 * This validation schema considers the total number of characters allowed in the project full name
 * field in the component_arcgis_online_view feature service. This schema splits that limit in half
 * to allow equal space for the primary and secondary name fields.
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
});

const useStyles = makeStyles(() => ({
  editIcons: {
    cursor: "pointer",
    fontSize: "1.4rem",
  },
  projectNameEditField: {
    "font-size": "1.4rem",
    "font-weight": "bold",
  },
  projectSecondaryNameEditField: {
    "font-size": "1.4rem",
    "font-weight": "bold",
  },
}));

/**
 * ProjectNameForm Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} projectData - The data object from the GraphQL query
 * @param {Function} setIsEditing - The function to toggle the editing boolean state
 * @param {Function} handleSnackbar - The function to show the snackbar
 * @param {Object} currentPhase - The current phase data object
 * * @param {function} refetch - The refetch function from Apollo
 * @returns
 */
const ProjectNameForm = ({
  projectId,
  projectData,
  setIsEditing,
  handleSnackbar,
  currentPhase,
  refetch,
}) => {
  const classes = useStyles();

  const originalName = projectData?.project_name ?? null;
  const originalSecondaryName = projectData?.project_name_secondary ?? null;

  const [updateProjectNames] = useMutation(UPDATE_PROJECT_NAMES_QUERY);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: originalName,
      projectSecondaryName: originalSecondaryName,
    },
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  // this function is fired when the user clicks on the check mark to save the names
  const handleSave = ({ projectName, projectSecondaryName }) => {
    // and if it passes the test, clear any error state and save it via a mutation
    updateProjectNames({
      variables: {
        projectId: projectId,
        projectName: projectName,
        projectNameSecondary: projectSecondaryName,
      },
    })
      .then(() => {
        // return to the view mode and alert the parent component of the change
        refetch().then(() => {
          setIsEditing(false);
          handleSnackbar(true, "Project name(s) updated", "success");
        });
      })
      .catch((error) => {
        handleSnackbar(true, "Error updating project name(s)", "error", error);
      });
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <>
      <Box
        component="form"
        sx={{ minWidth: "100%" }}
        onSubmit={handleSubmit(handleSave)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <ControlledTextInput
              autoFocus
              variant="standard"
              fullWidth
              id="project_name"
              label="Project name"
              name="projectName"
              placeholder="Enter project name"
              control={control}
              error={errors?.projectName}
              helperText={errors?.projectName?.message}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                classes: {
                  input: classes.projectNameEditField,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <ControlledTextInput
              variant="standard"
              fullWidth
              autoFocus
              id="secondary_name"
              name="projectSecondaryName"
              placeholder="Secondary name"
              label="Secondary name"
              control={control}
              error={errors?.projectSecondaryName}
              helperText={errors?.projectSecondaryName?.message}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                classes: {
                  input: classes.projectSecondaryNameEditField,
                },
              }}
            />
          </Grid>
          {/* Minimum width prevents icons from wrapping. */}
          <Grid
            item
            container
            direction="row"
            alignItems="flex-end"
            xs={12}
            sm={1}
            sx={(theme) => ({
              minWidth: theme.spacing(12),
            })}
          >
            <IconButton type="submit">
              <Icon className={classes.editIcons}>check</Icon>
            </IconButton>
            <IconButton>
              <Icon
                className={classes.editIcons}
                onClick={(e) => handleCancelClick(e)}
              >
                close
              </Icon>
            </IconButton>
          </Grid>
          <Grid item xs={12} sm={3} container alignItems="flex-end">
            <ProjectStatusBadge
              phaseKey={currentPhase?.phase_key}
              phaseName={currentPhase?.phase_name}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProjectNameForm;
