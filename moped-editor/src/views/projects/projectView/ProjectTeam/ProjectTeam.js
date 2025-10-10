import React from "react";
import ProjectTeamTable from "./ProjectTeamTable";
import { useParams } from "react-router-dom";

import { CardContent, Grid } from "@mui/material";

const ProjectTeam = ({ handleSnackbar }) => {
  const { projectId } = useParams();

  return (
    <CardContent>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <ProjectTeamTable
            projectId={projectId}
            handleSnackbar={handleSnackbar}
          />
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectTeam;
