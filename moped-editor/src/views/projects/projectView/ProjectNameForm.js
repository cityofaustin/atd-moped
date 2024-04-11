import React, { useState, useEffect } from "react";
import { Grid, Icon, Box, TextField } from "@mui/material";
import ProjectStatusBadge from "./ProjectStatusBadge";
import { useMutation } from "@apollo/client";
import { UPDATE_PROJECT_NAMES_QUERY } from "../../../queries/project";

const ProjectNameForm = ({
  classes,
  setSnackbarState,
  DEFAULT_SNACKBAR_STATE,
  props,
}) => {
  // state to hold values for controlled inputs
  const [projectName, setProjectName] = useState("");
  const [secondaryName, setSecondaryName] = useState("");

  // update the state variables when the props change
  useEffect(() => {
    setProjectName(props.projectData.project_name || "");
    setSecondaryName(props.projectData.project_name_secondary || "");
  }, [props.projectData]);

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
          // if the mutation is successful, show a success snackbar
          setSnackbarState({
            open: true,
            message: <span>Success! The project names have been updated!</span>,
            severity: "success",
          });
        })
        .catch((error) => {
          // and if it fails, show an error snackbar
          setSnackbarState({
            open: true,
            message: (
              <span>Error. The project names have not been updated.</span>
            ),
            severity: "error",
          });
        })
        .finally(() => {
          // return to the view mode, clear the snackbar after 3 seconds,
          // and alert the parent component of the change
          props.setIsEditing(false);
          setTimeout(() => setSnackbarState(DEFAULT_SNACKBAR_STATE), 3000);
          props.updatedCallback();
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

  const handleSecondaryNameChange = (e) => {
    // Update the secondary name state variable when the input changes
    setSecondaryName(e.target.value);
  };

  return (
    <Grid container>
      {/* Primary project name field */}
      <Grid item xs={12} sm={6} sx={{ paddingRight: "30px" }}>
        <form onSubmit={(e) => handleAcceptClick(e)}>
          <TextField
            required
            autoFocus
            variant="standard"
            fullWidth
            id="project_name"
            label={"Project Name"}
            type="text"
            value={projectName}
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
      <Grid item xs={12} sm={3} sx={{ paddingRight: "25px" }}>
        <form onSubmit={(e) => handleAcceptClick(e)}>
          <TextField
            variant="standard"
            fullWidth
            id="secondary_name"
            label={"Secondary Name"}
            type="text"
            value={secondaryName}
            placeholder={"Secondary Name"}
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
      <Grid item xs={12} sm={1} sx={{ minWidth: "65px" }}>
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
      <Grid item xs={12} md={2}>
        <Box sx={{ display: "inline", position: "relative", top: "1rem" }}>
          <ProjectStatusBadge
            phaseKey={props.currentPhase?.phase_key}
            phaseName={props.currentPhase?.phase_name}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProjectNameForm;
