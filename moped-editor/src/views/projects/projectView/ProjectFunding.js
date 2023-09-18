import React from "react";
import ProjectFundingTable from "./ProjectFundingTable";

import ProjectWorkActivitiesTable from "./ProjectWorkActivity/ProjectWorkActivityTable";
import { useParams } from "react-router-dom";

import { CardContent, Grid } from "@mui/material";

const ProjectFunding = () => {
  const { projectId } = useParams();
  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <ProjectFundingTable projectId={projectId} />
        </Grid>
        <Grid item xs={12}>
          <ProjectWorkActivitiesTable projectId={projectId} />
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectFunding;
