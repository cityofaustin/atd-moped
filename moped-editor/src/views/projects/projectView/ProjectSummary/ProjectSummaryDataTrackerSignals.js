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
  const signals = useProjectSignals(project);

  return (
    <>
      <Grid item xs={12} className={classes.fieldGridItem}>
        <Typography className={classes.fieldLabel}>Signal IDs</Typography>
        <Box display="flex" justifyContent="flex-start">
          <ProjectSummaryLabel
            className={classes.fieldLabelDataTrackerLink}
            text={
              signals.length > 0 ? <RenderSignalLink signals={signals} /> : "-"
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
