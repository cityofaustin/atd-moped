import React, { useState, useMemo } from "react";
import ProjectSummaryIconButtons from "src/views/projects/projectView/ProjectSummary/ProjectSummaryIconButtons";
import ProjectSummaryLabel from "src/views/projects/projectView/ProjectSummary/ProjectSummaryLabel";
import CopyTextButton from "src/components/CopyTextButton";
import ExternalLink, { createBugReportLink } from "src/components/ExternalLink";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box, Grid2, Stack, Typography } from "@mui/material";
import { useMutation } from "@apollo/client";
import { useUser } from "src/auth/user";

import {
  fieldBox,
  fieldGridItem,
  fieldLabel,
  fieldLabelText,
  fieldLabelTextNoHover,
  fieldSelectItem,
} from "src/styles/reusableStyles";
import {
  PROJECT_UPDATE_ECAPRIS_SUBPROJECT_ID,
  PROJECT_CLEAR_ECAPRIS_SUBPROJECT_ID,
} from "src/queries/project";

// Find full option object by id
export const findOptionById = (options, id) => {
  return options?.find((option) => option?.ecapris_subproject_id === id);
};

// Memoized formatter to avoid recomputing labels repeatedly
const useFormatOptionLabel = () =>
  useMemo(() => {
    const cache = new Map();
    return (option) => {
      if (!option) return "";
      const id = option?.ecapris_subproject_id ?? "";
      const name = option?.subproject_name ?? "";
      const key = `${id}|${name}`;
      if (cache.has(key)) return cache.get(key);
      const label = name ? `${id} - ${name}` : id;
      cache.set(key, label);
      return label;
    };
  }, []);

/**
 * ProjectSummaryProjectECapris Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {String} eCaprisSubprojectId - The current eCAPRIS subproject ID
 * @param {Array} options - The list of eCAPRIS subproject ID options
 * @param {boolean} loading - True if project summary refetch is loading
 * @param {function} refetch - The refetch function from apollo
 * @param {function} handleSnackbar - The function to show the snackbar
 * @param {boolean} disabled - Whether the edit functionality should be disabled, optional
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
  disabled = false,
}) => {
  const { user } = useUser();
  const userEmail = user?.idToken?.payload?.email;

  const initialValue = eCaprisSubprojectId
    ? (findOptionById(options, eCaprisSubprojectId) ?? {
        ecapris_subproject_id: eCaprisSubprojectId,
      })
    : null;

  const [editMode, setEditMode] = useState(false);
  const [selectedValue, setSelectedValue] = useState(initialValue);
  // Capture input value to include in service request if user encounters missing eCAPRIS subproject ID in options list
  const [inputValue, setInputValue] = useState("");

  const isClearingValue = selectedValue === null;
  const [updateECaprisId, { loading: updateLoading }] = useMutation(
    PROJECT_UPDATE_ECAPRIS_SUBPROJECT_ID
  );
  const [clearECaprisId, { loading: clearLoading }] = useMutation(
    PROJECT_CLEAR_ECAPRIS_SUBPROJECT_ID
  );

  const handleFieldClose = () => {
    setSelectedValue(initialValue);
    setInputValue("");
    setEditMode(false);
  };

  const handleFieldSave = () => {
    const mutation = isClearingValue ? clearECaprisId : updateECaprisId;

    mutation({
      variables: {
        projectId: projectId,
        ...(isClearingValue
          ? {}
          : {
              eCaprisSubprojectId: selectedValue?.ecapris_subproject_id ?? null,
            }),
      },
    })
      .then(() => refetch())
      .then(() => {
        setEditMode(false);
        handleSnackbar(true, "eCAPRIS subproject ID updated", "success");
      })
      .catch((error) => {
        setEditMode(false);
        setSelectedValue(initialValue);
        handleSnackbar(
          true,
          "Error updating eCAPRIS subproject ID",
          "error",
          error
        );
      });
  };

  const formatOptionLabel = useFormatOptionLabel();

  return (
    <Grid2 size={12} sx={fieldGridItem}>
      <Typography sx={fieldLabel}>eCAPRIS subproject ID</Typography>
      <Box display="flex" justifyContent="flex-start" sx={fieldBox}>
        {editMode && (
          <>
            <Autocomplete
              value={selectedValue}
              sx={fieldSelectItem}
              options={options}
              getOptionLabel={(e) =>
                e?.["ecapris_subproject_id"] ? formatOptionLabel(e) : ""
              }
              isOptionEqualToValue={(option, value) =>
                option?.["ecapris_subproject_id"] ===
                value?.["ecapris_subproject_id"]
              }
              onChange={(_, newValue) => {
                setSelectedValue(newValue);
              }}
              onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
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
              noOptionsText={
                <Typography>
                  eCAPRIS subproject ID not found.{" "}
                  {
                    <ExternalLink
                      url={createBugReportLink(
                        {
                          message: `Missing eCAPRIS subproject ID ${inputValue ?? ""} for project ${projectId}`,
                        },
                        userEmail
                      )}
                      text={"Click here"}
                    />
                  }{" "}
                  to report.
                </Typography>
              }
              disabled={disabled}
            />
            <ProjectSummaryIconButtons
              handleSave={handleFieldSave}
              handleClose={handleFieldClose}
              disabledCondition={
                eCaprisSubprojectId ===
                  (selectedValue?.ecapris_subproject_id ?? null) || disabled
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
              // Display subproject name in summary view if available
              text={formatOptionLabel(
                findOptionById(options, eCaprisSubprojectId) ?? {
                  ecapris_subproject_id: eCaprisSubprojectId,
                }
              )}
              onClickEdit={() => {
                if (disabled) return;
                setEditMode(true);
              }}
              sxProp={disabled ? fieldLabelTextNoHover : fieldLabelText}
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
    </Grid2>
  );
};

export default ProjectSummaryProjectECapris;
