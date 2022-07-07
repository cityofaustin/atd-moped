import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { NavLink as RouterLink } from "react-router-dom";

/**
 * ProjectSummaryParentProjectLink Component
 * @param {Object} data - The data object from the GraphQL query
 * @param {Object} classes - The shared style settings
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryParentProjectLink = ({ data, classes }) => {
  const parentProjectId =
    data?.moped_project?.[0]?.parent_project_id;
  const parentProjectName = data?.moped_project[0].moped_project.project_name;

  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>Parent project</Typography>
      <Box
        display="flex"
        justifyContent="flex-start"
        className={classes.fieldBox}
      >
        <RouterLink
          id="projectKnackSyncLink"
          className={"MuiTypography-body1"}
          to={`/moped/projects/${parentProjectId}`}
        >
          <Typography variant={"inherit"} color={"primary"}>
            {parentProjectName}
          </Typography>
        </RouterLink>
      </Box>
    </Grid>
  );
};

export default ProjectSummaryParentProjectLink;
