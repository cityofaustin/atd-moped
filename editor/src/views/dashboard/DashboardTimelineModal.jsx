import React, { useState } from "react";
import { Box, CardContent, Grid } from "@mui/material";
import { TIMELINE_QUERY } from "src/queries/project";
import { useQuery } from "@apollo/client";
import ProjectMilestones from "src/views/projects/projectView/ProjectMilestones";
import ProjectPhases from "src/views/projects/projectView/ProjectPhases";
import FormDialog from "src/components/FormDialog";

const DashboardTimelineModal = ({
  table,
  projectId,
  projectName,
  dashboardRefetch,
  handleSnackbar,
  children,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    dashboardRefetch();
  };

  return (
    <>
      <Box
        sx={{
          cursor: "pointer",
        }}
        onClick={() => setIsDialogOpen(true)}
      >
        {children}
      </Box>
      <FormDialog
        title={`Update ${table} - ${projectName}`}
        open={isDialogOpen}
        handleClose={handleDialogClose}
        dialogProps={{ maxWidth: "xl" }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Box
                style={{ maxWidth: "100%" }}
                sx={{
                  mb: 2,
                }}
              >
                {table === "phases" && (
                  <ProjectPhases
                    projectId={projectId}
                    loading={loading}
                    data={data}
                    refetch={refetch}
                    handleSnackbar={handleSnackbar}
                  />
                )}
                {table === "milestones" && (
                  <ProjectMilestones
                    projectId={projectId}
                    loading={loading}
                    data={data}
                    refetch={refetch}
                    handleSnackbar={handleSnackbar}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </FormDialog>
    </>
  );
};
export default DashboardTimelineModal;
