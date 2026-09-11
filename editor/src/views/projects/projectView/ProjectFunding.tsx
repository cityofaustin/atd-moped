import Grid from "@mui/material/Grid";
import ProjectFundingTable from "src/views/projects/projectView/ProjectFunding/ProjectFundingTable";
import ProjectWorkActivitiesTable from "src/views/projects/projectView/ProjectWorkActivity/ProjectWorkActivityTable";
import type { ApolloQueryResult } from "@apollo/client";
import type { ProjectSummaryQuery } from "src/gql/graphql";
import type { HandleSnackbar } from "src/components/useFeedbackSnackbar";

interface ProjectFundingProps {
  /** The project ID for which funding information is being displayed. */
  projectId: number;
  /** Function to handle snackbar notifications for user feedback. */
  handleSnackbar: HandleSnackbar;
  /** Function to refetch the project summary data. */
  refetch: () => Promise<ApolloQueryResult<ProjectSummaryQuery>>;
  /** The project summary data fetched. */
  data: ProjectSummaryQuery;
}

const ProjectFunding = ({
  projectId,
  handleSnackbar,
  refetch: refetchProjectSummary,
  data: projectData,
}: ProjectFundingProps) => {
  const eCaprisSubprojectId =
    projectData?.moped_project?.[0].ecapris_subproject_id ?? null;
  const shouldSyncEcaprisFunding =
    projectData?.moped_project?.[0].should_sync_ecapris_funding ?? false;

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
          // @ts-expect-error - Migrating work activities table is captured in issue #29951
          projectId={projectId}
          handleSnackbar={handleSnackbar}
        />
      </Grid>
    </Grid>
  );
};

export default ProjectFunding;
