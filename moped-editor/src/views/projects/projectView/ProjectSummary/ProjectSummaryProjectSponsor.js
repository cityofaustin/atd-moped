import React, { useState } from "react";
import { Box, Grid, Icon, TextField, Typography } from "@material-ui/core";

import ProjectSummaryLabel from "./ProjectSummaryLabel";

import { Autocomplete } from "@material-ui/lab";

import { useMutation } from "@apollo/client";
import { PROJECT_UPDATE_SPONSOR } from "../../../../queries/project";

/**
 * ProjectSummaryStatusUpdate Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @param {function} snackbarHandle - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryProjectSponsor = ({
  projectId,
  data,
  refetch,
  classes,
  snackbarHandle,
}) => {
  const entityList = data?.moped_entity ?? [];
  const noneSponsor = entityList.find(e => e.entity_id === 0);
  const originalSponsor = entityList.find(
    e => e.entity_id === data?.moped_project?.[0]?.project_sponsor
  );
  const [editMode, setEditMode] = useState(false);

  const [sponsor, setSponsor] = useState(originalSponsor ?? noneSponsor);

  // The mutation and mutation function
  const [updateProjectSponsor] = useMutation(PROJECT_UPDATE_SPONSOR);

  /**
   * Resets the sponsor back to its original state, closes edit mode
   */
  const handleProjectSponsorClose = () => {
    setSponsor(originalSponsor);
    setEditMode(false);
  };

  /**
   * Saves the new project sponsor
   */
  const handleProjectSponsorSave = () => {
    updateProjectSponsor({
      variables: {
        projectId: projectId,
        entityId: sponsor.entity_id,
      },
    })
      .then(() => {
        setEditMode(false);
        refetch();
        snackbarHandle(true, "Sponsor updated!", "success");
      })
      .catch(err => {
        snackbarHandle(true, "Failed to update: " + String(err), "error");
        handleProjectSponsorClose();
      });
  };

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>Sponsor</Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
        {editMode && (
          <>
            <Autocomplete
              value={sponsor}
              defaultValue={"None"}
              className={classes.fieldSelectItem}
              id={`moped-project-summary-autocomplete-${projectId}`}
              options={entityList}
              getOptionLabel={e => e.entity_name}
              onChange={(event, newValue) => {
                setSponsor(newValue);
              }}
              renderInput={params => (
                <TextField {...params} variant="standard" label={null} />
              )}
            />
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectSponsorSave}
            >
              check
            </Icon>
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectSponsorClose}
            >
              close
            </Icon>
          </>
        )}
        {!editMode && (
          <ProjectSummaryLabel
            text={sponsor?.entity_name || "n/a"}
            classes={classes}
            onClickEdit={() => setEditMode(true)}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryProjectSponsor;
