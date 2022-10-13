import React, { useEffect, useState } from "react";
import { Box, Grid, Icon, TextField, Typography } from "@material-ui/core";

import ProjectSummaryLabel from "./ProjectSummaryLabel";

import {
  PROJECT_UPDATE_WORK_ASSIGNMENT_ID,
  PROJECT_CLEAR_WORK_ASSIGNMENT_ID,
} from "../../../../queries/project";
import { useMutation } from "@apollo/client";

/**
 * ProjectSummaryWorkAssignmentID Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @param {function} snackbarHandle - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryWorkAssignmentID = ({
  projectId,
  data,
  refetch,
  classes,
  snackbarHandle,
}) => {
  // Instantiate Original Value
  const [originalValue, setOriginalValue] = useState(
    data?.moped_project?.[0]?.work_assignment_id ?? ""
  );
  const [editMode, setEditMode] = useState(false);
  const [projectWorkAssignmentID, setProjectWorkAssignmentID] = useState(
    originalValue
  );
  const [updateWorkAssignmentID] = useMutation(
    PROJECT_UPDATE_WORK_ASSIGNMENT_ID
  );
  const [clearWorkAssignmentID] = useMutation(
    PROJECT_CLEAR_WORK_ASSIGNMENT_ID
  );

  // Track changes in data
  useEffect(() => {
    const newVal = data?.moped_project?.[0]?.work_assignment_id ?? "";
    setOriginalValue(newVal);
    setProjectWorkAssignmentID(newVal);
  }, [data]);

  /**
   * Resets the project order number to original value
   */
  const handleWorkAssignmentIDClose = () => {
    setProjectWorkAssignmentID(originalValue);
    setEditMode(false);
  };

  /**
   * Saves the new project order number...
   */
  const handleWorkAssignmentIDSave = () => {
    const isEmpty = projectWorkAssignmentID.trim().length === 0;

    (isEmpty
      ? clearWorkAssignmentID({
          variables: {
            projectId: projectId,
          },
        })
      : updateWorkAssignmentID({
          variables: {
            projectId: projectId,
            work_assignment_id: projectWorkAssignmentID,
          },
        })
    )
      .then(() => {
        setEditMode(false);
        refetch();
        snackbarHandle(
          true,
          "Project work assignment ID updated!",
          "success"
        );
      })
      .catch(err => {
        snackbarHandle(
          true,
          "Failed to update work assignment ID: " + String(err),
          "error"
        );
        handleWorkAssignmentIDClose();
      });

    setEditMode(false);
  };

  /**
   * Updates the state of the work assignmentID number value
   * @param {Object} e - Event object
   */
  const handleWorkAssignmentIDChange = e => {
    setProjectWorkAssignmentID(e.target.value);
  };

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>Work assignment ID</Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
        {editMode && (
          <>
            <TextField
              fullWidth
              id="moped-project-work-assignment"
              label={null}
              onChange={handleWorkAssignmentIDChange}
              value={projectWorkAssignmentID}
            />
            <Icon
              className={classes.editIconConfirm}
              onClick={handleWorkAssignmentIDSave}
            >
              check
            </Icon>
            <Icon
              className={classes.editIconConfirm}
              onClick={handleWorkAssignmentIDClose}
            >
              close
            </Icon>
          </>
        )}
        {!editMode && (
          <ProjectSummaryLabel
            text={
              projectWorkAssignmentID.length > 0
                ? projectWorkAssignmentID
                : ""
            }
            classes={classes}
            onClickEdit={() => setEditMode(true)}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryWorkAssignmentID;
