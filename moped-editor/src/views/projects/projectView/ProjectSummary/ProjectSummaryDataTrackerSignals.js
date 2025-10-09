import React, { useMemo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import ProjectSummaryLabel from "./ProjectSummaryLabel";
import RenderSignalLink from "../../../../components/RenderSignalLink";
import {
  fieldGridItem,
  fieldLabel,
  fieldLabelDataTrackerLink,
  fieldLabelTextSpanNoBorder,
} from "src/styles/reusableStyles";

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

const ProjectSummaryDataTrackerSignals = ({ project }) => {
  const signals = useProjectSignals(project);

  return (
    <Grid item xs={12} sx={fieldGridItem}>
      <Typography sx={fieldLabel}>Signal IDs</Typography>
      <Box display="flex" justifyContent="flex-start">
        <ProjectSummaryLabel
          sxProp={fieldLabelDataTrackerLink}
          spanSxProp={fieldLabelTextSpanNoBorder}
          text={
            signals.length > 0 ? <RenderSignalLink signals={signals} /> : "-"
          }
        />
      </Box>
    </Grid>
  );
};

export default ProjectSummaryDataTrackerSignals;
