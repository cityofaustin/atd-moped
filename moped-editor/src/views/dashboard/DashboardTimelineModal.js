import React, { useCallback, useState } from "react";
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
import FeedbackSnackbar from "src/components/FeedbackSnackbar";

const useStyles = makeStyles((theme) => ({
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

  /* Snackbar state and handler for phase and milestone update feedback */
  const [snackbarState, setSnackbarState] = useState(false);

  /**
   * Wrapper around snackbar state setter
   * @param {boolean} open - The new state of open
   * @param {String} message - The message for the snackbar
   * @param {String} severity - The severity color of the snackbar
   * @param {Object} error - The error to be displayed and logged
   */
  const handleSnackbar = useCallback(
    (open, message, severity, error) => {
      // if there is an error, render error message,
      // otherwise, render success message
      if (error) {
        setSnackbarState({
          open: open,
          message: `${message}. Refresh the page to try again.`,
          severity: severity,
        });
        console.error(error);
      } else {
        setSnackbarState({
          open: open,
          message: message,
          severity: severity,
        });
      }
    },
    [setSnackbarState]
  );

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
      <FeedbackSnackbar
        snackbarState={snackbarState}
        handleSnackbar={handleSnackbar}
      />
    </>
  );
};

export default DashboardTimelineModal;
