import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { COMPONENTS_QUERY } from "../../../queries/project";
import {
  CardContent,
  Grid,
  Icon,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  CircularProgress,
} from "@material-ui/core";

import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import { ErrorBoundary } from "react-error-boundary";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import ProjectComponentsMap from "./ProjectComponentsMap";
import { createFeatureCollectionFromProjectFeatures } from "../../../utils/mapHelpers";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  componentItem: {
    cursor: "pointer",
  },
}));
/**
 * Project Component Page
 * @return {JSX.Element}
 * @constructor
 */
const ProjectComponents = () => {
  const { projectId } = useParams();
  const classes = useStyles();

  const [componentsList, setComponentsList] = useState({});
  const [mapError, setMapError] = useState(false);

  const { error, loading, data, refetch } = useQuery(COMPONENTS_QUERY, {
    variables: {
      projectId,
    },
  });

  const projectFeatureRecords =
    data?.moped_proj_components[0]?.moped_proj_features_components
      ?.moped_proj_features ?? [];

  const projectFeatureCollection = createFeatureCollectionFromProjectFeatures(
    projectFeatureRecords
  );

  if (loading) return <CircularProgress />;

  const handleComponentClick = e => {
    debugger;
  };

  return (
    <ApolloErrorHandler errors={error}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper className={classes.root}>
              <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Component</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Subtype</TableCell>
                      <TableCell>Sub-Components</TableCell>
                      <TableCell align="right">Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.moped_proj_components.map((component, compIndex) => {
                      const componentId = component.project_component_id;
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={compIndex}
                          key={"mcTableRow-" + componentId}
                          className={classes.componentItem}
                          onClick={() => handleComponentClick(componentId)}
                        >
                          <TableCell>{component?.name}</TableCell>
                          <TableCell>
                            {component?.moped_components?.component_type}
                          </TableCell>
                          <TableCell>
                            {component?.moped_components?.component_subtype}
                          </TableCell>
                          <TableCell>SubComponents</TableCell>
                          <TableCell>
                            <DoubleArrowIcon />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <ErrorBoundary
              FallbackComponent={({ error, resetErrorBoundary }) => (
                // <ProjectSummaryMapFallback
                //   error={error}
                //   resetErrorBoundary={resetErrorBoundary}
                //   projectId={projectId}
                //   setIsEditing={setIsEditing}
                //   refetchProjectDetails={refetch}
                //   mapData={projectFeatureCollection}
                // />
                <div>Something bad happened: {error}</div>
              )}
              onReset={() => setMapError(false)}
              resetKeys={[mapError]}
            >
              <ProjectComponentsMap
                projectExtentGeoJSON={projectFeatureCollection}
                setIsEditing={false}
              />
            </ErrorBoundary>
          </Grid>
        </Grid>
      </CardContent>
    </ApolloErrorHandler>
  );
};

export default ProjectComponents;
