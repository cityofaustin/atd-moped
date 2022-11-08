import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  Box,
  Grid,
  Icon,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { useMutation } from "@apollo/client";
import { Alert } from "@material-ui/lab";
import { UPDATE_PROJECT_NAME_QUERY } from "../../../queries/project";

/**
 * GridTable Style
 */
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  editIcon: {
    cursor: "pointer",
    marginLeft: "8px",
  },
  editIconConfirm: {
    cursor: "pointer",
    marginTop: "16px",
    fontSize: "2rem",
  },
  titleDisplayField: {
    display: "flex",
    cursor: "pointer",
  },
  titleEditField: {
    "font-size": "1.5rem",
    "font-weight": "bold",
  },
  boxField: {
    width: "100%",
  },
}));

const ProjectNameEditable = (props) => {
  const classes = useStyles();

  const DEFAULT_SNACKBAR_STATE = {
    open: false,
    message: null,
    severity: "success",
  };

  const initialProjectName = props?.projectName;
  const [projectName, setProjectName] = useState(initialProjectName);
  const [projectNameBeforeEdit, setProjectNameBeforeEdit] =
    useState(projectName);
  const [isEditing, setIsEditing] = useState(props?.isEditing ?? false);
  const [snackbarState, setSnackbarState] = useState(DEFAULT_SNACKBAR_STATE);
  const [titleError, setTitleError] = useState(false);

  if (props?.isEditing && !isEditing) {
    setIsEditing(true);
  }

  const [updateProjectName] = useMutation(UPDATE_PROJECT_NAME_QUERY);

  const handleProjectNameChange = (e) => {
    if (titleError) {
      setTitleError(false);
    }
    setProjectName(e.target.value);
  };

  /**
   * Makes the update via GraphQL
   */
  const handleAcceptClick = (e) => {
    e.preventDefault();
    if (!(projectName.trim() === "")) {
      updateProjectName({
        variables: {
          projectId: props?.projectId,
          projectName: projectName,
        },
      })
        .then((res) => {
          setProjectNameBeforeEdit(projectName);
          setSnackbarState({
            open: true,
            message: <span>Success! the project name has been updated!</span>,
            severity: "success",
          });
        })
        .catch((err) => {
          setProjectName(projectNameBeforeEdit);
          setSnackbarState({
            open: true,
            message: (
              <span>There was a problem updating the project name.</span>
            ),
            severity: "error",
          });
          setProjectName(initialProjectName);
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
    setProjectName(projectNameBeforeEdit);
  };

  const handleSnackbarClose = () => {
    setSnackbarState(DEFAULT_SNACKBAR_STATE);
  };

  return (
    <Box className={isEditing ? classes.boxField : null}>
      {isEditing && (
        <form onSubmit={(e) => handleAcceptClick(e)}>
          <Grid container fullWidth>
            <Grid item xs={12} sm={11}>
              <TextField
                fullWidth
                autoFocus
                id="project name"
                label={"Project Name"}
                type="text"
                defaultValue={projectName ?? props?.projectName}
                error={titleError}
                placeholder={
                  titleError ? "Title cannot be blank" : "Enter project name"
                }
                multiline={false}
                rows={1}
                onChange={(e) => handleProjectNameChange(e)}
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
            <Grid item xs={12} sm={1} className={classes.fieldGridItemButtons}>
              <Icon
                className={classes.editIconConfirm}
                onClick={handleAcceptClick}
              >
                check
              </Icon>
              <Icon
                className={classes.editIconConfirm}
                onClick={(e) => handleCancelClick(e)}
              >
                close
              </Icon>
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
              variant="h1"
              onClick={() => setIsEditing(true)}
            >
              {projectName}
            </Typography>
            <Typography color="textSecondary" variant="h1">
              &nbsp;#{props.projectId}
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

export default ProjectNameEditable;
