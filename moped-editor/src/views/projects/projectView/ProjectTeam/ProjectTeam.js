import React from "react";
import ProjectTeamTable from "src/views/projects/projectView/ProjectTeam/ProjectTeamTable";
import { useParams } from "react-router-dom";

import { Grid } from "@mui/material";

const ProjectTeam = ({ handleSnackbar }) => {
  const { projectId } = useParams();

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <ProjectTeamTable
          projectId={projectId}
          handleSnackbar={handleSnackbar}
        />
      </Grid>
    </Grid>
  );
};

export default ProjectTeam;
