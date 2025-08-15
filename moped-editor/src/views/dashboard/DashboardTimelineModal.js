import React, { useState } from "react";
import {
  Box,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TIMELINE_QUERY } from "src/queries/project";
import { useQuery } from "@apollo/client";
import ApolloErrorHandler from "src/components/ApolloErrorHandler";
import ProjectMilestones from "src/views/projects/projectView/ProjectMilestones";
import ProjectPhases from "src/views/projects/projectView/ProjectPhases";

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
  const { loading, error, data, refetch } = useQuery(TIMELINE_QUERY, {
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
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth={"xl"}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          variant="h4"
        >
          {`Update ${table} - ${projectName}`}
          <IconButton onClick={() => handleDialogClose()} size="large">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ApolloErrorHandler error={error}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box mb={2} style={{ maxWidth: "100%" }}>
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
          </ApolloErrorHandler>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardTimelineModal;
