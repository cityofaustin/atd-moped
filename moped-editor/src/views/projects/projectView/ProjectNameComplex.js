import React, { useState, useEffect } from "react";
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
    marginTop: "32px",
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

const ProjectNameComplex = (props) => {
  const classes = useStyles();

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

  // this is fired when the snackbar's close button is clicked or by timeout
  const handleSnackbarClose = (event, reason) => {
    setSnackbarState(DEFAULT_SNACKBAR_STATE);
  };

  // Because the layout is non-trivially different between view and edit modes,
  // we're going to use two different JSX blocks to render the component's content.

  return (
    <>
      {props.isEditing ? (
        <EditMode
          projectName={projectName}
          primaryTitleError={primaryTitleError}
          handleProjectNameChange={handleProjectNameChange}
          secondaryName={secondaryName}
          handleSecondaryNameChange={handleSecondaryNameChange}
          handleAcceptClick={handleAcceptClick}
          handleCancelClick={handleCancelClick}
          classes={classes}
          props={props}
        />
      ) : (
        <ViewMode
          projectData={props.projectData}
          setIsEditing={props.setIsEditing}
          projectId={props.projectId}
          currentPhase={props.currentPhase}
        />
      )}
      <CommonJSX
        snackbarState={snackbarState}
        handleSnackbarClose={handleSnackbarClose}
      />
    </>
  );
};

export default ProjectNameComplex;

const CommonJSX = ({ snackbarState, handleSnackbarClose }) => (
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
);

const EditMode = ({
  projectName,
  primaryTitleError,
  handleProjectNameChange,
  secondaryName,
  handleSecondaryNameChange,
  handleAcceptClick,
  handleCancelClick,
  classes,
  props,
}) => (
  <Grid container>
    {/* Primary project name field */}
    <Grid item xs={12} sm={6} sx={{ paddingRight: "30px" }}>
      <form onSubmit={(e) => handleAcceptClick(e)}>
        <TextField
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
      <Icon className={classes.editIcons} onClick={(e) => handleAcceptClick(e)}>
        check
      </Icon>
      <Icon className={classes.editIcons} onClick={(e) => handleCancelClick(e)}>
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

const ViewMode = ({ projectData, setIsEditing, projectId, currentPhase }) => (
  <Grid container>
    <Grid item xs={12}>
      <Box sx={{ position: "relative", top: "0.5rem" }}>
        <Box sx={{ display: "inline", cursor: "pointer" }}>
          <Typography
            color="textPrimary"
            variant="h2"
            sx={{ display: "inline" }}
            onClick={() => setIsEditing(true)}
          >
            {projectData.project_name}
          </Typography>
        </Box>

        {projectData.project_name_secondary &&
        projectData.project_name_secondary.length > 0 ? (
          <Box sx={{ display: "inline", cursor: "pointer" }}>
            <Typography
              color="textPrimary"
              variant="h2"
              sx={{ display: "inline" }}
              onClick={() => setIsEditing(true)}
            >
              &nbsp;- {projectData.project_name_secondary}
            </Typography>
          </Box>
        ) : null}

        <Box sx={{ display: "inline", paddingLeft: "10px" }}>
          <Typography
            color="textSecondary"
            variant="h2"
            sx={{ display: "inline" }}
          >
            #{projectId}
          </Typography>
        </Box>

        <Box sx={{ display: "inline", position: "relative", top: "-0.4rem" }}>
          <ProjectStatusBadge
            phaseKey={currentPhase?.phase_key}
            phaseName={currentPhase?.phase_name}
          />
        </Box>
      </Box>
    </Grid>
  </Grid>
);
