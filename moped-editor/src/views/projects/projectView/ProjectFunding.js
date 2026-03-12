import React from "react";
import Grid2 from "@mui/material/Grid2";
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
    projectData?.moped_project?.[0]?.should_sync_ecapris_funding ?? false;

  return (
    <Grid2 container spacing={4}>
      <Grid2 size={12}>
        <ProjectFundingTable
          projectId={projectId}
          handleSnackbar={handleSnackbar}
          refetchProjectSummary={refetchProjectSummary}
          eCaprisSubprojectId={eCaprisSubprojectId}
          shouldSyncEcaprisFunding={shouldSyncEcaprisFunding}
        />
      </Grid2>
      <Grid2 size={12}>
        <ProjectWorkActivitiesTable
          projectId={projectId}
          handleSnackbar={handleSnackbar}
        />
      </Grid2>
    </Grid2>
  );
};

export default ProjectFunding;
