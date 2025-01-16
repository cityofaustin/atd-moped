import React from "react";
import Grid from "@mui/material/Grid";
import CardContent from "@mui/material/CardContent";
import ProjectFundingTable from "./ProjectFunding/ProjectFundingTable";
import ProjectWorkActivitiesTable from "./ProjectWorkActivity/ProjectWorkActivityTable";
import { useParams } from "react-router-dom";

const ProjectFunding = ({ snackbarHandle }) => {
  const { projectId } = useParams();
  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <ProjectFundingTable
            projectId={projectId}
            snackbarHandle={snackbarHandle}
          />
        </Grid>
        <Grid item xs={12}>
          <ProjectWorkActivitiesTable
            projectId={projectId}
            snackbarHandle={snackbarHandle}
          />
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectFunding;
