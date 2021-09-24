import React, { useState } from "react";
import { useParams } from "react-router-dom";

import ProjectSummaryTable from "./ProjectSummaryTable";
import ProjectSummaryMap from "./ProjectSummaryMap";
import { createFeatureCollectionFromProjectFeatures } from "../../../utils/mapHelpers";

import {
  Grid,
  CardContent,
  CircularProgress,
  TextField,
} from "@material-ui/core";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

/*
  Error Handler and Fallback Component
*/
import ProjectSummaryMapFallback from "./ProjectSummaryMapFallback";
import { ErrorBoundary } from "react-error-boundary";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  fieldGridItem: {
    margin: theme.spacing(2),
  },
}));

const ProjectSummary = ({ loading, error, data, refetch }) => {
  const { projectId } = useParams();
  const classes = useStyles();

  const [makeSureRefresh, setMakeSureRefresh] = useState(false);
  const [mapError, setMapError] = useState(false);

  const [statusUpdate, setStatusUpdate] = useState(null);
  const [statusUpdateEditable, setStatusUpdateEditable] = useState(false);

  if (loading) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  const projectFeatureRecords = data?.moped_project[0]?.moped_proj_features;
  const projectFeatureCollection = createFeatureCollectionFromProjectFeatures(
    projectFeatureRecords
  );

  const statusUpdateChange = e => {
    setStatusUpdate(e.target.value);
  };

  /**
   * Retrieve the last note made as a status update (by date)
   */
  const getStatusUpdate = (fieldName = "project_note") => {
    const lastItem =
      (data?.moped_project[0]?.moped_proj_notes?.length ?? 0) - 1;
    if (lastItem >= 0) {
      // Get the data from the note
      const note =
        data.moped_project[0].moped_proj_notes[lastItem][fieldName] ?? "";
      // Remove any HTML tags
      return note ? String(note).replace(/(<([^>]+)>)/gi, "") : null;
    }
    return null;
  };

  if (projectFeatureRecords.length === 0 && !makeSureRefresh)
    setMakeSureRefresh(true);

  return (
    <ApolloErrorHandler errors={error}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {/*Status Update*/}
            <Grid item xs={12} className={classes.fieldGridItem}>
              <TextField
                id="project_note_id"
                label="Status Update"
                data-id={getStatusUpdate("project_note_id")}
                defaultValue={getStatusUpdate()}
                onChange={statusUpdateChange}
                InputProps={{
                  readOnly: !statusUpdateEditable,
                }}
              />
            </Grid>
            <ProjectSummaryTable
              loading={loading}
              data={data}
              error={error}
              refetch={refetch}
            />
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
