import React from "react";
import { Grid, Box, Typography } from "@mui/material";

const ProjectName = ({ projectData, setIsEditing }) => (
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
      </Box>
    </Grid>
  </Grid>
);

export default ProjectName;
