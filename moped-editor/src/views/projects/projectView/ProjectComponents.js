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
import {
  useAvailableTypes,
  useLineRepresentable,
  createProjectFeatureCollection,
} from "../../../utils/projectComponentHelpers";

import ProjectSummaryMapFallback from "./ProjectSummary/ProjectSummaryMapFallback";
import ProjectComponentsMapEdit from "./ProjectComponentsMapEdit";
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

  const [selectedProjectComponent, setSelectedProjectComponent] = useState(
    null
  );
  const [mapError, setMapError] = useState(false);
  const [componentEditMode, setComponentEditMode] = useState(false);

  const { error, loading, data, refetch } = useQuery(COMPONENTS_QUERY, {
    variables: {
      projectId: Number.parseInt(projectId),
    },
  });

  const projectFeatureCollection = data?.moped_proj_components
    ? createProjectFeatureCollection(data.moped_proj_components)
    : null;

  /**
   * Build a FeatureCollection for only the selected project component
   * Used in the static map view when zooming to a clicked component
   * @type FeatureCollection {Object}
   */
  const selectedComponentFeatureCollection = selectedProjectComponent
    ? createFeatureCollectionFromProjectFeatures(
        selectedProjectComponent?.moped_proj_features
      )
    : null;

  const availableTypes = useAvailableTypes(data?.moped_components);
  const lineRepresentable = useLineRepresentable(data?.moped_components);

  /**
   * Handles logic whenever a component is clicked, refreshes whatever is in memory and re-renders
   * @param clickedComponent - The component in question
   */
  const handleComponentClick = clickedComponent =>
    setSelectedProjectComponent(clickedComponent);

  /**
   * Resets the selected component
   */
  const handleComponentClickAway = () => setSelectedProjectComponent(null);

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
    setSelectedProjectComponent(null);
    handleComponentDetailsClick();
  };

  /**
   * Takes the user back to the components list for a project / map view only mode
   */
  const handleCancelEdit = () => {
    refetch();
    setComponentEditMode(false);
    setSelectedProjectComponent(null);
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
        <ProjectComponentsMapEdit
          selectedProjectComponent={selectedProjectComponent}
          selectedComponentFeatureCollection={
            selectedComponentFeatureCollection
          }
          handleCancelEdit={handleCancelEdit}
          projectFeatureCollection={projectFeatureCollection}
          mopedComponents={data?.moped_components || []}
          mopedSubcomponents={data?.moped_subcomponents || []}
          lineRepresentable={lineRepresentable}
          availableTypes={availableTypes}
        />
      )}
      {!componentEditMode && (
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
          <ProjectComponentsMapView
            projectFeatureCollection={
              selectedProjectComponent
                ? selectedComponentFeatureCollection
                : projectFeatureCollection
            }
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
                  {data.moped_proj_components.map(
                    (projectComponent, compIndex) => {
                      const projComponentId =
                        projectComponent.project_component_id;
                      return (
                        <ListItem
                          key={"mcListItem-" + projComponentId}
                          role={undefined}
                          dense
                          button
                          onClick={() => handleComponentClick(projectComponent)}
                          className={
                            projComponentId ===
                            selectedProjectComponent?.project_component_id
                              ? classes.componentItemBlue
                              : classes.componentItem
                          }
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              className={classes.listItemCheckbox}
                              checked={
                                projComponentId ===
                                selectedProjectComponent?.project_component_id
                              }
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ "aria-labelledby": null }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            id={"mcListItemText-" + projComponentId}
                            primary={
                              projectComponent?.moped_components?.component_name
                            }
                            secondary={
                              (projectComponent?.moped_components
                                ?.component_subtype ?? "") +
                              [
                                ...new Set(
                                  projectComponent.moped_proj_components_subcomponents.map(
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
                              handleComponentClick(projectComponent);
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
                    }
                  )}
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
