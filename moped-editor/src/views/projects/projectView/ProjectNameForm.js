import React, { useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Grid, Icon, TextField } from "@mui/material";
import ProjectStatusBadge from "./ProjectStatusBadge";
import { useMutation } from "@apollo/client";
import { UPDATE_PROJECT_NAMES_QUERY } from "../../../queries/project";

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

const ProjectNameForm = ({ props }) => {
  const classes = useStyles();

  // state to hold values for controlled inputs
  const [projectName, setProjectName] = useState(
    props.projectData.project_name
  );
  const [secondaryName, setSecondaryName] = useState(
    props.projectData.project_name_secondary
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
          projectId: props.projectId,
          projectName: projectName,
          projectNameSecondary: secondaryName,
        },
      })
        .then((res) => {
          // return to the view mode and alert the parent component of the change
          props.setIsEditing(false);
          props.updatedCallback();
          props.handleSnackbar(true, "Project name(s) updated", "success");
        })
        .catch((error) => {
          props.handleSnackbar(
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
    props.setIsEditing(false);
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
    <Grid container spacing={4}>
      {/* Primary project name field */}
      <Grid item xs={12} sm={6}>
        <form onSubmit={(e) => handleAcceptClick(e)}>
          <TextField
            required
            autoFocus
            variant="standard"
            fullWidth
            id="project_name"
            label={"Project name"}
            type="text"
            value={projectName || ""}
            error={primaryTitleError}
            placeholder={
              primaryTitleError ? "Title cannot be blank" : "Enter project name"
            }
            multiline={false}
            rows={1}
            onChange={handleProjectNameChange}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              classes: {
                input: classes.projectNameEditField,
              },
            }}
          />
        </form>
      </Grid>

      {/* Secondary project name field */}
      <Grid item xs={12} sm={3}>
        <form onSubmit={(e) => handleAcceptClick(e)}>
          <TextField
            variant="standard"
            fullWidth
            id="secondary_name"
            label={"Secondary name"}
            type="text"
            value={secondaryName || ""}
            placeholder={"Secondary name"}
            multiline={false}
            rows={1}
            onChange={handleSecondaryNameChange}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              classes: {
                input: classes.projectSecondaryNameEditField,
              },
            }}
          />
        </form>
      </Grid>

      {/* Accept / Cancel icons.
      This grid item gets a minimum width to prevent it from reflowing onto two lines. */}
      <Grid
        item
        container
        direction="row"
        justifyContent="flex-end"
        alignItems="flex-end"
        xs={12}
        sm={1}
        sx={{ minWidth: "77px" }}
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
      <Grid item xs={12} md={2} container alignItems="flex-end">
        <ProjectStatusBadge
          phaseKey={props.currentPhase?.phase_key}
          phaseName={props.currentPhase?.phase_name}
        />
      </Grid>
    </Grid>
  );
};

export default ProjectNameForm;
