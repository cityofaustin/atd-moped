import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
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

import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import { createFeatureCollectionFromProjectFeatures } from "../../../utils/mapHelpers";
import {
  useAvailableTypes,
  useLineRepresentable,
  createProjectFeatureCollection,
} from "../../../utils/projectComponentHelpers";

import Alert from "@material-ui/lab/Alert";
import { ArrowForwardIos } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
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

  const [selectedProjectComponent, setSelectedProjectComponent] =
    useState(null);
  const [mapError, setMapError] = useState(false);
  const [componentEditMode, setComponentEditMode] = useState(false);

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
  const handleComponentClick = (clickedComponent) =>
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

  return <ApolloErrorHandler></ApolloErrorHandler>;
};

export default ProjectComponents;
