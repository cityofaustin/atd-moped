import React, { useState } from "react";
import { Box, Grid, Icon, TextField, Typography } from "@material-ui/core";

import ProjectSummaryLabel from "./ProjectSummaryLabel";

import {
  PROJECT_UPDATE_PURCHASE_ORDER_NUMBER,
  PROJECT_CLEAR_PURCHASE_ORDER_NUMBER,
} from "../../../../queries/project";
import { useMutation } from "@apollo/client";

/**
 * ProjectSummaryProjectDO Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @param {function} snackbarHandle - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryProjectDO = ({
  projectId,
  data,
  refetch,
  classes,
  snackbarHandle,
}) => {
  // Instantiate Original Value
  const [originalValue] = useState(
    data?.moped_project?.[0]?.purchase_order_number ?? null
  );
  const [editMode, setEditMode] = useState(false);
  const [projectPurchaseOrderNumber, setProjectPurchaseOrderNumber] = useState(
    originalValue
  );
  const [updateProjectOrderNumber] = useMutation(
    PROJECT_UPDATE_PURCHASE_ORDER_NUMBER
  );
  const [clearProjectOrderNumber] = useMutation(
    PROJECT_CLEAR_PURCHASE_ORDER_NUMBER
  );

  /**
   * Resets the project order number to original value
   */
  const handleProjectOrderNumberClose = () => {
    setProjectPurchaseOrderNumber(originalValue);
    setEditMode(false);
  };

  /**
   * Saves the new project order number...
   */
  const handleProjectOrderNumberSave = () => {
    const isEmpty = (projectPurchaseOrderNumber ?? "").length === 0;

    (isEmpty
      ? clearProjectOrderNumber({
          variables: {
            projectId: projectId,
          },
        })
      : updateProjectOrderNumber({
          variables: {
            projectId: projectId,
            purchase_order_number: projectPurchaseOrderNumber,
          },
        })
    )
      .then(() => {
        setEditMode(false);
        refetch();
        snackbarHandle(
          true,
          "Project purchase order number updated!",
          "success"
        );
      })
      .catch(err => {
        snackbarHandle(
          true,
          "Failed to update purchase order number: " + String(err),
          "error"
        );
        handleProjectOrderNumberClose();
      });

    setEditMode(false);
  };

  /**
   * Updates the state of the purchase order number value
   * @param {Object} e - Event object
   */
  const handleProjectPurchaseOrderNumberChange = e => {
    setProjectPurchaseOrderNumber(e.target.value);
  };

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>DO #</Typography>
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
              onChange={handleProjectPurchaseOrderNumberChange}
              value={projectPurchaseOrderNumber}
            />
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectOrderNumberSave}
            >
              check
            </Icon>
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectOrderNumberClose}
            >
              close
            </Icon>
          </>
        )}
        {!editMode && (
          <ProjectSummaryLabel
            text={
              (projectPurchaseOrderNumber ?? "").length > 0
                ? projectPurchaseOrderNumber
                : "None"
            }
            classes={classes}
            onClickEdit={() => setEditMode(true)}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryProjectDO;
