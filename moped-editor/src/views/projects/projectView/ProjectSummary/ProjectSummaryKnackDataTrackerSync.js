import React, { useState } from "react";
import {
  Box,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";

import { OpenInNew, Autorenew } from "@material-ui/icons";

import ProjectSummaryLabel from "./ProjectSummaryLabel";

const ProjectSummaryKnackDataTrackerSync = ({
  classes,
  knackProjectId = undefined
}) => {

  return (
    <>
      <Grid item xs={12} className={classes.fieldGridItem}>
        <Typography className={classes.fieldLabel}>
          Data Tracker signal IDs
        </Typography>
        <Box
          display="flex"
          justifyContent="flex-start"
        >
          <ProjectSummaryLabel
            text={
              (knackProjectId && (
                <Link
                  href={'https://atd.knack.com/amd#projects/project-details/' + knackProjectId}
                  target={"_blank"}
                >
                  {'View in Data Tracker'} <OpenInNew className={classes.linkIcon} />
                </Link>
              )) || (
                <>
                  <Link className={classes.fieldLabelText}>
                    {'Synchronize'}<Autorenew viewBox={"0 -4 22 26"} className={classes.syncLinkIcon} />
                  </Link>
                </>
              )}
            classes={classes}
            spanClassName={''}
          />
        </Box>
      </Grid>
    </>
  )

};

export default ProjectSummaryKnackDataTrackerSync;