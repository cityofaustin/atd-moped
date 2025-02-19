import React, { useState } from "react";
import { Box, Grid, Icon, TextField, Typography } from "@mui/material";

import ProjectSummaryLabel from "./ProjectSummaryLabel";
import {
  removeDecimalsAndTrailingNumbers,
  removeNonIntegers,
} from "src/utils/numberFormatters";
import {
  PROJECT_UPDATE_INTERIM_ID,
  PROJECT_CLEAR_INTERIM_ID,
} from "../../../../queries/project";
import { useMutation } from "@apollo/client";

/**
 * ProjectSummaryInterimID Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @param {function} handleSnackbar - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryInterimID = ({
  projectId,
  data,
  refetch,
  classes,
  handleSnackbar,
}) => {
  // Instantiate Original Value
  const originalValue = data?.moped_project?.[0]?.interim_project_id ?? null;
  const [editMode, setEditMode] = useState(false);
  const [interimId, setInterimId] = useState(originalValue);
  const [updateProjectInterimId] = useMutation(PROJECT_UPDATE_INTERIM_ID);
  const [clearProjectInterimId] = useMutation(PROJECT_CLEAR_INTERIM_ID);

  /**
   * Resets the project interim ID to original value
   */
  const handleProjectInterimIdClose = () => {
    setInterimId(originalValue);
    setEditMode(false);
  };

  /**
   * Saves the new project interim ID...
   */
  const handleProjectInterimIdSave = () => {
    const isEmpty = (interimId ?? "").length === 0;

    (isEmpty
      ? clearProjectInterimId({
          variables: {
            projectId: projectId,
          },
        })
      : updateProjectInterimId({
          variables: {
            projectId: projectId,
            interimProjectId: interimId,
          },
        })
    )
      .then(() => {
        setEditMode(false);
        refetch();
        handleSnackbar(true, "Project interim database ID updated", "success");
      })
      .catch((error) => {
        handleProjectInterimIdClose();
        handleSnackbar(
          true,
          `Error updating project interim database ID`,
          "error",
          error
        );
      });

    setEditMode(false);
  };

  /**
   * Updates the state of the interim id value
   * @param {Object} e - Event object
   */
  const handleProjectInterimIdChange = (e) => {
    const interimValue = e.target.value;
    // remove decimals
    const valueWithoutDecimals = removeDecimalsAndTrailingNumbers(interimValue);
    // Then, remove all non-integers
    const valueWithIntegersOnly = removeNonIntegers(valueWithoutDecimals);
    setInterimId(valueWithIntegersOnly);
  };

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>
        Interim MPD (Access) ID
      </Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
        {editMode && (
          <>
            <TextField
              variant="standard"
              autoFocus
              fullWidth
              id="moped-project-interimID"
              label={null}
              onChange={handleProjectInterimIdChange}
              value={interimId ?? ""}
            />
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectInterimIdSave}
            >
              check
            </Icon>
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectInterimIdClose}
            >
              close
            </Icon>
          </>
        )}
        {!editMode && (
          <ProjectSummaryLabel
            text={interimId ?? ""}
            classes={classes}
            onClickEdit={() => setEditMode(true)}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryInterimID;
