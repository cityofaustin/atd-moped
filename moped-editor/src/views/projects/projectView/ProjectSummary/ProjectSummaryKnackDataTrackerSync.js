import React, { useState } from "react";
import {
  Box,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";

import { OpenInNew } from "@material-ui/icons";

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
        <Box
          display="flex"
          justifyContent="flex-start"
        >
          <ProjectSummaryLabel
            text={
              (true && (
              <Link
              href={''}
              target={"_blank"}
            >
              {'View it here'} <OpenInNew className={classes.linkIcon} />
            </Link>
              )) || (
                <>
                  {'Synchronize'} <Autorenew className={classes.linkIcon} />
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