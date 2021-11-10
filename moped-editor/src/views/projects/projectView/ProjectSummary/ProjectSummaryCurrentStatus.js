import React, { useState } from "react";
import { Box, Grid, Icon, TextField, Typography } from "@material-ui/core";

import ProjectSummaryLabel from "./ProjectSummaryLabel";
import { Autocomplete } from "@material-ui/lab";
import { useMutation } from "@apollo/client";
import { PROJECT_UPDATE_CURRENT_STATUS } from "../../../../queries/project";

/**
 * ProjectSummaryCurrentStatus Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @param {function} snackbarHandle - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryCurrentStatus = ({
  projectId,
  data,
  refetch,
  classes,
  snackbarHandle,
}) => {
  const statusList = data?.moped_status ?? [];
  const originalStatusProjectValue =
    data?.moped_project?.[0]?.current_status ?? "";
  const originalStatus = statusList.find(
    s => (s?.status_name ?? "").toLowerCase() === originalStatusProjectValue
  );

  const [editMode, setEditMode] = useState(false);

  const [currentStatus, setCurrentStatus] = useState(originalStatus);

  // The mutation and mutation function
  const [updateCurrentStatus] = useMutation(PROJECT_UPDATE_CURRENT_STATUS);

  /**
   * Resets the sponsor back to its original state, closes edit mode
   */
  const handleCurrentStatusClose = () => {
    setCurrentStatus(originalStatus);
    setEditMode(false);
  };

  /**
   * Saves the new project sponsor
   */
  const handleCurrentStatusSave = () => {
    updateCurrentStatus({
      variables: {
        projectId: projectId,
        currentStatus: currentStatus?.status_name?.toLowerCase(),
      },
    })
      .then(() => {
        setEditMode(false);
        refetch();
        snackbarHandle(true, "Current status updated!", "success");
      })
      .catch(err => {
        snackbarHandle(true, "Failed to update: " + String(err), "error");
        handleCurrentStatusClose();
      });
  };

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>Current status</Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
        {editMode && (
          <>
            <Autocomplete
              value={currentStatus}
              defaultValue={null}
              className={classes.fieldSelectItem}
              id={`moped-project-current_status-autocomplete-${projectId}`}
              options={statusList}
              getOptionLabel={s => s.status_name}
              onChange={(event, newValue) => {
                setCurrentStatus(newValue);
              }}
              renderInput={params => (
                <TextField {...params} variant="standard" label={null} />
              )}
            />
            <Icon
              className={classes.editIconConfirm}
              onClick={handleCurrentStatusSave}
            >
              check
            </Icon>
            <Icon
              className={classes.editIconConfirm}
              onClick={handleCurrentStatusClose}
            >
              close
            </Icon>
          </>
        )}
        {!editMode && (
          <ProjectSummaryLabel
            text={currentStatus?.status_name || "None"}
            classes={classes}
            onClickEdit={() => setEditMode(true)}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryCurrentStatus;
