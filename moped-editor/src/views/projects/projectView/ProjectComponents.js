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
  ClickAwayListener,
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
    backgroundColor: theme.palette.background.paper,
    "&:hover": {
      background: "#f5f5f5", // Gray 50
    }
  },
  componentItemBlue: {
    cursor: "pointer",
    backgroundColor: "#e1f5fe", // Lightblue 50
    "&:hover": {
      background: "#b3e5fc", // Lightblue 100
    }
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
  const [componentCurrentlySelected, setComponentCurrentlySelected] = useState(
    0
  );
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

  /**
   * Handles logic whenever a component is clicked
   * @param componentId - The Database id of the component in question
   */
  const handleComponentClick = componentId => {
    setComponentCurrentlySelected(componentId);
  };

  /**
   * Resets the color of a selected component back to white
   */
  const handleComponentClickAway = () => setComponentCurrentlySelected(0);

  return (
    <ApolloErrorHandler errors={error}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper className={classes.root}>
              <ClickAwayListener onClickAway={handleComponentClickAway}>
                <TableContainer className={classes.container}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Component</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Subtype</TableCell>
                        <TableCell>Sub-Components</TableCell>
                        <TableCell>Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.moped_proj_components.map(
                        (component, compIndex) => {
                          const componentId = component.project_component_id;
                          return (
                            <TableRow
                              role="checkbox"
                              tabIndex={compIndex}
                              key={"mcTableRow-" + componentId}
                              onClick={() => handleComponentClick(componentId)}
                              className={
                                componentId === componentCurrentlySelected
                                  ? classes.componentItemBlue
                                  : classes.componentItem
                              }
                            >
                              <TableCell>{component?.name}</TableCell>
                              <TableCell>
                                {component?.moped_components?.component_type}
                              </TableCell>
                              <TableCell>
                                {component?.moped_components?.component_subtype}
                              </TableCell>
                              <TableCell>
                                {[...new Set(component.moped_proj_features_components.map(
                                  subcomponent => subcomponent.name
                                ))].join(", ")}
                              </TableCell>
                              <TableCell align={"center"}>
                                <DoubleArrowIcon />
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ClickAwayListener>
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
