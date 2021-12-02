import React from "react";
import ProjectFundingTable from "./ProjectFundingTable";
import { useParams } from "react-router-dom";

import { CardContent, Grid } from "@material-ui/core";

const ProjectFunding = () => {
  const { projectId } = useParams();

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ProjectFundingTable projectId={projectId} />
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectFunding;
