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
import makeStyles from "@mui/styles/makeStyles";
import { TIMELINE_QUERY } from "src/queries/project";
import { useQuery } from "@apollo/client";
import ApolloErrorHandler from "src/components/ApolloErrorHandler";
import ProjectMilestones from "../projects/projectView/ProjectMilestones";
import ProjectPhases from "../projects/projectView/ProjectPhases";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    color: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clickableDiv: {
    cursor: "pointer",
  },
}));

const DashboardTimelineModal = ({
  table,
  projectId,
  projectName,
  dashboardRefetch,
  children,
}) => {
  const classes = useStyles();
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
      <div
        className={classes.clickableDiv}
        onClick={() => setIsDialogOpen(true)}
      >
        {children}
      </div>
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth={"xl"}
      >
        <DialogTitle className={classes.dialogTitle}>
          <h4>{`Update ${table} - ${projectName}`}</h4>
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
                      />
                    )}
                    {table === "milestones" && (
                      <ProjectMilestones
                        projectId={projectId}
                        loading={loading}
                        data={data}
                        refetch={refetch}
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
