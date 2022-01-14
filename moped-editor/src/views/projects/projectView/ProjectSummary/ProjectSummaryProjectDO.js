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

import {
  PROJECT_UPDATE_CONTACTOR,
  PROJECT_CLEAR_CONTACTOR,
  PROJECT_UPDATE_PURCHASE_ORDER_NUMBER,
  PROJECT_CLEAR_PURCHASE_ORDER_NUMBER,
} from "../../../../queries/project";
import { useMutation } from "@apollo/client";
import { OpenInNew } from "@material-ui/icons";

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
  const [originalValue, setOriginalValue] = useState(
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
