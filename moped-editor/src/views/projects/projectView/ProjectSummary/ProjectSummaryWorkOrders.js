import React from "react";
import { Box, Grid, Typography } from "@mui/material";

import ProjectSummaryLabel from "./ProjectSummaryLabel";

import ExternalLink from "src/components/ExternalLink";

/**
 * ProjectSummaryWorkOrders Component
 * @param {Object} project - Current project being viewed
 * @param {Object} classes - The shared style settings
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryWorkOrders = ({ project, classes }) => {
  const knackProjectURL = project?.knack_project_id
    ? `https://atd.knack.com/amd#work-orders/?view_713_filters=%7B%22match%22%3A%22and%22%2C%22rules%22%3A%5B%7B%22field%22%3A%22field_4133%22%2C%22operator%22%3A%22is%22%2C%22value%22%3A%22${project.project_id}%22%7D%5D%7D`
    : "";

  return knackProjectURL ? (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>Work orders</Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
        <ProjectSummaryLabel
          className={classes.fieldLabelDataTrackerLink}
          text={
            <ExternalLink text="View in Data Tracker" url={knackProjectURL} />
          }
          classes={classes}
          spanClassName={classes.fieldLabelTextSpanNoBorder}
        />
      </Box>
    </Grid>
  ) : (
    // If there is no knack project url, render an empty grid space
    <Grid item xs={12} className={classes.fieldGridItem} />
  );
};

export default ProjectSummaryWorkOrders;
