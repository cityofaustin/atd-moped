import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

import ProjectSummaryTable from "./ProjectSummaryTable";
import ProjectSummaryMap from "./ProjectSummaryMap";
import ProjectSummaryEditMap from "./ProjectSummaryEditMap";
import { createFeatureCollectionFromProjectFeatures } from "../../../utils/mapHelpers";

import { Grid, CardContent, CircularProgress } from "@material-ui/core";
import { SUMMARY_QUERY } from "../../../queries/project";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";

/*
  Error Handler and Fallback Component
*/
import ProjectSummaryMapFallback from "./ProjectSummaryMapFallback";
import { ErrorBoundary } from "react-error-boundary";

const ProjectSummary = () => {
  const { projectId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [mapError, setMapError] = useState(false);

  const { loading, error, data, refetch } = useQuery(SUMMARY_QUERY, {
    variables: { projectId },
  });

  if (loading) return <CircularProgress />;
  if (error) return `Error! ${error.message}`;

  const projectFeatureRecords = data?.moped_project[0]?.moped_proj_features;
  const projectFeatureCollection = createFeatureCollectionFromProjectFeatures(
    projectFeatureRecords
  );

  return (
    <ApolloErrorHandler errors={error}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
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
                FallbackComponent={({ error, resetErrorBoundary}) => (
                  <ProjectSummaryMapFallback
                    error={error}
                    resetErrorBoundary={resetErrorBoundary}
                    projectId={projectId}
                    setIsEditing={setIsEditing}
                    refetchProjectDetails={refetch}
                    mapData={projectFeatureCollection}
                  />
                )}
                onReset={() => setMapError(false)}
                resetKeys={[mapError]}
              >
                <ProjectSummaryMap
                  projectExtentGeoJSON={projectFeatureCollection}
                  setIsEditing={setIsEditing}
                />
              </ErrorBoundary>
            )}
            {isEditing && (
              <ProjectSummaryEditMap
                projectId={projectId}
                projectFeatureRecords={projectFeatureRecords}
                projectFeatureCollection={projectFeatureCollection}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                refetchProjectDetails={refetch}
              />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </ApolloErrorHandler>
  );
};

export default ProjectSummary;
