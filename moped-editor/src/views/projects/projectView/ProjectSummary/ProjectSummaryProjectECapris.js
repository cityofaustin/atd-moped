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

/**
 * Custom wrapper for the eCapris edit field
 * @param {JSX.Element} children - Any children
 * @param {boolean} noWrapper - If false, it provides a null wrapper
 * @param {Object} classes - Class object containing styles
 * @returns {JSX.Element}
 * @constructor
 */
const WrapperComponent = ({ children, noWrapper, classes }) =>
  noWrapper ? (
    <>
      <Typography className={classes.fieldLabel}>
        eCAPRIS Subproject ID
      </Typography>
      {children}
    </>
  ) : (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>
        eCAPRIS Subproject ID
      </Typography>
      {children}
    </Grid>
  );

/**
 * ProjectSummaryProjectECapris Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @param {function} handleSnackbar - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryProjectECapris = ({
  projectId,
  loading,
  data,
  refetch,
  classes,
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

  const [updateProjectECapris] = useMutation(
    PROJECT_UPDATE_ECAPRIS_SUBPROJECT_ID
  );

  const [clearProjectECapris] = useMutation(
    PROJECT_CLEAR_ECAPRIS_SUBPROJECT_ID
  );

  const isValidECaprisId = (num) => /^[\d]*\.[0-9]{3}$/.test(num);
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
      .then(() => {
        setEditMode(false);
        handleSnackbar(true, "eCAPRIS Subproject ID updated", "success");
      })
      .then(() => refetch())
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
    <WrapperComponent classes={classes} noWrapper={noWrapper}>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
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
              loading={loading}
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
            classes={classes}
            onClickEdit={() => setEditMode(true)}
          />
        )}
      </Box>
    </WrapperComponent>
  );
};

export default ProjectSummaryProjectECapris;
