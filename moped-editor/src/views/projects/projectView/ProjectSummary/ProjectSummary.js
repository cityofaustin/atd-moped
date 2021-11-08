import React, { useState } from "react";
import { useParams } from "react-router-dom";

import ProjectSummaryTable from "./ProjectSummaryTable";
import ProjectSummaryMap from "./ProjectSummaryMap";
import ProjectSummaryStatusUpdate from "./ProjectSummaryStatusUpdate";
import ProjectSummaryCurrentPhase from "./ProjectSummaryCurrentPhase";
import { createFeatureCollectionFromProjectFeatures } from "../../../../utils/mapHelpers";

import { Grid, CardContent, CircularProgress } from "@material-ui/core";
import ApolloErrorHandler from "../../../../components/ApolloErrorHandler";

/*
  Error Handler and Fallback Component
*/
import ProjectSummaryMapFallback from "./ProjectSummaryMapFallback";
import { ErrorBoundary } from "react-error-boundary";
import ProjectSummaryProjectSponsor from "./ProjectSummaryProjectSponsor";
import ProjectSummaryProjectPartners from "./ProjectSummaryProjectPartners";

import makeStyles from "@material-ui/core/styles/makeStyles";
import ProjectSummarySnackbar from "./ProjectSummarySnackbar";
import ProjectSummaryProjectWebsite from "./ProjectSummaryProjectWebsite";
import ProjectSummaryProjectDescription from "./ProjectSummaryProjectDescription";
import ProjectSummaryCurrentStatus from "./ProjectSummaryCurrentStatus";

const useStyles = makeStyles(theme => ({
  fieldGridItem: {
    margin: theme.spacing(2),
  },
  linkIcon: {
    fontSize: "1rem",
  },
  editIcon: {
    cursor: "pointer",
    margin: ".25rem",
    fontSize: "20px",
  },
  editIconConfirm: {
    cursor: "pointer",
    margin: ".25rem 0",
    fontSize: "24px",
  },
  fieldLabel: {
    width: "100%",
    color: theme.palette.grey["600"],
    fontSize: ".8rem",
  },
  fieldLabelText: {
    width: "calc(100% - 2rem)",
  },
  fieldBox: {
    width: "100%",
  },
  fieldBoxTypography: {
    width: "100%",
  },
  fieldSelectItem: {
    width: "calc(100% - 3rem)",
  },
}));

/**
 * Project Summary Component
 * @param {boolean} loading - True if it is loading
 * @param {Object} error - Error content if provided
 * @param {Object} data - THe query data
 * @param {function} refetch - A function to reload the data
 * @return {JSX.Element}
 * @constructor
 */
const ProjectSummary = ({ loading, error, data, refetch }) => {
  const { projectId } = useParams();
  const classes = useStyles();

  const [makeSureRefresh, setMakeSureRefresh] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [snackbarState, setSnackbarState] = useState(false);

  /**
   * Updates the state of snackbar state
   * @param {String|JSX.Element} message - The message to be displayed
   * @param {String} severity - Usually "success" or "error"
   */
  const snackbarHandle = (open = true, message, severity = "success") => {
    setSnackbarState({
      open: open,
      message: message,
      severity: severity,
    });
  };

  if (loading) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  const projectFeatureRecords = data?.moped_project[0]?.moped_proj_features;
  const projectFeatureCollection = createFeatureCollectionFromProjectFeatures(
    projectFeatureRecords
  );

  if (projectFeatureRecords.length === 0 && !makeSureRefresh)
    setMakeSureRefresh(true);

  return (
    <ApolloErrorHandler errors={error}>
      <ProjectSummarySnackbar
        snackbarState={snackbarState}
        snackbarHandle={snackbarHandle}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ProjectSummaryProjectDescription
              projectId={projectId}
              data={data}
              refetch={refetch}
              classes={classes}
              snackbarHandle={snackbarHandle}
            />
            {/*Status Update Component*/}
            <ProjectSummaryStatusUpdate
              projectId={projectId}
              data={data}
              refetch={refetch}
              classes={classes}
            />
            <ProjectSummaryCurrentPhase
              projectId={projectId}
              data={data}
              classes={classes}
            />
            <Grid container spacing={2} xs={12}>
              <Grid item xs={6}>
                <ProjectSummaryCurrentStatus
                  projectId={projectId}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  snackbarHandle={snackbarHandle}
                />
              </Grid>
              <Grid item xs={6}>
                {null}
              </Grid>
            </Grid>
            <Grid container spacing={2} xs={12}>
              <Grid item xs={6}>
                <ProjectSummaryProjectSponsor
                  projectId={projectId}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  snackbarHandle={snackbarHandle}
                />
              </Grid>
              <Grid item xs={6}>
                <ProjectSummaryProjectPartners
                  projectId={projectId}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  snackbarHandle={snackbarHandle}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} xs={12}>
              <ProjectSummaryProjectWebsite
                projectId={projectId}
                data={data}
                refetch={refetch}
                classes={classes}
                snackbarHandle={snackbarHandle}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            {projectFeatureCollection && (
              <ErrorBoundary
                FallbackComponent={({ error, resetErrorBoundary }) => (
                  <ProjectSummaryMapFallback
                    error={error}
                    resetErrorBoundary={resetErrorBoundary}
                    projectId={projectId}
                    refetchProjectDetails={refetch}
                    mapData={projectFeatureCollection}
                  />
                )}
                onReset={() => setMapError(false)}
                resetKeys={[mapError]}
              >
                <ProjectSummaryMap
                  projectExtentGeoJSON={projectFeatureCollection}
                />
              </ErrorBoundary>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </ApolloErrorHandler>
  );
};

export default ProjectSummary;
