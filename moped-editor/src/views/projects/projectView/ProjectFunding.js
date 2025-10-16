import React from "react";
import Grid from "@mui/material/Grid";
import ProjectFundingTable from "src/views/projects/projectView/ProjectFunding/ProjectFundingTable";
import ProjectWorkActivitiesTable from "src/views/projects/projectView/ProjectWorkActivity/ProjectWorkActivityTable";
import { useParams } from "react-router-dom";

const ProjectFunding = ({ handleSnackbar, refetch: refetchProjectSummary }) => {
  const { projectId } = useParams();
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <ProjectFundingTable
          projectId={projectId}
          handleSnackbar={handleSnackbar}
          refetchProjectSummary={refetchProjectSummary}
        />
      </Grid>
      <Grid item xs={12}>
        <ProjectWorkActivitiesTable
          projectId={projectId}
          handleSnackbar={handleSnackbar}
        />
      </Grid>
    </Grid>
  );
};

export default ProjectFunding;
