import React, { useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import {
  Grid,
  Icon,
  Box,
  Typography,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import ProjectStatusBadge from "./ProjectStatusBadge";
import { useMutation } from "@apollo/client";
import { UPDATE_PROJECT_NAMES_QUERY } from "../../../queries/project";

const useStyles = makeStyles((theme) => ({
  editIcons: {
    cursor: "pointer",
    marginTop: "16px",
    fontSize: "2rem",
  },
  projectNameEditField: {
    "font-size": "1.5rem",
    "font-weight": "bold",
  },
  projectSecondaryNameEditField: {
    "font-size": "1.0rem",
    "font-weight": "bold",
    "padding-top": "0.95rem",
  },
}));

const ProjectNameComplex = (props) => {
  const classes = useStyles();

  // indicates that the primary title isn't valid via the error state on the input field
  const [primaryTitleError, setPrimaryTitleError] = useState(false);

  const DEFAULT_SNACKBAR_STATE = {
    open: false,
    message: null,
    severity: "success",
  };

  // used to control the snackbar's contents and visibility
  const [snackbarState, setSnackbarState] = useState(DEFAULT_SNACKBAR_STATE);

  // apollo hook returning the async function to update the project names
  const [updateProjectNames] = useMutation(UPDATE_PROJECT_NAMES_QUERY);

  // this function is fired when the user clicks on the check mark to save the names
  const handleAcceptClick = (e) => {
    e.preventDefault();

    const projectName = document.getElementById("project_name").value;
    const secondaryName = document.getElementById("secondary_name").value;

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
    const projectName = document.getElementById("project_name").value;
    if (!projectName) {
      setPrimaryTitleError(true);
    } else {
      setPrimaryTitleError(false);
    }
  };

  // this is fired when the snackbar's close button is clicked or by timeout
  const handleSnackbarClose = (event, reason) => {
    setSnackbarState(DEFAULT_SNACKBAR_STATE);
  };

  // Because the layout is non-trivially different between view and edit modes,
  // we're going to use two different JSX blocks to render the component's content.
  const viewModeJSX = (
    <>
      {/* This grid contains two 12-column wide grid items, forcing the secondary name to flow to
      the next line. Block elements must be avoided, as they prevent the project number and status
      badge and project number from floating left up to the project name which 
      of variable, unknown width. */}
      <Grid container>
        <Grid item xs={12}>
          <Box sx={{ display: "inline", cursor: "pointer" }}>
            <Typography
              color="textPrimary"
              variant="h2"
              sx={{ display: "inline" }}
              onClick={() => props.setIsEditing(true)}
            >
              {props.projectData.project_name}
            </Typography>
          </Box>

          {/* Padding, not margin, must be used, or else you'll run into trouble with the 12 column 
          system always reflowing to the next line. */}
          <Box sx={{ display: "inline", paddingLeft: "10px" }}>
            <Typography
              color="textSecondary"
              variant="h2"
              sx={{ display: "inline" }}
            >
              #{props.projectId}
            </Typography>
          </Box>

          {/* Jogging this up 5 a bit to make it visually centered along the horizontal 
          midline of the project name. */}
          <Box sx={{ display: "inline", position: "relative", top: "-5px" }}>
            <ProjectStatusBadge
              phaseKey={props.currentPhase?.phase_key}
              phaseName={props.currentPhase?.phase_name}
            />
          </Box>
        </Grid>

        {/* The secondary name field is shown conditionally, only if it is defined and not the 
        empty string.  This prevents it from taking up height if it's not displaying anything. */}
        {props.projectData.project_name_secondary &&
        props.projectData.project_name_secondary.length > 0 ? (
          <Grid item xs={12}>
            <Box sx={{ display: "inline", cursor: "pointer" }}>
              <Typography
                color="textSecondary"
                variant="h2"
                sx={{ display: "inline", fontSize: "1.2rem" }}
                onClick={() => props.setIsEditing(true)}
              >
                {props.projectData.project_name_secondary}
              </Typography>
            </Box>
          </Grid>
        ) : null}
      </Grid>
    </>
  );

  const editModeJSX = (
    <>
      {/* This grid contains the project name and secondary name fields, the accept/cancel icons 
      and the badge.  Multiple widths are set for each element so that they reflow responsively 
      as the viewport becomes more narrow. */}
      <Grid container>
        {/* Primary project name field */}
        <Grid item xs={12} sm={6} sx={{ paddingRight: "30px" }}>
          <TextField
            variant="standard"
            fullWidth
            id="project_name"
            label={"Project Name"}
            type="text"
            defaultValue={props.projectData.project_name}
            error={primaryTitleError}
            placeholder={
              primaryTitleError ? "Title cannot be blank" : "Enter project name"
            }
            multiline={false}
            rows={1}
            onChange={(e) => handleProjectNameChange(e)}
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
        <Grid item xs={12} sm={3} sx={{ paddingRight: "30px" }}>
          <TextField
            variant="standard"
            fullWidth
            id="secondary_name"
            label={"Secondary Name"}
            type="text"
            defaultValue={props.projectData.project_name_secondary}
            placeholder={"Project Byline"}
            multiline={false}
            rows={1}
            onChange={(e) => handleProjectNameChange(e)}
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
          <Box sx={{ display: "inline", position: "relative", top: "5px" }}>
            <ProjectStatusBadge
              phaseKey={props.currentPhase?.phase_key}
              phaseName={props.currentPhase?.phase_name}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );

  const commonJSX = (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarState.open}
        onClose={handleSnackbarClose}
        key={"datatable-snackbar"}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarState.severity}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </>
  );

  return (
    <>
      {props.isEditing ? editModeJSX : viewModeJSX}
      {commonJSX}
    </>
  );
};

export default ProjectNameComplex;
