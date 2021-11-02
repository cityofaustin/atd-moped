import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Grid,
  Icon,
  Input,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";

import ProjectSummaryLabel from "./ProjectSummaryLabel";
import { useMutation } from "@apollo/client";
import { PROJECT_UPDATE_PARTNERS } from "../../../../queries/project";

/**
 * ProjectSummaryProjectPartners Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @param {function} snackbarHandle - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryProjectPartners = ({
  projectId,
  data,
  refetch,
  classes,
}) => {
  /**
   * Helper initial state lists
   */
  const entityList = data?.moped_entity ?? [];
  const originalPartners = data?.moped_proj_partners ?? [];
  const originalEntities = originalPartners.map(e => ({
    entity_id: e.entity_id,
    entity_name: e.moped_entity.entity_name,
  }));

  /**
   * Edit Mode and selected Entities states, and a list of its IDs which is put there for performance
   */
  const [editMode, setEditMode] = useState(false);
  const [selectedEntities, setSelectedEntities] = useState(originalEntities);
  const selectedEntitiesIds = selectedEntities.map(e => e?.entity_id);

  // The mutation and mutation function
  const [updateProjectPartners] = useMutation(PROJECT_UPDATE_PARTNERS);

  /**
   * Handles whenever there is a click in any of the menu items
   * @param {Object} event - The event object
   */
  const handleChange = event => {
    setSelectedEntities(event.target.value);
  };

  /**
   * Resets the partners list back to the original state, closes edit mode
   */
  const handleProjectPartnersClose = () => {
    setSelectedEntities(originalEntities);
    setEditMode(false);
  };

  /**
   * Saves the new project partner
   */
  const handleProjectPartnersSave = () => {
    console.log("Nothing!");
    if (false) updateProjectPartners();
    setEditMode(false);
  };

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>Project Partners</Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
        {editMode && (
          <>
            <Select
              id={`moped-project-summary-partner-select-${projectId}`}
              multiple
              value={selectedEntities}
              onChange={handleChange}
              input={<Input />}
              renderValue={entity => entity.map(e => e?.entity_name).join(", ")}
              /*
                There appears to be a problem with MenuProps in version 4.x (which is fixed in 5.0),
                this is fixed by overriding the function "getContentAnchorEl".
                    Source: https://github.com/mui-org/material-ui/issues/19245#issuecomment-620488016
              */
              MenuProps={{
                getContentAnchorEl: () => null,
                style: {
                  maxHeight: 500,
                  width: 450,
                },
              }}
              className={classes.fieldSelectItem}
            >
              {entityList.map(entity => (
                <MenuItem key={entity.entity_id} value={entity}>
                  <Checkbox
                    checked={selectedEntitiesIds.indexOf(entity.entity_id) > -1}
                  />
                  <ListItemText primary={entity.entity_name} />
                </MenuItem>
              ))}
            </Select>
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectPartnersSave}
            >
              check
            </Icon>
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectPartnersClose}
            >
              close
            </Icon>
          </>
        )}
        {!editMode && (
          <ProjectSummaryLabel
            text={selectedEntities.map(e => e?.entity_name).join(", ")}
            classes={classes}
            onClickEdit={() => setEditMode(true)}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryProjectPartners;
