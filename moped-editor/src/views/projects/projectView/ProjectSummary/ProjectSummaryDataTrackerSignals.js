import React, { useMemo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import ProjectSummaryLabel from "./ProjectSummaryLabel";
import RenderSignalLink from "../../../../components/RenderSignalLink";

/**
 * Function to map the signal IDs from a project object into an array and return the array length.
 * @returns integer
 */
const useProjectSignals = (project) =>
  useMemo(
    () =>
      project.moped_proj_components
        .map((component) => component.feature_signals)
        .flat()
        .filter((signal) => !!signal),
    [project]
  );

const ProjectSummaryDataTrackerSignals = ({ classes, project }) => {
  // TODO: Remove process.env.REACT_APP_KNACK_DATA_TRACKER_SCENE
  // TODO: Remove process.env.REACT_APP_KNACK_DATA_TRACKER_PROJECT_VIEW
  // TODO: Remove UPDATE_PROJECT_KNACK_ID
  const signals = useProjectSignals(project);

  const isProjectSyncedWithKnack = project?.knack_project_id;

  return (
    <>
      <Grid item xs={12} className={classes.fieldGridItem}>
        <Typography className={classes.fieldLabel}>Signal IDs</Typography>
        <Box display="flex" justifyContent="flex-start">
          <ProjectSummaryLabel
            className={classes.fieldLabelDataTrackerLink}
            text={
              isProjectSyncedWithKnack && signals.length > 0 ? (
                <RenderSignalLink signals={signals} />
              ) : (
                "None"
              )
            }
            classes={classes}
            spanClassName={classes.fieldLabelTextSpanNoBorder}
          />
        </Box>
      </Grid>
    </>
  );
};

export default ProjectSummaryDataTrackerSignals;
