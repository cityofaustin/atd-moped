import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { NavLink as RouterLink } from "react-router-dom";
import {
  fieldBox,
  fieldGridItem,
  fieldLabel,
  fieldLabelText,
} from "src/styles/reusableStyles";

/**
 * ProjectSummaryParentProjectLink Component
 * @param {Object} data - The data object from the GraphQL query
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryParentProjectLink = ({ data }) => {
  const parentProjectId = data?.moped_project?.[0]?.parent_project_id;
  const parentProjectName = data?.moped_project[0].moped_project.project_name_full;

  return (
    <Grid item xs={12} sx={fieldGridItem}>
      <Typography sx={fieldLabel}>Parent project</Typography>
      <Box sx={fieldBox}>
        <RouterLink
          id="projectKnackSyncLink"
          to={`/moped/projects/${parentProjectId}`}
        >
          <Typography
            sx={fieldLabelText}
            variant={"body1"}
            color={"primary"}
          >
            {parentProjectName}
          </Typography>
        </RouterLink>
      </Box>
    </Grid>
  );
};

export default ProjectSummaryParentProjectLink;
