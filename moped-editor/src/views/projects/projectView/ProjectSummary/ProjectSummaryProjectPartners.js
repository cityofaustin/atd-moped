import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Grid,
  Icon,
  IconButton,
  Input,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import ProjectSummaryLabel from "./ProjectSummaryLabel";
import { useMutation } from "@apollo/client";
import { PROJECT_UPDATE_PARTNERS } from "../../../../queries/project";

/**
 * ProjectSummaryProjectPartners Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @param {function} handleSnackbar - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryProjectPartners = ({
  projectId,
  loading,
  data,
  refetch,
  classes,
  handleSnackbar,
  tooltipText,
}) => {
  /**
   * Helper initial state lists
   */
  const entityList = data?.moped_entity ?? [];
  const entityDict = entityList.reduce(
    (prev, curr) => ({
      ...prev,
      ...{ [curr.entity_id]: curr.entity_name },
    }),
    {}
  );

  // Establish original partners
  const originalPartners = data?.moped_proj_partners ?? [];
  // Establish original entities
  const originalEntities = originalPartners.map((e) => e.entity_id);
  /**
   * Edit Mode and selected Entities states, and a list of its IDs which is put there for performance
   */
  const [editMode, setEditMode] = useState(false);
  const [selectedEntities, setSelectedEntities] = useState(originalEntities);

  // The mutation and mutation function
  const [updateProjectPartners] = useMutation(PROJECT_UPDATE_PARTNERS);

  /**
   * Handles whenever there is a click in any of the menu items
   * @param {Object} event - The event object
   */
  const handleChange = (event) => {
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
    // Retrieve partners list (original list)
    const oldPartnersList = originalEntities;
    // The new partners list is just the selected entities ids
    const newPartnersList = selectedEntities;
    // Retrieves the ids of oldPartnersList that are not present in newPartnersList
    const partnerIdsToDelete = oldPartnersList.filter(
      (p) => !newPartnersList.includes(p)
    );
    // Retrieves the ids of newPartnersList that are not present in oldPartnersList
    const partnerIdsToInsert = newPartnersList.filter(
      (p) => !oldPartnersList.includes(p)
    );
    // We need a final list of objects to insert
    const partnerObjectsToInsert = partnerIdsToInsert.map((id) => ({
      project_id: projectId,
      entity_id: id,
    }));
    // We need a final list of primary keys to delete
    const partnerPksToDelete = originalPartners
      .filter((p) => partnerIdsToDelete.includes(p.entity_id))
      .map((p) => p.proj_partner_id);

    updateProjectPartners({
      variables: {
        partners: partnerObjectsToInsert,
        deleteList: partnerPksToDelete,
      },
    })
      .then(() => {
        refetch();
        setEditMode(false);
        handleSnackbar(true, "Project partners updated", "success");
      })
      .catch((error) => {
        handleProjectPartnersClose();
        handleSnackbar(true, `Error updating project partners`, "error", error);
      });
    setEditMode(false);
  };

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>Partners</Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
        {editMode && (
          <>
            <Select
              variant="standard"
              id={`moped-project-summary-partner-select-${projectId}`}
              multiple
              value={selectedEntities}
              onChange={handleChange}
              input={<Input autoFocus />}
              renderValue={(entity_ids) =>
                entity_ids.map((e) => entityDict[e]).join(", ")
              }
              MenuProps={{
                style: {
                  maxHeight: 500,
                  width: 450,
                },
              }}
              className={classes.fieldSelectItem}
            >
              {entityList.map((entity) => (
                <MenuItem key={entity.entity_id} value={entity.entity_id}>
                  <Checkbox
                    checked={selectedEntities.includes(entity.entity_id)}
                    color={"primary"}
                  />
                  <ListItemText primary={entity.entity_name} />
                </MenuItem>
              ))}
            </Select>
            <IconButton
              className={classes.editIconConfirm}
              disabled={
                JSON.stringify(originalEntities) ===
                  JSON.stringify(selectedEntities) || loading
              }
              onClick={handleProjectPartnersSave}
            >
              <Icon>check</Icon>
            </IconButton>
            <IconButton
              className={classes.editIconConfirm}
              disabled={loading}
              onClick={handleProjectPartnersClose}
            >
              <Icon>close</Icon>
            </IconButton>
          </>
        )}
        {!editMode && (
          <ProjectSummaryLabel
            text={selectedEntities.map((e) => entityDict[e])}
            classes={classes}
            onClickEdit={() => setEditMode(true)}
            tooltipText={tooltipText}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryProjectPartners;
