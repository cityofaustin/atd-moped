import React, { useState } from "react";
import {
  Box,
  Grid,
  Icon,
  Link,
  TextField,
  Typography,
} from "@material-ui/core";

import ProjectSummaryLabel from "./ProjectSummaryLabel";

import { PROJECT_UPDATE_WEBSITE } from "../../../../queries/project";
import { useMutation } from "@apollo/client";
import { OpenInNew } from "@material-ui/icons";

/**
 * ProjectSummaryProjectWebsite Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @param {function} snackbarHandle - The function to show the snackbar
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryProjectWebsite = ({
  projectId,
  data,
  refetch,
  classes,
  snackbarHandle,
}) => {
  const originalWebsite = data?.moped_project?.[0]?.project_website ?? null;

  const [editMode, setEditMode] = useState(false);
  const [website, setWebsite] = useState(originalWebsite);

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
    updateProjectWebsite({
      variables: {
        projectId: projectId,
        website: website,
      },
    })
      .then(() => {
        setEditMode(false);
        refetch();
        snackbarHandle(true, "Project website updated!", "success");
      })
      .catch((err) => {
        snackbarHandle(
          true,
          "Failed to update project website: " + String(err),
          "error"
        );
        handleProjectWebsiteClose();
      });
    setEditMode(false);
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
              autoFocus
              fullWidth
              id="moped-project-website"
              label={null}
              onChange={handleProjectWebsiteChange}
              value={website}
            />
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectWebsiteSave}
            >
              check
            </Icon>
            <Icon
              className={classes.editIconConfirm}
              onClick={handleProjectWebsiteClose}
            >
              close
            </Icon>
          </>
        )}
        {!editMode && (
          <ProjectSummaryLabel
            text={
              (website && website.length > 0 && (
                <Link href={website} target={"_blank"}>
                  {website}
                  <OpenInNew className={classes.linkIcon} />
                </Link>
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
