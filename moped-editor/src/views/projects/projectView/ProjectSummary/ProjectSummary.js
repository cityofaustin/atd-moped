import React, { useState } from "react";
import { useParams } from "react-router-dom";

import ProjectSummaryMap from "./ProjectSummaryMap";
import ProjectSummaryStatusUpdate from "./ProjectSummaryStatusUpdate";
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
import ProjectSummaryProjectECapris from "./ProjectSummaryProjectECapris";
import ProjectSummaryProjectTypes from "./ProjectSummaryProjectTypes";
import ProjectSummaryKnackDataTrackerSync from "./ProjectSummaryKnackDataTrackerSync";

import { countFeatures } from "../../../../utils/mapHelpers";

const useStyles = makeStyles(theme => ({
  fieldGridItem: {
    margin: theme.spacing(2),
  },
  linkIcon: {
    fontSize: "1rem",
  },
  syncLinkIcon: {
    fontSize: "1.2rem",

  },
  editIcon: {
    cursor: "pointer",
    margin: "0 .5rem",
    fontSize: "20px",
  },
  editIconConfirm: {
    cursor: "pointer",
    margin: ".25rem 0",
    fontSize: "24px",
  },
  fieldLabel: {
    width: "100%",
    color: theme.palette.text.secondary,
    fontSize: ".8rem",
  },
  fieldLabelText: {
    width: "calc(100% - 2rem)",
  },
  fieldLabelTextSpan: {
    borderBottom: "1px dashed",
    borderBottomColor: theme.palette.text.secondary,
  },
  fieldLabelLink: {
    width: "calc(100% - 2rem)",
    overflow: "hidden",
    whiteSpace: "nowrap",
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
 * @param {Object} data - The query data
 * @param {function} refetch - A function to reload the data
 * @return {JSX.Element}
 * @constructor
 */
const ProjectSummary = ({ loading, error, data, refetch }) => {
  const { projectId } = useParams();
  const classes = useStyles();

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

  const renderMap = () => {
    if (countFeatures(projectFeatureCollection) < 1) {
      return (
        <ProjectSummaryMapFallback
          projectId={projectId}
          refetchProjectDetails={refetch}
          mapData={projectFeatureCollection}
        />
      );
    } else {
      return (
        <ProjectSummaryMap projectExtentGeoJSON={projectFeatureCollection} />
      );
    }
  };

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
            <Grid container spacing={0}>
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
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <ProjectSummaryProjectTypes
                  projectId={projectId}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  snackbarHandle={snackbarHandle}
                />
              </Grid>
              <Grid item xs={6}>
                <ProjectSummaryProjectWebsite
                  projectId={projectId}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  snackbarHandle={snackbarHandle}
                />
              </Grid>
            </Grid>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <ProjectSummaryKnackDataTrackerSync
                  classes={classes}
                  project={data?.moped_project?.[0]}
                  refetch={refetch}
                  snackbarHandle={snackbarHandle}
                />
              </Grid>
              <Grid item xs={6}>
                <ProjectSummaryProjectECapris
                  projectId={projectId}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  snackbarHandle={snackbarHandle}
                />
              </Grid>
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
                {renderMap()}
              </ErrorBoundary>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </ApolloErrorHandler>
  );
};

export default ProjectSummary;
