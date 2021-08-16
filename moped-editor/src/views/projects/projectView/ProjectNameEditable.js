import React, { useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Grid, Icon, Snackbar, TextField, Typography } from "@material-ui/core";
import { gql, useMutation } from "@apollo/client";
import { Alert } from "@material-ui/lab";

/**
 * GridTable Style
 */
const useStyles = makeStyles(theme => ({
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
  titleEditField: {
    "font-size": "1.5rem",
    "font-weight": "bold",
  },
}));

const ProjectNameEditable = props => {
  const classes = useStyles();

  const DEFAULT_SNACKBAR_STATE = {
    open: false,
    message: null,
    severity: "success",
  };

  const initialProjectName = props?.projectName;
  const [showEditIcon, setShowEditIcon] = useState(false);
  const [projectName, setProjectName] = useState(initialProjectName);
  const [projectNameBeforeEdit, setProjectNameBeforeEdit] = useState(
    projectName
  );
  const [isEditing, setIsEditing] = useState(props?.isEditing ?? false);
  const [snackbarState, setSnackbarState] = useState(DEFAULT_SNACKBAR_STATE);
  const [titleError, setTitleError] = useState(false);

  if (props?.isEditing && !isEditing) {
    setIsEditing(true);
  }

  const updateProjectNameQuery = gql`
    mutation UpdateProjectName($projectId: Int!, $projectName: String!) {
      update_moped_project(
        where: { project_id: { _eq: $projectId } }
        _set: { project_name: $projectName }
      ) {
        affected_rows
      }
    }
  `;

  const [updateProjectName] = useMutation(updateProjectNameQuery);

  const handleMouseEnter = () => {
    setShowEditIcon(true);
  };

  const handleMouseLeave = () => {
    setShowEditIcon(false);
  };

  const handleProjectNameChange = e => {
    if (titleError) {
      setTitleError(false)
    }
    setProjectName(e.target.value);
  };

  /**
   * Makes the update via GraphQL
   */
  const handleAcceptClick = e => {
    e.preventDefault();
    if (!projectName.trim()==="") {
    updateProjectName({
      variables: {
        projectId: props?.projectId,
        projectName: projectName,
      },
    })
      .then(res => {
        setProjectNameBeforeEdit(projectName);
        setSnackbarState({
          open: true,
          message: <span>Success! the project name has been updated!</span>,
          severity: "success",
        });
      })
      .catch(err => {
        setProjectName(projectNameBeforeEdit);
        setSnackbarState({
          open: true,
          message: <span>There was a problem updating the project name.</span>,
          severity: "error",
        });
        setProjectName(initialProjectName);
      })
      .finally(() => {
        if (props?.setIsEditing) props.setIsEditing(false);
        setIsEditing(false);
        setTimeout(() => setSnackbarState(DEFAULT_SNACKBAR_STATE), 3000);
      });
    } else {
      setTitleError(true);
    }
  };

  /**
   * Handles closing the edit mode
   * @param {ChangeEvent} e - HTML DOM Event
   */
  const handleCancelClick = e => {
    e.preventDefault();
    if (props?.setIsEditing) props.setIsEditing(false);
    setIsEditing(false);
    setProjectName(projectNameBeforeEdit);
  };

  const handleSnackbarClose = () => {
    setSnackbarState(DEFAULT_SNACKBAR_STATE);
  };

  return (
    <>
      {isEditing && (
        <form onSubmit={e => handleAcceptClick(e)}>
          <Grid container fullWidth>
            <Grid item xs={12} sm={9}>
              <TextField
                fullWidth
                id="project name"
                label={"Project Name"}
                type="text"
                defaultValue={projectName ?? props?.projectName}
                error={titleError}
                placeholder={titleError ? "Title cannot be blank" : "Enter project name"}
                multiline={false}
                rows={1}
                onChange={e => handleProjectNameChange(e)}
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
            <Grid item xs={12} sm={3} className={classes.fieldGridItemButtons}>
              <Icon
                className={classes.editIconConfirm}
                onClick={handleAcceptClick}
              >
                check
              </Icon>
              <Icon
                className={classes.editIconConfirm}
                onClick={e => handleCancelClick(e)}
              >
                close
              </Icon>
            </Grid>
          </Grid>
        </form>
      )}
      { // if not Editing Project Name, show edit icon on mouse over of title
        !isEditing && (
        <Typography
          color="textPrimary"
          variant="h1"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {projectName}
          {showEditIcon && props?.editable && (
            <Icon
              className={classes.editIcon}
              onClick={() => setIsEditing(true)}
            >
              create
            </Icon>
          )}
        </Typography>
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
