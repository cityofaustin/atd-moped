import React, { useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import {
  Box,
  Grid,
  Icon,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { Alert } from "@mui/material";
import { UPDATE_SECONDARY_PROJECT_NAME_QUERY } from "../../../queries/project";

/**
 * GridTable Style
 */
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  titleDisplayField: {
    display: "flex",
    cursor: "pointer",
  },
  titleEditField: {
    "margin-top": "2px",
    "font-size": "1.0rem",
    "font-weight": "bold",
    "min-height": "2rem",
  },
  boxField: {
    width: "100%",
  },
  titleId: {
    alignSelf: "center",
  },
}));

const ProjectSecondaryNameEditable = (props) => {
  const classes = useStyles();

  const DEFAULT_SNACKBAR_STATE = {
    open: false,
    message: null,
    severity: "success",
  };

  const initialProjectSecondaryName = props?.projectSecondaryName;
  const [projectSecondaryName, setProjectSecondaryName] = useState(initialProjectSecondaryName);
  const [projectSecondaryNameBeforeEdit, setProjectSecondaryNameBeforeEdit] =
    useState(projectSecondaryName);
  const [isEditing, setIsEditing] = useState(props?.isEditing ?? false);
  const [snackbarState, setSnackbarState] = useState(DEFAULT_SNACKBAR_STATE);
  const [titleError, setTitleError] = useState(false);

  if (props?.isEditing && !isEditing) {
    setIsEditing(true);
  }

  const [updateProjectSecondaryName] = useMutation(UPDATE_SECONDARY_PROJECT_NAME_QUERY);


  const handleProjectSecondaryNameChange = (e) => {
    if (titleError) {
      setTitleError(false);
    }
    setProjectSecondaryName(e.target.value);
  };

  /**
   * Makes the update via GraphQL
   */
  const handleAcceptClick = (e) => {
    e.preventDefault();
    if (!(projectSecondaryName.trim() === "")) {
      updateProjectSecondaryName({
        variables: {
          projectId: props?.projectId,
          projectSecondaryName: projectSecondaryName,
        },
      })
        .then((res) => {
          setProjectSecondaryNameBeforeEdit(projectSecondaryName);
          setSnackbarState({
            open: true,
            message: <span>Success! the project byline has been updated!</span>,
            severity: "success",
          });
        })
        .catch((err) => {
          setProjectSecondaryName(projectSecondaryNameBeforeEdit);
          setSnackbarState({
            open: true,
            message: (
              <span>There was a problem updating the project byline.</span>
            ),
            severity: "error",
          });
          setProjectSecondaryName(initialProjectSecondaryName);
        })
        .finally(() => {
          if (props?.setIsEditing) props.setIsEditing(false);
          setIsEditing(false);
          setTimeout(() => setSnackbarState(DEFAULT_SNACKBAR_STATE), 3000);
          props.updatedCallback();
        });
    } else {
      setTitleError(true);
    }
  };

  /**
   * Handles closing the edit mode
   * @param {ChangeEvent} e - HTML DOM Event
   */
  const handleCancelClick = (e) => {
    e.preventDefault();
    if (props?.setIsEditing) props.setIsEditing(false);
    setIsEditing(false);
    setProjectSecondaryName(projectSecondaryNameBeforeEdit);
  };

  const handleSnackbarClose = () => {
    setSnackbarState(DEFAULT_SNACKBAR_STATE);
  };

  return (
    <Box className={isEditing ? classes.boxField : null}>
      {isEditing && (
        <form onSubmit={(e) => handleAcceptClick(e)}>
          <Grid container>
            <Grid item xs={12} sm={11}>
              <TextField
                variant="standard"
                fullWidth
                autoFocus
                id="project secondary name"
                label={"Secondary Name"}
                type="text"
                defaultValue={projectSecondaryName ?? props?.projectName}
                error={titleError}
                placeholder={
                  titleError ? "Title cannot be blank" : "Enter project name" // ! FIXME
                }
                multiline={false}
                rows={1}
                onChange={(e) => handleProjectSecondaryNameChange(e)}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  classes: {
                    input: classes.titleEditField,
                  },
                }}
              />
            </Grid>
          </Grid>
        </form>
      )}
      {
        // if not Editing Project Name, clicking on project title allows one to edit
        !isEditing && (
          <span className={classes.titleDisplayField}>
            <Typography
              color="textPrimary"
              variant="h2"
              onClick={() => setIsEditing(true)}
            >
              {projectSecondaryName}
            </Typography>
          </span>
        )
      }
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
    </Box>
  );
};

export default ProjectSecondaryNameEditable;
