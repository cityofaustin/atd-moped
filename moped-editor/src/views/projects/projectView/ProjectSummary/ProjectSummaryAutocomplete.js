import React, { useState } from "react";
import { Grid, Box, Typography, TextField } from "@mui/material";
import ProjectSummaryLabel from "./ProjectSummaryLabel";
import ProjectSummaryIconButtons from "./ProjectSummaryIconButtons";
import { Autocomplete } from "@mui/material";
import {
  fieldBox,
  fieldGridItem,
  fieldLabel,
  fieldSelectItem,
} from "src/styles/reusableStyles";

import { useMutation } from "@apollo/client";

/**
 * ProjectSummaryAutocomplete Component
 * @param {String | null} field - The name of the field to be displayed in the label (no label if null)
 * @param {String} idColumn - The name of the id column to be used in the mutation
 * @param {String} nameColumn - The name of the name column to be displayed
 * @param {Object} initialValue - The initial value returned from the query
 * @param {Array} optionList - The list of options for the autocomplete
 * @param {String} updateMuation - The mutation to update the field
 * @param {String} tooltipText -  The text to be displayed in the tooltip
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {function} handleSnackbar - The function to show the snackbar
 * @param {boolean} defaultEditMode - True if the component should start in edit mode
 * @param {function} onClose - Callback function for when the autocomplete is closed
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryAutocomplete = ({
  field = null,
  idColumn,
  nameColumn,
  initialValue,
  optionList,
  updateMutation,
  tooltipText,
  projectId,
  loading,
  refetch,
  handleSnackbar,
  defaultEditMode = false,
  onClose = null,
}) => {
  const [editMode, setEditMode] = useState(defaultEditMode);
  const [fieldValue, setFieldValue] = useState(initialValue);

  // The mutation and mutation function
  const [updateFieldValue, { loading: mutationLoading }] =
    useMutation(updateMutation);

  /**
   * Resets the field value back to its original state, closes edit mode
   */
  const handleFieldClose = () => {
    setEditMode(false);
    if (onClose) {
      onClose();
    }
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
      .then(() => refetch())
      .then(() => {
        handleFieldClose();
        handleSnackbar(true, `${field} updated`, "success");
      })
      .catch((error) => {
        handleSnackbar(true, `Error updating ${field}`, "error", error);
        setFieldValue(initialValue);
        handleFieldClose();
      });
  };

  return (
    <Grid item xs={12} sx={fieldGridItem}>
      <Typography sx={fieldLabel}>{field}</Typography>
      <Box display="flex" justifyContent="flex-start" sx={fieldBox}>
        {editMode && (
          <>
            <Autocomplete
              value={fieldValue}
              sx={fieldSelectItem}
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
            <ProjectSummaryIconButtons
              handleSave={handleFieldSave}
              handleClose={handleFieldClose}
              disabledCondition={
                fieldValue?.[idColumn] === initialValue?.[idColumn]
              }
              loading={loading || mutationLoading}
            />
          </>
        )}
        {!editMode && (
          <ProjectSummaryLabel
            text={fieldValue?.[nameColumn] || ""}
            onClickEdit={() => setEditMode(true)}
            tooltipText={tooltipText}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryAutocomplete;
