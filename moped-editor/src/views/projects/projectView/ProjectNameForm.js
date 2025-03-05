import React, { useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Box, Grid, Icon, TextField } from "@mui/material";
import ProjectStatusBadge from "./ProjectStatusBadge";
import ControlledTextInput from "src/components/forms/ControlledTextInput";
import { useMutation } from "@apollo/client";
import { UPDATE_PROJECT_NAMES_QUERY } from "../../../queries/project";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { agolFieldCharMax } from "src/constants/projects";

/**
 * This validation schema considers the total number of characters allowed in the project full name
 * field in the component_arcgis_online_view feature service. This schema splits that limit in half
 * to allow equal space for the primary and secondary name fields.
 */
const validationSchema = yup.object().shape({
  projectName: yup
    .string()
    .max(
      agolFieldCharMax.descriptionString,
      `Name must be ${agolFieldCharMax.projectNameFull / 2} characters or less`
    )
    .nullable()
    .required("Title cannot be blank"),
  projectSecondaryName: yup
    .string()
    .max(
      agolFieldCharMax.descriptionString,
      `Secondary name must be ${
        agolFieldCharMax.projectNameFull / 2
      } characters or less`
    )
    .nullable(),
});

const useStyles = makeStyles((theme) => ({
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
 * @param {Function} updatedCallback - The function to call when project named are updated
 * @param {Function} handleSnackbar - The function to show the snackbar
 * @param {Object} currentPhase - The current phase data object
 * @returns
 */
const ProjectNameForm = ({
  projectId,
  projectData,
  setIsEditing,
  updatedCallback,
  handleSnackbar,
  currentPhase,
}) => {
  /* New forms */
  const originalName = projectData?.project_name ?? null;
  const originalSecondaryName = projectData?.project_name_secondary ?? null;

  const {
    handleSubmit,
    control,
    setValue,
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
  const handleSave = (e) => {
    e.preventDefault();

    // Check if the primary name is defined and has meaningful content
    if (!projectName || projectName.trim() === "") {
      // if it does not, set the error state
      setPrimaryTitleError(true);
    } else {
      // and if it passes the test, clear any error state and save it via a mutation
      setPrimaryTitleError(false);
      updateProjectNames({
        variables: {
          projectId: projectId,
          projectName: projectName,
          projectNameSecondary: secondaryName,
        },
      })
        .then((res) => {
          // return to the view mode and alert the parent component of the change
          setIsEditing(false);
          updatedCallback();
          handleSnackbar(true, "Project name(s) updated", "success");
        })
        .catch((error) => {
          handleSnackbar(
            true,
            "Error updating project name(s)",
            "error",
            error
          );
        });
    }
  };

  /* End new form */

  const classes = useStyles();

  // state to hold values for controlled inputs
  const [projectName, setProjectName] = useState(projectData.project_name);
  const [secondaryName, setSecondaryName] = useState(
    projectData.project_name_secondary
  );

  // indicates that the primary title isn't valid via the error state on the input field
  const [primaryTitleError, setPrimaryTitleError] = useState(false);

  // apollo hook returning the async function to update the project names
  const [updateProjectNames] = useMutation(UPDATE_PROJECT_NAMES_QUERY);

  // this function is fired when the user clicks on the check mark to save the names
  const handleAcceptClick = (e) => {
    e.preventDefault();

    // Check if the primary name is defined and has meaningful content
    if (!projectName || projectName.trim() === "") {
      // if it does not, set the error state
      setPrimaryTitleError(true);
    } else {
      // and if it passes the test, clear any error state and save it via a mutation
      setPrimaryTitleError(false);
      updateProjectNames({
        variables: {
          projectId: projectId,
          projectName: projectName,
          projectNameSecondary: secondaryName,
        },
      })
        .then((res) => {
          // return to the view mode and alert the parent component of the change
          setIsEditing(false);
          updatedCallback();
          handleSnackbar(true, "Project name(s) updated", "success");
        })
        .catch((error) => {
          handleSnackbar(
            true,
            "Error updating project name(s)",
            "error",
            error
          );
        });
    }
  };

  // this is fired when the user clicks on the 'X' to cancel the edit
  const handleCancelClick = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  // this is fired onChange of the project name field to check if it's valid
  const handleProjectNameChange = (e) => {
    // Update the state variables when the input changes
    setProjectName(e.target.value);
    if (!e.target.value) {
      setPrimaryTitleError(true);
    } else {
      setPrimaryTitleError(false);
    }
  };

  // Update the secondary name state variable when the input changes
  const handleSecondaryNameChange = (e) => {
    // If user entered an empty string then nullify the value
    const value = e.target.value.trim() === "" ? null : e.target.value;
    setSecondaryName(value);
  };

  return (
    <>
      <Box
        component="form"
        sx={{ minWidth: "100%" }}
        onSubmit={handleSubmit(handleSave)}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            {/* Primary project name field */}

            <ControlledTextInput
              autoFocus
              variant="standard"
              fullWidth
              id="project_name"
              label="Project name"
              name="projectName"
              placeholder="Enter project name"
              control={control}
              error={errors?.name}
              helperText={errors?.description?.message}
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

          {/* Secondary project name field */}
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
              error={errors?.description}
              helperText={errors?.description?.message}
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

          {/* Accept / Cancel icons.
      This grid item gets a minimum width to prevent it from reflowing onto two lines. */}
          <Grid
            item
            container
            direction="row"
            alignItems="flex-end"
            xs={12}
            sm={1}
            sx={(theme) => ({
              minWidth: theme.spacing(10),
            })}
          >
            <Icon
              className={classes.editIcons}
              onClick={(e) => handleAcceptClick(e)}
            >
              check
            </Icon>
            <Icon
              className={classes.editIcons}
              onClick={(e) => handleCancelClick(e)}
            >
              close
            </Icon>
          </Grid>

          {/* The status badge. Here, we're going to jog it down a bit to make it visually centered
      along the horizontal midline of the project name input field. */}
          <Grid item xs={12} sm={2} container alignItems="flex-end">
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
