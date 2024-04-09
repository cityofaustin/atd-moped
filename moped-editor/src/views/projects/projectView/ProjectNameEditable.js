import React, { useState, useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Snackbar, Alert } from "@mui/material";
import { useMutation } from "@apollo/client";
import { UPDATE_PROJECT_NAMES_QUERY } from "../../../queries/project";
import ProjectNameForm from "./ProjectNameForm";
import ProjectName from "./ProjectName";

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

const ProjectNameEditable = (props) => {
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
          projectNameSecondary: secondaryName.length > 0 ? secondaryName : null,
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

  return (
    <>
      {props.isEditing ? (
        <ProjectNameForm
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
        <ProjectName
          projectData={props.projectData}
          setIsEditing={props.setIsEditing}
          projectId={props.projectId}
          currentPhase={props.currentPhase}
        />
      )}
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
};

export default ProjectNameEditable;
