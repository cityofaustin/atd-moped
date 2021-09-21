import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { COMPONENTS_QUERY } from "../../../queries/project";
import {
  CircularProgress,
  ClickAwayListener,
  Icon,
  Button,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";

import { ErrorBoundary } from "react-error-boundary";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import ProjectComponentsMapView from "./ProjectComponentsMapView";
import { createFeatureCollectionFromProjectFeatures } from "../../../utils/mapHelpers";
import ProjectSummaryMapFallback from "./ProjectSummaryMapFallback";
import ProjectComponentEdit from "./ProjectComponentEdit";
import Alert from "@material-ui/lab/Alert";
import { ArrowForwardIos } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  listItemCheckbox: {
    color: "black !important",
  },
  listItemSecondaryAction: {
    fontSize: "1.125rem",
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
  componentButtonAddNew: {},
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
      projectId: Number.parseInt(projectId),
    },
  });

  /**
   * Retrieve and flatten a nested list of features that are associated with this project
   * moped_proj_components -> moped_proj_features_components -> moped_proj_feature
   */
  const projectFeatureRecords =
    data && data?.moped_proj_components
      ? data.moped_proj_components.reduce(
          (accumulator, component) => [
            ...accumulator,
            // Append if current component is selected, or none are selected (0)
            ...(selectedComp === component.project_component_id ||
            selectedComp === 0
              ? component.moped_proj_features_components.map(
                  featureComponent => ({
                    ...featureComponent.moped_proj_feature,
                    project_features_components_id:
                      featureComponent.project_features_components_id,
                  })
                )
              : []),
          ],
          []
        )
      : [];

  /**
   * Build an all-inclusive list of components associated with this project
   * Used in the edit component / editable map view
   * @type FeatureCollection {Object[]}
   */
  const featureFullCollection =
    data && data?.moped_proj_components
      ? createFeatureCollectionFromProjectFeatures(
          data.moped_proj_components.reduce(
            (accumulator, component) => [
              ...accumulator,
              ...component.moped_proj_features_components.map(
                featureComponent => ({
                  ...featureComponent.moped_proj_feature,
                  project_features_components_id:
                    featureComponent.project_features_components_id,
                })
              ),
            ],
            []
          )
        )
      : [];

  /**
   * Build an all-inclusive list of components associated with this project
   * Used in the static map view
   * @type FeatureCollection {Object}
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
   * Takes the user to the components details page / map edit mode
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
   * Takes the user back to the components list for a project / map view only mode
   */
  const handleCancelEdit = () => {
    refetch();
    setComponentEditMode(false);
    setSelectedComp(0);
  };

  /**
   * This is a helper variable that stores true if we have components associated with project, false otherwise.
   * @constant
   * @type {boolean}
   */
  const componentsAvailable = data && data.moped_proj_components.length > 0;

  // If loading, return loading icon
  if (loading) return <CircularProgress />;

  if (error) return <div>{JSON.stringify(error)}</div>;

  return (
    <ApolloErrorHandler errors={error}>
      {componentEditMode && (
        <ProjectComponentEdit
          componentId={selectedComp}
          handleCancelEdit={handleCancelEdit}
          projectRefetchFeatures={refetch}
          projectFeatureCollection={featureFullCollection}
        />
      )}
      {!componentEditMode && (
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
            noPadding
          >
            <Button
              className={classes.componentButtonAddNew}
              onClick={handleAddNewComponentClick}
              variant="outlined"
              color="default"
              size={"large"}
              startIcon={<Icon>add</Icon>}
              fullWidth
            >
              Add new component
            </Button>
            {componentsAvailable && (
              <ClickAwayListener onClickAway={handleComponentClickAway}>
                <List className={classes.root}>
                  {data.moped_proj_components.map((component, compIndex) => {
                    const projComponentId = component.project_component_id;
                    return (
                      <ListItem
                        key={"mcListItem-" + projComponentId}
                        role={undefined}
                        dense
                        button
                        onClick={() => handleComponentClick(projComponentId)}
                        className={
                          projComponentId === selectedComp
                            ? classes.componentItemBlue
                            : classes.componentItem
                        }
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            className={classes.listItemCheckbox}
                            checked={projComponentId === selectedComp}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ "aria-labelledby": null }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          id={"mcListItemText-" + projComponentId}
                          primary={component?.moped_components?.component_type}
                          secondary={
                            (component?.moped_components?.component_subtype ??
                              "") +
                            [
                              ...new Set(
                                component.moped_proj_components_subcomponents.map(
                                  mpcs =>
                                    mpcs.moped_subcomponent.subcomponent_name
                                )
                              ),
                            ]
                              .sort()
                              .join(", ")
                          }
                        />
                        <ListItemSecondaryAction
                          onClick={() => {
                            handleComponentClick(projComponentId);
                            handleComponentDetailsClick();
                          }}
                        >
                          <IconButton edge="end" aria-label="comments">
                            <ArrowForwardIos
                              className={classes.listItemSecondaryAction}
                            />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </ClickAwayListener>
            )}
            {!componentsAvailable && (
              <Alert severity="info">
                There aren't any components for this project.
              </Alert>
            )}
          </ProjectComponentsMapView>
        </ErrorBoundary>
      )}
    </ApolloErrorHandler>
  );
};

export default ProjectComponents;
