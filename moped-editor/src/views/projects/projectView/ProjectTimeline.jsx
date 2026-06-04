import React from "react";

// Material
import { Grid2 } from "@mui/material";

// Query
import { TIMELINE_QUERY } from "src/queries/project";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

import ProjectPhases from "src/views/projects/projectView/ProjectPhases";
import ProjectMilestones from "src/views/projects/projectView/ProjectMilestones";

/**
 * ProjectTimeline Component - renders the view displayed when the "Timeline"
 * tab is active
 * @return {JSX.Element}
 * @constructor
 */
const ProjectTimeline = ({ handleSnackbar }) => {
  /** Params Hook
   * @type {integer} projectId
   * */
  let { projectId } = useParams();

  /**
   * Queries Hook
   * @type {boolean} - loading state
   * @type {object} - details and messages when there is a query error
   * @type {object} - data returned from Hasura
   * @function refetch - Provides a manual callback to update the Apollo cache
   * */
  const { loading, data, refetch } = useQuery(TIMELINE_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  return (
    <>
      <Grid2 container spacing={4}>
        <Grid2 size={12}>
          <ProjectPhases
            projectId={projectId}
            loading={loading || !data}
            data={data}
            refetch={refetch}
            handleSnackbar={handleSnackbar}
          />
        </Grid2>
        <Grid2 size={12}>
          <ProjectMilestones
            projectId={projectId}
            loading={loading || !data}
            data={data}
            refetch={refetch}
            handleSnackbar={handleSnackbar}
          />
        </Grid2>
      </Grid2>
    </>
  );
};

export default ProjectTimeline;
