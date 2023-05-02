import React, { useState } from "react";
import { Grid, Box, Typography, Icon, TextField } from "@mui/material";
import ProjectSummaryLabel from "./ProjectSummaryLabel";
import { Autocomplete } from '@mui/material';

import { useMutation } from "@apollo/client";

/**
 * ProjectSummaryAutocomplete Component
 * @param {String} field - The name of the field to be displayed
 * @param {String} idColumn - The name of the id column to be used in the mutation
 * @param {String} nameColumn - The name of the name column to be displayed
 * @param {Object} initialValue - The initial value returned from the query
 * @param {Array} optionList - The list of options for the autocomplete
 * @param {String} updateMuation - The mutation to update the field
 * @param {String} tooltipText -  The text to be displayed in the tooltip
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @param {function} snackbarHandle - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryAutocomplete = ({
  field,
  idColumn,
  nameColumn,
  initialValue,
  optionList,
  updateMutation,
  tooltipText,
  projectId,
  refetch,
  classes,
  snackbarHandle,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [fieldValue, setFieldValue] = useState(initialValue);

  // The mutation and mutation function
  const [updateFieldValue] = useMutation(updateMutation);

  /**
   * Resets the field value back to its original state, closes edit mode
   */
  const handleFieldClose = () => {
    setFieldValue(initialValue);
    setEditMode(false);
  };

  /**
   * Saves the new field value
   */
  const handleFieldSave = () => {
    updateFieldValue({
      variables: {
        projectId: projectId,
        fieldValueId: fieldValue?.[idColumn] ?? null,
      },
    })
      .then(() => {
        setEditMode(false);
        refetch();
        snackbarHandle(true, `${field} updated!`, "success");
      })
      .catch((err) => {
        snackbarHandle(true, "Failed to update: " + String(err), "error");
        handleFieldClose();
      });
  };

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>{field}</Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
        {editMode && (
          <>
            <Autocomplete
              value={fieldValue}
              className={classes.fieldSelectItem}
              id={`moped-project-summary-autocomplete-${projectId}`}
              options={optionList}
              getOptionLabel={(e) => e[nameColumn]}
              isOptionEqualToValue={(option, value) =>
                option[nameColumn] === value[nameColumn]
              }
              onChange={(event, newValue) => {
                setFieldValue(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={null}
                  autoFocus
                />
              )}
              openOnFocus={true}
            ></Autocomplete>
            <Icon className={classes.editIconConfirm} onClick={handleFieldSave}>
              check
            </Icon>
            <Icon
              className={classes.editIconConfirm}
              onClick={handleFieldClose}
            >
              close
            </Icon>
          </>
        )}
        {!editMode && (
          <ProjectSummaryLabel
            text={fieldValue?.[nameColumn] || ""}
            classes={classes}
            onClickEdit={() => setEditMode(true)}
            tooltipText={tooltipText}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryAutocomplete;
