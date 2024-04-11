import React, { useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Snackbar, Alert } from "@mui/material";

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

  const DEFAULT_SNACKBAR_STATE = {
    open: false,
    message: null,
    severity: "success",
  };

  // used to control the snackbar's contents and visibility
  const [snackbarState, setSnackbarState] = useState(DEFAULT_SNACKBAR_STATE);

  // this is fired when the snackbar's close button is clicked or by timeout
  const handleSnackbarClose = (event, reason) => {
    setSnackbarState(DEFAULT_SNACKBAR_STATE);
  };

  return (
    <>
      {props.isEditing ? (
        <ProjectNameForm
          classes={classes}
          setSnackbarState={setSnackbarState}
          DEFAULT_SNACKBAR_STATE={DEFAULT_SNACKBAR_STATE}
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
