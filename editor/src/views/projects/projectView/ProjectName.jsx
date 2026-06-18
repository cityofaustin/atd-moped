import React from "react";
import { Grid2, Box, Typography } from "@mui/material";

/**
 * Component to display the project name and secondary name
 * @param {Object} projectData - The data object from the GraphQL query
 * @param {Function} setIsEditing - The function to toggle the editing boolean state
 * @returns {JSX.Element}
 */
const ProjectName = ({ projectData, setIsEditing }) => (
  <Grid2 container>
    <Grid2 size={12}>
      <Box sx={{ display: "inline", cursor: "pointer" }}>
        <Typography
          color="textPrimary"
          variant="h2"
          sx={{ display: "inline" }}
          onClick={() => setIsEditing(true)}
        >
          {projectData.project_name}
        </Typography>
      </Box>

      {projectData.project_name_secondary &&
      projectData.project_name_secondary.length > 0 ? (
        <Box sx={{ display: "inline", cursor: "pointer" }}>
          <Typography
            color="textPrimary"
            variant="h2"
            sx={{ display: "inline" }}
            onClick={() => setIsEditing(true)}
          >
            &nbsp;- {projectData.project_name_secondary}
          </Typography>
        </Box>
      ) : null}
    </Grid2>
  </Grid2>
);

export default ProjectName;
