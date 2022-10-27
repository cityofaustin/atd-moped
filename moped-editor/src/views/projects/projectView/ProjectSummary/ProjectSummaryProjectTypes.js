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
import { PROJECT_UPDATE_TYPES } from "../../../../queries/project";

/**
 * ProjectSummaryProjectTypes Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @param {function} snackbarHandle - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryProjectTypes = ({
  projectId,
  data,
  refetch,
  classes,
  snackbarHandle,
}) => {
  /**
   * Helper initial state lists
   */
  const typeList = data?.moped_types ?? [];
  const typeDict = typeList.reduce(
    (prev, curr) => ({
      ...prev,
      ...{ [curr.type_id]: curr.type_name },
    }),
    {}
  );

  // Original Types: array of moped_type objects
  const originalTypes = data?.moped_project[0]?.moped_project_types ?? [];
  // Original Types Ids: array of ids (ints)
  const originalTypesIds = originalTypes.map(t => t?.moped_type?.type_id);

  /**
   * Edit Mode and selected Types states
   */
  const [editMode, setEditMode] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState(originalTypesIds);

  // The mutation and mutation function
  const [updateProjectTypes] = useMutation(PROJECT_UPDATE_TYPES);

  /**
   * Handles whenever there is a click in any of the menu items
   * @param {Object} event - The event object
   */
  const handleChange = event => {
    setSelectedTypes(event.target.value);
  };

  /**
   * Resets the types list back to the original state, closes edit mode
   */
  const handleProjectTypesClose = () => {
    setSelectedTypes(originalTypesIds);
    setEditMode(false);
  };

  /**
   * Saves the new project types
   */
  const handleProjectTypesSave = () => {
    // Original type Ids
    const oldTypesList = originalTypesIds;
    // Get selected types ids
    const newTypesList = selectedTypes;
    // Retrieves the ids of oldTypesList that are not present in newTypesList
    const typeIdsToDelete = oldTypesList.filter(t => !newTypesList.includes(t));
    // Retrieves the ids of newTypesList that are not present in oldTypesList
    const typeIdsToInsert = newTypesList.filter(t => !oldTypesList.includes(t));
    // List of objects to insert
    const typeObjectsToInsert = typeIdsToInsert.map(type_id => ({
      project_id: projectId,
      project_type_id: type_id,
    }));

    // List of primary keys to delete
    const typePksToDelete = originalTypes
      .filter(t => typeIdsToDelete.includes(t?.moped_type.type_id))
      .map(t => t.id);

    updateProjectTypes({
      variables: {
        types: typeObjectsToInsert,
        deleteList: typePksToDelete,
      },
    })
      .then(() => {
        refetch();
        setEditMode(false);
        snackbarHandle(true, "Update successful", "success");
      })
      .catch(err => {
        snackbarHandle(true, "Failed to update types: " + String(err), "error");
        handleProjectTypesClose();
      });
    setEditMode(false);
  };

  // join selected type names in a comma separated string
  // used to display when not editing

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>Project type</Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
        {editMode ? (
          <>
            <Select
              id={`moped-project-summary-type-select-${projectId}`}
              multiple
              value={selectedTypes}
              onChange={handleChange}
              input={<Input autoFocus/>}
              renderValue={type_ids =>
                type_ids.map(t => typeDict[t]).join(", ")
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
              {typeList.map(type => (
                <MenuItem key={type.type_id} value={type.type_id}>
                  <Checkbox
                    checked={selectedTypes.includes(type.type_id)}
                    color={"primary"}
                  />
                  <ListItemText primary={type.type_name} />
                </MenuItem>
              ))}
            </Select>
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectTypesSave}
            >
              check
            </Icon>
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectTypesClose}
            >
              close
            </Icon>
          </>
        ) : (
          <ProjectSummaryLabel
            text={
              selectedTypes.map(t => typeDict[t])
            }
            classes={classes}
            onClickEdit={() => setEditMode(true)}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryProjectTypes;
