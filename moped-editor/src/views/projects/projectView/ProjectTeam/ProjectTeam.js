import React from "react";
import ProjectTeamTable from "./ProjectTeamTable";
import { useParams } from "react-router-dom";

import { CardContent, Grid } from "@mui/material";

const ProjectTeam = ({ snackbarHandle }) => {
  const { projectId } = useParams();

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ProjectTeamTable
            projectId={projectId}
            snackbarHandle={snackbarHandle}
          />
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectTeam;
