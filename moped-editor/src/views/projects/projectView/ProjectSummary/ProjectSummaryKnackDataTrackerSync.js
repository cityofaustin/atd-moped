import React, { useState } from "react";
import {
  Grid,
  Typography,
} from "@material-ui/core";

import ProjectSummaryLabel from "./ProjectSummaryLabel";

const ProjectSummaryKnackDataTrackerSync = ({
  classes
}) => {

  return (
    <>
      <Grid item xs={12} className={classes.fieldGridItem}>
        <Typography className={classes.fieldLabel}>
          Data Tracker signal IDs
        </Typography>
      </Grid>
    </>
  )

};

export default ProjectSummaryKnackDataTrackerSync;