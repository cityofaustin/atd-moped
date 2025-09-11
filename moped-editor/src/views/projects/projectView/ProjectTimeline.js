import React from "react";

// Material
import { Box, CardContent, CircularProgress, Grid } from "@mui/material";

// Query
import { TIMELINE_QUERY } from "../../../queries/project";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

import ProjectPhases from "./ProjectPhases";
import ProjectMilestones from "./ProjectMilestones";

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

  // If the query is loading or data object is undefined,
  // stop here and just render the spinner.
  if (loading || !data) return <CircularProgress />;

  return (
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box mb={2} style={{ maxWidth: "100%" }}>
            <ProjectPhases
              projectId={projectId}
              data={data}
              refetch={refetch}
              handleSnackbar={handleSnackbar}
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
              handleSnackbar={handleSnackbar}
            />
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default ProjectTimeline;
