import React from "react";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import ProjectFundingTable from "./ProjectFunding/ProjectFundingTable";
import ProjectWorkActivitiesTable from "./ProjectWorkActivity/ProjectWorkActivityTable";
import { useParams } from "react-router-dom";

const ProjectFunding = ({ handleSnackbar }) => {
  const { projectId } = useParams();
  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <ProjectFundingTable
            projectId={projectId}
            handleSnackbar={handleSnackbar}
          />
        </Grid>
        <Grid item xs={12}>
          <ProjectWorkActivitiesTable
            projectId={projectId}
            handleSnackbar={handleSnackbar}
          />
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectFunding;
