import React, { useState } from "react";
import { Box, Grid, Icon, TextField, Typography } from "@material-ui/core";

import ProjectSummaryLabel from "./ProjectSummaryLabel";

import { Autocomplete } from "@material-ui/lab";

import { useMutation } from "@apollo/client";
import {
  PROJECT_UPDATE_SPONSOR,
  PROJECT_UPDATE_LEAD,
} from "../../../../queries/project";

const getUpdateMutation = (entityName) => {
  if (entityName === "Sponsor") {
    return PROJECT_UPDATE_SPONSOR;
  }
  if (entityName === "Lead") {
    return PROJECT_UPDATE_LEAD;
  }
};

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
const ProjectSummaryProjectEntity = ({
  projectId,
  data,
  refetch,
  classes,
  snackbarHandle,
  entityName,
  tooltipText,
}) => {
  const entityList = data?.moped_entity ?? [];
  const noneSponsor = entityList.find((e) => e.entity_id === 0);

  const getOriginalSponsor = () => {
    if (entityName === "Lead") {
      return data?.moped_project?.[0]?.moped_project_lead;
    }
    if (entityName === "Sponsor") {
      return data?.moped_project?.[0]?.moped_entity;
    }
  };

  const [editMode, setEditMode] = useState(false);

  const [sponsor, setSponsor] = useState(getOriginalSponsor() ?? noneSponsor);

  // The mutation and mutation function
  const [updateProjectEntity] = useMutation(getUpdateMutation(entityName));

  /**
   * Resets the sponsor back to its original state, closes edit mode
   */
  const handleProjectSponsorClose = () => {
    setSponsor(getOriginalSponsor());
    setEditMode(false);
  };

  /**
   * Saves the new project sponsor
   */
  const handleProjectSponsorSave = () => {
    updateProjectEntity({
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
      .catch((err) => {
        snackbarHandle(true, "Failed to update: " + String(err), "error");
        handleProjectSponsorClose();
      });
  };

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>{entityName}</Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
        {editMode && (
          <>
            <Autocomplete
              value={sponsor}
              className={classes.fieldSelectItem}
              id={`moped-project-summary-autocomplete-${projectId}`}
              options={entityList}
              getOptionLabel={(e) => e.entity_name}
              getOptionSelected={(option, value) =>
                option.entity_name === value.entity_name
              }
              onChange={(event, newValue) => {
                setSponsor(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={null}
                  autoFocus
                />
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
            text={sponsor?.entity_name || ""}
            classes={classes}
            onClickEdit={() => setEditMode(true)}
            tooltipText={tooltipText}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryProjectEntity;
