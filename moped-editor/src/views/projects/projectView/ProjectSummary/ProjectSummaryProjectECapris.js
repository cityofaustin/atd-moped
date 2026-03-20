import React, { useEffect, useState } from "react";
import { Box, Grid2, Stack, TextField, Typography } from "@mui/material";

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
 * Custom wrapper for the eCapris edit field
 * @param {JSX.Element} children - Any children
 * @param {boolean} noWrapper - If false, it provides a null wrapper
 * @returns {JSX.Element}
 * @constructor
 */
const WrapperComponent = ({ children, noWrapper }) =>
  noWrapper ? (
    <>
      <Typography sx={fieldLabel}>eCAPRIS Subproject ID</Typography>
      {children}
    </>
  ) : (
    <Grid2 sx={fieldGridItem} size={12}>
      <Typography sx={fieldLabel}>eCAPRIS Subproject ID</Typography>
      {children}
    </Grid2>
  );

/**
 * ProjectSummaryProjectECapris Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {String} eCaprisSubprojectId - The current eCAPRIS subproject ID
 * @param {Array} options - The list of eCAPRIS subproject ID options
 * @param {boolean} loading - True if project summary refetch is loading
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
        handleSnackbar(true, "eCAPRIS subproject ID updated", "success");
      })
      .catch((error) => {
        setEditMode(false);
        setFieldValue(initialValue);
        handleSnackbar(
          true,
          "Error updating eCAPRIS subproject ID",
          "error",
          error
        );
      });
  };

  return (
    <WrapperComponent noWrapper={noWrapper}>
      <Box
        sx={[
          {
            display: "flex",
            justifyContent: "flex-start",
          },
          ...(Array.isArray(fieldBox) ? fieldBox : [fieldBox]),
        ]}
      >
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
