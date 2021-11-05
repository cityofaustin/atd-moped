import React, { useState } from "react";
import {
  Box,
  Grid,
  Icon,
  Link,
  TextField,
  Typography,
} from "@material-ui/core";

import ProjectSummaryLabel from "./ProjectSummaryLabel";

import { PROJECT_UPDATE_DESCRIPTION } from "../../../../queries/project";
import { useMutation } from "@apollo/client";
import { OpenInNew } from "@material-ui/icons";

/**
 * ProjectSummaryProjectDescription Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @param {function} snackbarHandle - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryProjectDescription = ({
  projectId,
  data,
  refetch,
  classes,
  snackbarHandle,
}) => {
  const originalDescription =
    data?.moped_project?.[0]?.project_description ?? null;

  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState(originalDescription);

  const [updateProjectDescription] = useMutation(PROJECT_UPDATE_DESCRIPTION);

  /**
   * Resets the project website to original value
   */
  const handleProjectDescriptionClose = () => {
    setDescription(originalDescription);
    setEditMode(false);
  };

  /**
   * Saves the new project website...
   */
  const handleProjectDescriptionSave = () => {
    updateProjectDescription({
      variables: {
        projectId: projectId,
        description: description,
      },
    })
      .then(() => {
        setEditMode(false);
        refetch();
        snackbarHandle(true, "Project description updated.", "success");
      })
      .catch(err => {
        snackbarHandle(
          true,
          "Failed to update project website: " + String(err),
          "error"
        );
        handleProjectDescriptionClose();
      });
    setEditMode(false);
  };

  /**
   * Updates the state of website
   * @param {Object} e - Event object
   */
  const handleProjectDescriptionChange = e => {
    setDescription(e.target.value);
  };

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>Project description</Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
        {editMode && (
          <>
            <TextField
              fullWidth
              multiline={true}
              rows={4}
              id="moped-project-website"
              label={null}
              onChange={handleProjectDescriptionChange}
              value={description}
            />
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectDescriptionSave}
            >
              check
            </Icon>
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectDescriptionClose}
            >
              close
            </Icon>
          </>
        )}
        {!editMode && (
          <ProjectSummaryLabel
            text={description || "None"}
            classes={classes}
            onClickEdit={() => setEditMode(true)}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryProjectDescription;
