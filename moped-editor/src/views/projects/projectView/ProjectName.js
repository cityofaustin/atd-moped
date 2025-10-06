import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import ProjectStatusBadge from "./ProjectStatusBadge";

const ProjectName = ({
  projectData,
  setIsEditing,
  projectId,
  currentPhase,
}) => (
  <Grid container>
    <Grid item xs={12}>
      <Box>
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

        {/* <Box
          sx={{ display: "inline", paddingLeft: "10px", paddingRight: "10px" }}
        >
          <Typography
            color="textSecondary"
            variant="h2"
            sx={{ display: "inline" }}
          >
            #{projectId}
          </Typography>
        </Box> */}
      </Box>
    </Grid>
  </Grid>
);

export default ProjectName;
