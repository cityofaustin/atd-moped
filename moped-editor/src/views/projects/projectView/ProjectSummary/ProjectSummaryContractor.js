import React, { useState } from "react";
import {
  Box,
  Grid,
  Icon,
  TextField,
  Typography,
} from "@material-ui/core";

import ProjectSummaryLabel from "./ProjectSummaryLabel";

import {
  PROJECT_UPDATE_CONTACTOR,
  PROJECT_CLEAR_CONTACTOR,
} from "../../../../queries/project";
import { useMutation } from "@apollo/client";
import { OpenInNew } from "@material-ui/icons";

/**
 * ProjectSummaryContractor Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @param {function} snackbarHandle - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryContractor = ({
  projectId,
  data,
  refetch,
  classes,
  snackbarHandle,
}) => {
  // Instantiate Original Value
  const [originalValue, setOriginalValue] = useState(
    data?.moped_project?.[0]?.contractor ?? null
  );
  const [editMode, setEditMode] = useState(false);
  const [contractor, setContractor] = useState(originalValue);
  const [updateProjectContractor] = useMutation(PROJECT_UPDATE_CONTACTOR);
  const [clearProjectContractor] = useMutation(PROJECT_CLEAR_CONTACTOR);

  /**
   * Resets the project contractor to original value
   */
  const handleProjectContractorClose = () => {
    setContractor(originalValue);
    setEditMode(false);
  };

  /**
   * Saves the new project contractor...
   */
  const handleProjectContractorSave = () => {
    const isEmpty = (contractor ?? "").length === 0;

    (isEmpty
      ? clearProjectContractor({
          variables: {
            projectId: projectId,
          },
        })
      : updateProjectContractor({
          variables: {
            projectId: projectId,
            contractor: contractor,
          },
        })
    )
      .then(() => {
        setEditMode(false);
        refetch();
        snackbarHandle(true, "Project contractor updated!", "success");
      })
      .catch(err => {
        snackbarHandle(
          true,
          "Failed to update contractor: " + String(err),
          "error"
        );
        handleProjectContractorClose();
      });

    setEditMode(false);
  };

  /**
   * Updates the state of the contractor value
   * @param {Object} e - Event object
   */
  const handleProjectContractorChange = e => {
    setContractor(e.target.value);
  };

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>
        Contractor/contract
      </Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
        {editMode && (
          <>
            <TextField
              fullWidth
              id="moped-project-website"
              label={null}
              onChange={handleProjectContractorChange}
              value={contractor}
            />
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectContractorSave}
            >
              check
            </Icon>
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectContractorClose}
            >
              close
            </Icon>
          </>
        )}
        {!editMode && (
          <ProjectSummaryLabel
            text={(contractor ?? "").length > 0 ? contractor : "None"}
            classes={classes}
            onClickEdit={() => setEditMode(true)}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryContractor;
