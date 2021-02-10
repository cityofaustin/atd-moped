import React from "react";
import ProjectTeamTable from "./ProjectTeamTable";
import { useParams } from "react-router-dom";

import { CardContent, Grid } from "@material-ui/core";

const ProjectTeam = () => {
  const { projectId } = useParams();

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ProjectTeamTable projectId={projectId} />
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectTeam;
