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
  snackbarHandle,
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
      partner_name: entityDict[id],
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
        snackbarHandle(true, "Update successful", "success");
      })
      .catch((err) => {
        snackbarHandle(
          true,
          "Failed to update partners: " + String(err),
          "error"
        );
        handleProjectPartnersClose();
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
              id={`moped-project-summary-partner-select-${projectId}`}
              multiple
              value={selectedEntities}
              onChange={handleChange}
              input={<Input autoFocus />}
              renderValue={(entity_ids) =>
                entity_ids.map((e) => entityDict[e]).join(", ")
              }
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
