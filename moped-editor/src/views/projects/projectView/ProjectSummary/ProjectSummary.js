import React, { useState } from "react";
import { useParams } from "react-router-dom";

import ProjectSummaryMap from "./ProjectSummaryMap";
import ProjectSummaryStatusUpdate from "./ProjectSummaryStatusUpdate";
import { createProjectFeatureCollection } from "src/utils/projectComponentHelpers";

import { Grid, CardContent, CircularProgress } from "@material-ui/core";
import ApolloErrorHandler from "../../../../components/ApolloErrorHandler";

/*
  Error Handler and Fallback Component
*/
import ProjectSummaryMapFallback from "./ProjectSummaryMapFallback";
import { ErrorBoundary } from "react-error-boundary";
import ProjectSummaryProjectEntity from "./ProjectSummaryProjectEntity";
import ProjectSummaryProjectPartners from "./ProjectSummaryProjectPartners";

import makeStyles from "@material-ui/core/styles/makeStyles";
import ProjectSummarySnackbar from "./ProjectSummarySnackbar";
import ProjectSummaryProjectWebsite from "./ProjectSummaryProjectWebsite";
import ProjectSummaryProjectDescription from "./ProjectSummaryProjectDescription";
import ProjectSummaryParentProjectLink from "./ProjectSummaryParentProjectLink";
import ProjectSummaryProjectECapris from "./ProjectSummaryProjectECapris";
import ProjectSummaryProjectTypes from "./ProjectSummaryProjectTypes";
import ProjectSummaryKnackDataTrackerSync from "./ProjectSummaryKnackDataTrackerSync";
import ProjectSummaryWorkOrders from "./ProjectSummaryWorkOrders";
import ProjectSummaryInterimID from "./ProjectSummaryInterimID";

import { countFeatures } from "../../../../utils/mapHelpers";
import SubprojectsTable from "./SubprojectsTable";
import TagsSection from "./TagsSection";

const useStyles = makeStyles((theme) => ({
  fieldGridItem: {
    marginBottom: theme.spacing(3),
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
    paddingLeft: theme.spacing(0.5),
  },
  fieldLabelText: {
    width: "calc(100% - 2rem)",
    paddingLeft: theme.spacing(0.5),
    "&:hover": {
      backgroundColor: theme.palette.background.summaryHover,
      borderRadius: theme.spacing(0.5),
      cursor: "pointer",
    },
  },
  fieldAuthor: {
    marginRight: ".25rem",
    fontSize: ".8rem",
    fontWeight: "bold",
  },
  knackFieldLabelText: {
    width: "calc(100% - 2rem)",
    cursor: "pointer",
  },
  fieldLabelTextSpanNoBorder: {
    borderBottom: "inherit",
  },
  fieldLabelLink: {
    width: "calc(100% - 2rem)",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  fieldBox: {
    width: "100%",
  },
  fieldSelectItem: {
    width: "calc(100% - 3rem)",
  },
  dialogTitle: {
    fontFamily: theme.typography.fontFamily,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  newStatusIconDiv: {
    display: "flex",
    alignItems: "center",
  },
  fieldLabelDataTrackerLink: {
    width: "calc(100% - 2rem)",
    paddingLeft: theme.spacing(0.5),
  },
  tooltipIcon: {
    fontSize: "20px",
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

  const projectComponents = data?.moped_project[0]?.moped_proj_components || [];
  const projectFeatureCollection =
    createProjectFeatureCollection(projectComponents);

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
        <ProjectSummaryMap
          projectFeatureCollection={projectFeatureCollection}
        />
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
            <Grid container spacing={0}>
              <ProjectSummaryProjectDescription
                projectId={projectId}
                data={data}
                refetch={refetch}
                classes={classes}
                snackbarHandle={snackbarHandle}
              />
              {data.moped_project[0]?.parent_project_id && (
                <ProjectSummaryParentProjectLink
                  projectId={projectId}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  snackbarHandle={snackbarHandle}
                />
              )}
              {/*Status Update Component*/}
              <ProjectSummaryStatusUpdate
                projectId={projectId}
                data={data}
                refetch={refetch}
                classes={classes}
              />
              <Grid item xs={12}>
                <ProjectSummaryProjectEntity
                  projectId={projectId}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  snackbarHandle={snackbarHandle}
                  entityName="Lead"
                  tooltipText="Division, department, or organization responsible for successful project implementation"
                />
              </Grid>
              <Grid item xs={12}>
                <ProjectSummaryProjectEntity
                  projectId={projectId}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  snackbarHandle={snackbarHandle}
                  entityName="Sponsor"
                  tooltipText="Division, department, or organization who is the main contributor of funds for the project"
                />
              </Grid>
              <Grid item xs={12}>
                <ProjectSummaryProjectPartners
                  projectId={projectId}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  snackbarHandle={snackbarHandle}
                  tooltipText="Other internal or external workgroups participating in the project"
                />
              </Grid>
              <Grid item xs={12}>
                <ProjectSummaryProjectTypes
                  projectId={projectId}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  snackbarHandle={snackbarHandle}
                />
              </Grid>
              <Grid item xs={12}>
                <ProjectSummaryProjectWebsite
                  projectId={projectId}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  snackbarHandle={snackbarHandle}
                />
              </Grid>
              <Grid item xs={12}>
                <ProjectSummaryInterimID
                  projectId={projectId}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  snackbarHandle={snackbarHandle}
                />
              </Grid>
              <Grid item xs={12}>
                <ProjectSummaryProjectECapris
                  projectId={projectId}
                  data={data}
                  refetch={refetch}
                  classes={classes}
                  snackbarHandle={snackbarHandle}
                />
              </Grid>
              <Grid item xs={12}>
                <ProjectSummaryKnackDataTrackerSync
                  classes={classes}
                  project={data?.moped_project?.[0]}
                  refetch={refetch}
                  snackbarHandle={snackbarHandle}
                />
              </Grid>
              <Grid item xs={12}>
                <ProjectSummaryWorkOrders
                  classes={classes}
                  project={data?.moped_project?.[0]}
                  refetch={refetch}
                  snackbarHandle={snackbarHandle}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <TagsSection projectId={projectId} />
              </Grid>
              <Grid item xs={12}>
                {!data.moped_project[0].parent_project_id && (
                  <SubprojectsTable projectId={projectId} />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </ApolloErrorHandler>
  );
};

export default ProjectSummary;
