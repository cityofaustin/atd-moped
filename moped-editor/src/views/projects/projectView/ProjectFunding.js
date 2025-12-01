import React from "react";
import Grid from "@mui/material/Grid";
import ProjectFundingTable from "src/views/projects/projectView/ProjectFunding/ProjectFundingTable";
import ProjectWorkActivitiesTable from "src/views/projects/projectView/ProjectWorkActivity/ProjectWorkActivityTable";
import { useParams } from "react-router-dom";

const ProjectFunding = ({
  handleSnackbar,
  refetch: refetchProjectSummary,
  data: projectData,
}) => {
  const { projectId } = useParams();
  const eCaprisSubprojectId =
    projectData?.moped_project?.[0]?.ecapris_subproject_id ?? null;
  const shouldSyncEcaprisFunding =
    projectData?.moped_project?.[0]?.shouldSyncEcaprisFunding ?? false;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <ProjectFundingTable
          projectId={projectId}
          handleSnackbar={handleSnackbar}
          refetchProjectSummary={refetchProjectSummary}
          eCaprisSubprojectId={eCaprisSubprojectId}
          shouldSyncEcaprisFunding={shouldSyncEcaprisFunding}
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
