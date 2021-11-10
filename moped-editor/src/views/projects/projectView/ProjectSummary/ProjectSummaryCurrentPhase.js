import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";

/**
 * ProjectSummaryCurrentPhase Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {Object} classes - The shared style settings
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryCurrentPhase = ({ projectId, data, classes }) => {
  // First we establish the current phase name to the first element in the moped_proj_phases array
  const phaseName =
    data?.moped_proj_phases?.length > 0
      ? data?.moped_proj_phases[0]?.phase_name ?? null
      : null;

  // Then we find it's proper name
  const currentPhase =
    (data?.moped_phases ?? []).find(
      p => (p?.phase_name ?? "").toLowerCase() === phaseName
    )?.phase_name || "None";

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Box className={classes.fieldBox}>
        <Typography className={classes.fieldLabel}>Current phase</Typography>
        <Typography className={classes.fieldBoxTypography}>
          {currentPhase}
        </Typography>
      </Box>
    </Grid>
  );
};

export default ProjectSummaryCurrentPhase;
