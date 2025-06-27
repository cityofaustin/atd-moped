import React, { useState } from "react";
import {
  Box,
  Grid,
  Icon,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import ExternalLink from "src/components/ExternalLink";
import ProjectSummaryLabel from "./ProjectSummaryLabel";

import { PROJECT_UPDATE_WEBSITE } from "../../../../queries/project";
import { useMutation } from "@apollo/client";
import { isValidUrl, makeUrlValid } from "src/utils/urls";

/**
 * ProjectSummaryProjectWebsite Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @param {function} handleSnackbar - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryProjectWebsite = ({
  projectId,
  loading,
  data,
  refetch,
  classes,
  handleSnackbar,
}) => {
  const originalWebsite = data?.moped_project?.[0]?.project_website ?? null;

  const [editMode, setEditMode] = useState(false);
  const [website, setWebsite] = useState(originalWebsite);

  // Try to make the website valid if it starts with www
  const websiteMadeValid = makeUrlValid(website);
  // Hasura returns null if the website is empty which is a valid entry
  const isWebsiteValid = isValidUrl(websiteMadeValid) || website === null;

  const [updateProjectWebsite] = useMutation(PROJECT_UPDATE_WEBSITE);

  /**
   * Resets the project website to original value
   */
  const handleProjectWebsiteClose = () => {
    setWebsite(originalWebsite);
    setEditMode(false);
  };

  /**
   * Saves the new project website...
   */
  const handleProjectWebsiteSave = () => {
    // Prevent saving if the website is not valid
    if (!isWebsiteValid) return;
    const websiteToSubmit = websiteMadeValid === "" ? null : websiteMadeValid;

    updateProjectWebsite({
      variables: {
        projectId: projectId,
        website: websiteToSubmit,
      },
    })
      .then(() => {
        setWebsite(websiteToSubmit);
        setEditMode(false);
        refetch();
        handleSnackbar(true, "Project website updated", "success");
      })
      .catch((error) => {
        handleProjectWebsiteClose();
        setEditMode(false);
        handleSnackbar(true, `Error updating project website`, "error", error);
      });
  };

  /**
   * Updates the state of website
   * @param {Object} e - Event object
   */
  const handleProjectWebsiteChange = (e) => {
    setWebsite(e.target.value);
  };

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>Website</Typography>
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
              id="moped-project-website"
              label={null}
              onChange={handleProjectWebsiteChange}
              value={website}
              error={!isWebsiteValid}
              helperText={!isWebsiteValid ? "Website is not a valid URL" : null}
            />
            <IconButton
              disabled={
                website === originalWebsite || !isWebsiteValid || loading
              }
              onClick={handleProjectWebsiteSave}
            >
              <Icon>check</Icon>
            </IconButton>
            <IconButton
              disabled={loading}
              onClick={handleProjectWebsiteClose}
            >
              <Icon>close</Icon>
            </IconButton>
          </>
        )}
        {!editMode && (
          <ProjectSummaryLabel
            text={
              (website && website.length > 0 && (
                <ExternalLink text={website} url={website} stopPropagation />
              )) ||
              ""
            }
            classes={classes}
            onClickEdit={() => setEditMode(true)}
          />
        )}
      </Box>
    </Grid>
  );
};

export default ProjectSummaryProjectWebsite;
