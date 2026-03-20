import React, { useState } from "react";
import ProjectSummaryIconButtons from "src/views/projects/projectView/ProjectSummary/ProjectSummaryIconButtons";
import ProjectSummaryLabel from "src/views/projects/projectView/ProjectSummary/ProjectSummaryLabel";
import CopyTextButton from "src/components/CopyTextButton";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useMutation } from "@apollo/client";

import {
  fieldBox,
  fieldGridItem,
  fieldLabel,
  fieldSelectItem,
} from "src/styles/reusableStyles";
import {
  PROJECT_UPDATE_ECAPRIS_SUBPROJECT_ID,
  PROJECT_CLEAR_ECAPRIS_SUBPROJECT_ID,
} from "src/queries/project";

/**
 * ProjectSummaryProjectECapris Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {String} eCaprisSubprojectId - The current eCAPRIS subproject ID
 * @param {Array} options - The list of eCAPRIS subproject funding options
 * @param {boolean} loading - True if it is loading
 * @param {function} refetch - The refetch function from apollo
 * @param {function} handleSnackbar - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryProjectECapris = ({
  projectId,
  eCaprisSubprojectId,
  options,
  loading,
  refetch,
  handleSnackbar,
}) => {
  const initialValue = eCaprisSubprojectId
    ? {
        ecapris_subproject_id: eCaprisSubprojectId,
      }
    : null;

  const [editMode, setEditMode] = useState(false);
  const [fieldValue, setFieldValue] = useState(initialValue);

  const isClearingValue = fieldValue === null;
  const [updateECaprisId, { loading: updateLoading }] = useMutation(
    PROJECT_UPDATE_ECAPRIS_SUBPROJECT_ID
  );
  const [clearECaprisId, { loading: clearLoading }] = useMutation(
    PROJECT_CLEAR_ECAPRIS_SUBPROJECT_ID
  );

  const handleFieldClose = () => {
    setFieldValue(initialValue);
    setEditMode(false);
  };

  const handleFieldSave = () => {
    const mutation = isClearingValue ? clearECaprisId : updateECaprisId;

    mutation({
      variables: {
        projectId: projectId,
        ...(isClearingValue
          ? {}
          : { eCaprisSubprojectId: fieldValue?.ecapris_subproject_id ?? null }),
      },
    })
      .then(() => refetch())
      .then(() => {
        setEditMode(false);
        handleSnackbar(true, `eCAPRIS subproject ID updated`, "success");
      })
      .catch((error) => {
        setEditMode(false);
        setFieldValue(initialValue);
        handleSnackbar(
          true,
          `Error updating eCAPRIS subproject ID`,
          "error",
          error
        );
      });
  };

  return (
    <Grid item xs={12} sx={fieldGridItem}>
      <Typography sx={fieldLabel}>eCAPRIS subproject ID</Typography>
      <Box display="flex" justifyContent="flex-start" sx={fieldBox}>
        {editMode && (
          <>
            <Autocomplete
              value={fieldValue}
              sx={fieldSelectItem}
              options={options}
              getOptionLabel={(e) => e?.["ecapris_subproject_id"] ?? ""}
              isOptionEqualToValue={(option, value) =>
                option?.["ecapris_subproject_id"] ===
                value?.["ecapris_subproject_id"]
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
                eCaprisSubprojectId ===
                (fieldValue?.ecapris_subproject_id ?? null)
              }
              loading={loading || updateLoading || clearLoading}
            />
          </>
        )}
        {!editMode && (
          <Stack
            direction="row"
            spacing={1}
            sx={!eCaprisSubprojectId ? { flex: 1 } : {}} // Grow hoverable input to fill space if missing eCAPRIS id & copy button
          >
            <ProjectSummaryLabel
              text={eCaprisSubprojectId ? eCaprisSubprojectId : ""}
              onClickEdit={() => setEditMode(true)}
            />
            {eCaprisSubprojectId ? (
              <CopyTextButton
                textToCopy={`https://ecapris.austintexas.gov/index.cfm?fuseaction=subprojects.subprojectData&SUBPROJECT_ID=${eCaprisSubprojectId}`}
                copyButtonText="Copy eCAPRIS link"
                buttonProps={{
                  sx: { minWidth: 160, justifyContent: "flex-start" },
                }}
              />
            ) : null}
          </Stack>
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryProjectECapris;
