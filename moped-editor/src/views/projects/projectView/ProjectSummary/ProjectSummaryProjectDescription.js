import React, { useState } from "react";
import {
  Box,
  Grid,
  Icon,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import ProjectSummaryLabel from "./ProjectSummaryLabel";

import { PROJECT_UPDATE_DESCRIPTION } from "../../../../queries/project";
import { useMutation } from "@apollo/client";

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
  classes,
  snackbarHandle,
  listViewQuery,
}) => {
  const originalDescription =
    data?.moped_project?.[0]?.project_description ?? null;

  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState(originalDescription);

  const [updateProjectDescription] = useMutation(PROJECT_UPDATE_DESCRIPTION);

  /**
   * Resets the project description to original value
   */
  const handleProjectDescriptionClose = () => {
    setDescription(originalDescription);
    setEditMode(false);
  };

  /**
   * Saves the new project description...
   */
  const handleProjectDescriptionSave = () => {
    if (description.trim().length > 0) {
      updateProjectDescription({
        variables: {
          projectId: projectId,
          description: description,
        },
        refetchQueries: [{ query: listViewQuery }, "ProjectSummary"],
      })
        .then((data) => {
          setEditMode(false);
          snackbarHandle(true, "Project description updated.", "success");
        })
        .catch((err) => {
          snackbarHandle(
            true,
            "Failed to update project description: " + String(err),
            "error"
          );
          handleProjectDescriptionClose();
        });
      setEditMode(false);
    } else {
      setDescription(description.trim());
    }
  };

  /**
   * Updates the description state
   * @param {Object} e - Event object
   */
  const handleProjectDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>Description</Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
        flexWrap="nowrap"
        alignItems="center"
      >
        {editMode && (
          <>
            <TextField
              variant="standard"
              autoFocus
              fullWidth
              multiline={true}
              minRows={4}
              error={description.length < 1}
              id="moped-project-description"
              label={null}
              onChange={handleProjectDescriptionChange}
              value={description}
              helperText={
                description.length < 1 ? "Description cannot be blank" : ""
              }
            />

            <IconButton
              onClick={handleProjectDescriptionSave}
              size="large"
              disabled={description.length < 1}
            >
              <Icon>check</Icon>
            </IconButton>

            <IconButton onClick={handleProjectDescriptionClose} size="large">
              <Icon>close</Icon>
            </IconButton>
          </>
        )}
        {!editMode && (
          <ProjectSummaryLabel
            text={description.trim().length > 0 ? description : " - "}
            classes={classes}
            onClickEdit={() => setEditMode(true)}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryProjectDescription;
