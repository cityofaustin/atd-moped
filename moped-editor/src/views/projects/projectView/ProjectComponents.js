import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { COMPONENTS_QUERY } from "../../../queries/project";
import {
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  CircularProgress,
  ClickAwayListener,
  Icon,
  Button,
} from "@material-ui/core";

import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import { ErrorBoundary } from "react-error-boundary";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import ProjectComponentsMapView from "./ProjectComponentsMapView";
import { createFeatureCollectionFromProjectFeatures } from "../../../utils/mapHelpers";
import ProjectSummaryMapFallback from "./ProjectSummaryMapFallback";
import ProjectComponentEdit from "./ProjectComponentEdit";
import Alert from "@material-ui/lab/Alert";

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
    },
  },
  componentItemBlue: {
    cursor: "pointer",
    backgroundColor: "#e1f5fe", // Lightblue 50
    "&:hover": {
      background: "#b3e5fc", // Lightblue 100
    },
  },
  componentButtonAddNew: {
    marginTop: theme.spacing(2),
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

  const [selectedComp, setSelectedComp] = useState(0);
  const [mapError, setMapError] = useState(false);
  const [componentEditMode, setComponentEditMode] = useState(false);

  const { error, loading, data, refetch } = useQuery(COMPONENTS_QUERY, {
    variables: {
      projectId,
    },
  });

  // Return loading if not in progress
  if (loading) return <CircularProgress />;

  if (error) return <div>{JSON.stringify(error)}</div>;

  /**
   * Retrieve and flatten a nested list of features:
   *  moped_proj_components -> moped_proj_features_components -> moped_proj_feature
   */
  const projectFeatureRecords = data.moped_proj_components.reduce(
    (accumulator, component) => [
      ...accumulator,
      // Append if current component is selected, or none are selected (0)
      ...(selectedComp === component.project_component_id || selectedComp === 0
        ? component.moped_proj_features_components.map(featureComponent => ({
            ...featureComponent.moped_proj_feature,
            project_features_components_id:
              featureComponent.project_features_components_id,
          }))
        : []),
    ],
    []
  );

  /**
   * Reuses this function to generate a collection for the map
   * @type {Object}
   */
  const projectFeatureCollection = createFeatureCollectionFromProjectFeatures(
    projectFeatureRecords
  );

  /**
   * Handles logic whenever a component is clicked, refreshes whatever is in memory and re-renders
   * @param clickedComponentId - The Database id of the component in question
   */
  const handleComponentClick = clickedComponentId =>
    setSelectedComp(clickedComponentId);

  /**
   * Resets the color of a selected component back to white
   */
  const handleComponentClickAway = () => setSelectedComp(0);

  /**
   * Takes the user to the components details page
   */
  const handleComponentDetailsClick = () => {
    setComponentEditMode(true);
  };

  /**
   * Handles add component button logic
   */
  const handleAddNewComponentClick = () => {
    setSelectedComp(0);
    handleComponentDetailsClick();
  };

  /**
   * Takes the user back to the components list for a project
   */
  const handleCancelEdit = () => {
    setComponentEditMode(false);
    setSelectedComp(0);
  };

  /**
   * This is a helper variable that stores true if we have components, false otherwise.
   * @constant
   * @type {boolean}
   */
  const componentsAvailable = data && data.moped_proj_components.length > 0;

  return (
    <ApolloErrorHandler errors={error}>
      <CardContent>
        {componentEditMode && (
          <ProjectComponentEdit
            componentId={selectedComp}
            handleCancelEdit={handleCancelEdit}
            projectFeatureRecords={projectFeatureRecords}
            projectFeatureCollection={projectFeatureCollection}
            projectRefetchFeatures={refetch}
          />
        )}
        {!componentEditMode && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {componentsAvailable && (
                <Paper className={classes.root}>
                  <ClickAwayListener onClickAway={handleComponentClickAway}>
                    <TableContainer className={classes.container}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>Subtype</TableCell>
                            <TableCell>Sub-Components</TableCell>
                            <TableCell>Details</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.moped_proj_components.map(
                            (component, compIndex) => {
                              const projComponentId =
                                component.project_component_id;
                              return (
                                <TableRow
                                  role="checkbox"
                                  tabIndex={compIndex}
                                  key={"mcTableRow-" + projComponentId}
                                  onClick={() =>
                                    handleComponentClick(projComponentId)
                                  }
                                  className={
                                    projComponentId === selectedComp
                                      ? classes.componentItemBlue
                                      : classes.componentItem
                                  }
                                >
                                  <TableCell>
                                    {
                                      component?.moped_components
                                        ?.component_type
                                    }
                                  </TableCell>
                                  <TableCell>
                                    {
                                      component?.moped_components
                                        ?.component_subtype
                                    }
                                  </TableCell>
                                  <TableCell>
                                    {[
                                      ...new Set(
                                        component.moped_proj_components_subcomponents.map(
                                          mpcs =>
                                            mpcs.moped_subcomponent
                                              .subcomponent_name
                                        )
                                      ),
                                    ]
                                      .sort()
                                      .join(", ")}
                                  </TableCell>
                                  <TableCell align={"center"}>
                                    <DoubleArrowIcon
                                      onClick={handleComponentDetailsClick}
                                    />
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
              )}
              {!componentsAvailable && (
                <Alert severity="info">
                  There aren't any components for this project.
                </Alert>
              )}
              <Button
                className={classes.componentButtonAddNew}
                onClick={handleAddNewComponentClick}
                variant="outlined"
                color="default"
                size={"large"}
                startIcon={<Icon>add</Icon>}
              >
                Add new component
              </Button>
            </Grid>
            {componentsAvailable && (
              <Grid item xs={12} md={6}>
                <ErrorBoundary
                  FallbackComponent={({ error, resetErrorBoundary }) => (
                    <ProjectSummaryMapFallback
                      error={error}
                      resetErrorBoundary={resetErrorBoundary}
                      projectId={projectId}
                      setIsEditing={null}
                      refetchProjectDetails={refetch}
                      mapData={projectFeatureCollection}
                    />
                  )}
                  onReset={() => setMapError(false)}
                  resetKeys={[mapError]}
                >
                  <ProjectComponentsMapView
                    projectFeatureCollection={projectFeatureCollection}
                    setIsEditing={false}
                  />
                </ErrorBoundary>
              </Grid>
            )}
          </Grid>
        )}
      </CardContent>
    </ApolloErrorHandler>
  );
};

export default ProjectComponents;
