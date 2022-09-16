import React from "react";

// Material
import { Box, CardContent, CircularProgress, Grid } from "@material-ui/core";

// Query
import { TIMELINE_QUERY } from "../../../queries/project";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

import ProjectPhases from "./ProjectPhases";
import ProjectMilestones from "./ProjectMilestones";

/**
 * ProjectTimeline Component - renders the view displayed when the "Timeline"
 * tab is active
 * @return {JSX.Element}
 * @constructor
 */
const ProjectTimeline = (props) => {
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
  const { loading, error, data, refetch } = useQuery(TIMELINE_QUERY, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  const projectViewRefetch = props.refetch;

  // If the query is loading or data object is undefined,
  // stop here and just render the spinner.
  if (loading || !data) return <CircularProgress />;

  return (
    <ApolloErrorHandler error={error}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box mb={2} style={{ maxWidth: "100%" }}>
              <ProjectPhases
                projectId={projectId}
                loading={loading}
                data={data}
                refetch={refetch}
                projectViewRefetch={projectViewRefetch}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box style={{ maxWidth: "100%" }}>
              <ProjectMilestones
                projectId={projectId}
                loading={loading}
                data={data}
                refetch={refetch}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </ApolloErrorHandler>
  );
};

export default ProjectTimeline;
