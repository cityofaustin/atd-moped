import React from "react";
import ProjectTeamTable from "src/views/projects/projectView/ProjectTeam/ProjectTeamTable";
import { useParams } from "react-router-dom";

import { Grid2 } from "@mui/material";

const ProjectTeam = ({ handleSnackbar }) => {
  const { projectId } = useParams();

  return (
    <Grid2 container spacing={4}>
      <Grid2 size={12}>
        <ProjectTeamTable
          projectId={projectId}
          handleSnackbar={handleSnackbar}
        />
      </Grid2>
    </Grid2>
  );
};

export default ProjectTeam;
