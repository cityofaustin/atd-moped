import React, { useEffect, useState } from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";

import ExternalLink from "src/components/ExternalLink";
import ProjectSummaryLabel from "./ProjectSummaryLabel";
import ProjectSummaryIconButtons from "./ProjectSummaryIconButtons";

import {
  PROJECT_UPDATE_ECAPRIS_SUBPROJECT_ID,
  PROJECT_CLEAR_ECAPRIS_SUBPROJECT_ID,
} from "../../../../queries/project";
import { useMutation } from "@apollo/client";
import { fieldBox, fieldGridItem, fieldLabel } from "src/styles/reusableStyles";

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
    <Grid item xs={12} sx={fieldGridItem}>
      <Typography sx={fieldLabel}>eCAPRIS Subproject ID</Typography>
      {children}
    </Grid>
  );

/**
 * ProjectSummaryProjectECapris Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {function} handleSnackbar - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryProjectECapris = ({
  projectId,
  loading,
  data,
  refetch,
  handleSnackbar,
  noWrapper,
}) => {
  const [originalValue, setOriginalValue] = useState(
    data?.moped_project?.[0]?.ecapris_subproject_id ?? null
  );
  const [editMode, setEditMode] = useState(false);
  const [eCapris, setECapris] = useState(originalValue);

  useEffect(() => {
    const newVal = data?.moped_project?.[0]?.ecapris_subproject_id ?? null;
    setOriginalValue(newVal);
    setECapris(newVal);
  }, [data]);

  const [updateProjectECapris, { loading: updateMutationLoading }] =
    useMutation(PROJECT_UPDATE_ECAPRIS_SUBPROJECT_ID);

  const [clearProjectECapris, { loading: clearMutationLoading }] = useMutation(
    PROJECT_CLEAR_ECAPRIS_SUBPROJECT_ID
  );

  /**
   * Validates the eCapris ID format or checks if it is empty so it can be cleared.
   * The format should be a number with exactly three digits after the decimal point.
   */
  const isValidECaprisId = (num) =>
    /^[\d]*\.[0-9]{3}$/.test(num) || !num?.length;
  /**
   * Resets the project website to original value
   */
  const handleProjectECaprisClose = () => {
    setECapris(originalValue);
    setEditMode(false);
  };

  /**
   * Saves the new project website...
   */
  const handleProjectECaprisSave = () => {
    const isEmpty = (eCapris ?? "").length === 0;

    (isEmpty
      ? clearProjectECapris({
          variables: {
            projectId: projectId,
          },
        })
      : updateProjectECapris({
          variables: {
            projectId: projectId,
            eCapris: eCapris,
          },
        })
    )
      .then(() => refetch())
      .then(() => {
        setEditMode(false);
        handleSnackbar(true, "eCAPRIS Subproject ID updated", "success");
      })
      .catch((error) => {
        handleProjectECaprisClose();
        handleSnackbar(
          true,
          `Error updating eCAPRIS Subproject ID`,
          "error",
          error
        );
      });

    setEditMode(false);
  };

  /**
   * Updates the state of website
   * @param {Object} e - Event object
   */
  const handleProjectECaprisChange = (e) => {
    setECapris(e.target.value.trim());
  };

  return (
    <WrapperComponent noWrapper={noWrapper}>
      <Box display="flex" justifyContent="flex-start" sx={fieldBox}>
        {editMode && (
          <>
            <TextField
              variant="standard"
              autoFocus
              fullWidth
              id="moped-project-ecapris"
              label={null}
              onChange={handleProjectECaprisChange}
              value={eCapris}
              error={!isValidECaprisId(eCapris)}
              helperText={
                !isValidECaprisId(eCapris)
                  ? `eCapris value must contain no letters and have exactly three digits after the decimal place. E.g., 12680.010.`
                  : null
              }
            />
            <ProjectSummaryIconButtons
              handleSave={handleProjectECaprisSave}
              handleClose={handleProjectECaprisClose}
              disabledCondition={
                originalValue === eCapris || !isValidECaprisId(eCapris)
              }
              loading={loading || updateMutationLoading || clearMutationLoading}
            />
          </>
        )}
        {!editMode && (
          <ProjectSummaryLabel
            text={
              (eCapris && (
                <ExternalLink
                  text={eCapris}
                  url={`https://ecapris.austintexas.gov/index.cfm?fuseaction=subprojects.subprojectData&SUBPROJECT_ID=${eCapris}`}
                  stopPropagation
                />
              )) ||
              ""
            }
            onClickEdit={() => setEditMode(true)}
          />
        )}
      </Box>
    </WrapperComponent>
  );
};

export default ProjectSummaryProjectECapris;
