import Grid from "@mui/material/Grid";
import ProjectFundingTable from "src/views/projects/projectView/ProjectFunding/ProjectFundingTable";
import ProjectWorkActivitiesTable from "src/views/projects/projectView/ProjectWorkActivity/ProjectWorkActivityTable";
import { useParams } from "react-router-dom";
import { HandleSnackbar } from "src/components/useFeedbackSnackbar";
import { ApolloQueryResult } from "@apollo/client";
import { ProjectSummaryQuery } from "src/gql/graphql";

interface ProjectFundingProps {
  handleSnackbar: HandleSnackbar;
  refetch: () => Promise<ApolloQueryResult<ProjectSummaryQuery>>;
  data: ProjectSummaryQuery;
}

const ProjectFunding = ({
  handleSnackbar,
  refetch: refetchProjectSummary,
  data: projectData,
}: ProjectFundingProps) => {
  const { projectId } = useParams();
  const eCaprisSubprojectId =
    projectData?.moped_project?.[0]?.ecapris_subproject_id ?? null;
  const shouldSyncEcaprisFunding =
    projectData?.moped_project?.[0]?.should_sync_ecapris_funding ?? false;

  return (
    <Grid container spacing={4}>
      <Grid size={12}>
        <ProjectFundingTable
          projectId={projectId}
          handleSnackbar={handleSnackbar}
          refetchProjectSummary={refetchProjectSummary}
          eCaprisSubprojectId={eCaprisSubprojectId}
          shouldSyncEcaprisFunding={shouldSyncEcaprisFunding}
        />
      </Grid>
      <Grid size={12}>
        <ProjectWorkActivitiesTable
          // @ts-expect-error - Migrating work activities table is captured in issue #
          projectId={projectId}
          handleSnackbar={handleSnackbar}
        />
      </Grid>
    </Grid>
  );
};

export default ProjectFunding;
