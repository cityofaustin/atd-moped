import React, { useState, useReducer, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Collapse from "@material-ui/core/Collapse";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ErrorIcon from "@material-ui/icons/Error";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Cancel from "@material-ui/icons/Cancel";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Button from "@material-ui/core/Button";
import FilterList from "@material-ui/icons/FilterList";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ListItemText from "@material-ui/core/ListItemText";
import TimelineIcon from "@material-ui/icons/Timeline";
import RoomIcon from "@material-ui/icons/Room";
import EditOutlined from "@material-ui/icons/EditOutlined";
import TheMap from "./TheMap";
import ComponentModal from "./ComponentModal";
import LinkComponentsDialog from "./LinkComponentsDialog";
import LinkModeDialog from "./LinkModeDialog";
import CheckCircle from "@material-ui/icons/CheckCircle";
const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerContainer: {
    overflow: "auto",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: "#fff",
    minHeight: "100vh",
  },
  margin: {
    margin: theme.spacing(1),
  },
  listItemMapHover: {
    backgroundColor: "rgba(252, 8, 133, .3)",
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const getFeatureLabel = (feature, thisFeatureComponentIds) => {
  const componentCount = thisFeatureComponentIds?.length || 0;
  const componentNoun = componentCount === 1 ? "component" : "components";
  const componentCountText = componentCount
    ? `${componentCount} ${componentNoun}`
    : "";
  if (feature.properties._layerId.includes("lines")) {
    const locationText = `${feature.properties.FROM_ADDRESS_MIN} BLK ${feature.properties.FULL_STREET_NAME}`;
    return {
      primary: locationText,
      secondary: componentCountText,
    };
  } else if (feature.properties._layerId.includes("points")) {
    const locationText = `${feature.properties._label}`;
    return {
      primary: locationText,
      secondary: componentCountText,
    };
  }
};

const getIcon = (feature) => {
  if (feature.properties._layerId.includes("lines")) {
    return <TimelineIcon />;
  } else if (feature.properties._layerId.includes("points")) {
    return <RoomIcon />;
  }
};

function componentsReducer(state, { component, action }) {
  return [...state, component];
}

/**
 * Return "line", "point", or null if all feature are/are not of the same type
 * ...in which case we do not need to show link mode dialog
 */
const useIsUniformGeometryType = (features) =>
  useMemo(() => {
    if (!features || features.length === 0) {
      return null;
    }
    // handling Point, Line, MultiPoint, and MultiLine
    const featureTypes = features.map((feature) => {
      if (feature.geometry.type.toLowerCase().includes("line")) {
        return "lines";
      } else if (feature.geometry.type.toLowerCase().includes("point")) {
        return "points";
      } else {
        throw `Unsupported geometry type ${feature.geomtery.type}`;
      }
    });
    // are all values the same?
    const isUniform = featureTypes.every((b) => b === featureTypes[0]);
    if (isUniform) {
      return featureTypes[0];
    } else {
      return null;
    }
  }, [features]);

export default function MapView() {
  const classes = useStyles();
  const [componentFeatures, setComponentFeatures] = useState({
    features: [],
  });
  const [isCreatingComponent, setIsCreatingComponent] = useState(false);
  const [hoveredOnMapFeatureId, setHoveredOnMapFeatureId] = useState(null);
  const [linkMode, setLinkMode] = useState(null);
  const [components, dispatchComponents] = useReducer(componentsReducer, []);
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [isEditingMap, setIsEditingMap] = useState(false);
  const [showLinkModeDialog, setShowLinkModeDialog] = useState(false);
  const [isLinkingComponents, setIsLinkingComponents] = useState(false);
  const [currTab, setCurrTab] = useState(0);
  const [showComponentCreateDialog, setShowComponentCreateDialog] =
    useState(false);
  const [showLinkComponentsDialog, setShowLinkComponentsDialog] =
    useState(false);

  const [expandedFeatureIds, setExpandedFeatureIds] = useState([]);
  const handleTabChange = (event, newValue) => {
    setCurrTab(newValue);
  };

  const [projectFeatures, setProjectFeatures] = useState({
    type: "FeatureCollection",
    features: [],
  });

  const uniformGeometryType = useIsUniformGeometryType(
    projectFeatures?.features
  );
  /**
   *  warning! this is fraught: mapbox-generated IDs are not guaranteed unique across multiple
   * layers and sessions (i think?)!
   * a critical todo of this feature is to revisit how we manage uniquness between
   *    1. existing project features/components
   *    2. new project/features/relationships being added
   * IIRC in the current editor we generate (temporary?) uuids to keep track
   */
  const selectedFeautreIds = selectedFeatures.map(
    (feature) => feature.properties.id
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerContainer}>
          <Tabs
            variant="fullWidth"
            centered
            textColor="primary"
            indicatorColor="primary"
            value={currTab}
            onChange={handleTabChange}
            aria-label="simple tabs example"
          >
            <Tab label="Features" />
            <Tab label="Components" />
          </Tabs>
          {currTab === 1 && (
            <List>
              {components.length > 0 && (
                <>
                  <ListItem dense>
                    <IconButton>
                      <FilterList />
                    </IconButton>
                    <ListItemText primary="Filter" />
                  </ListItem>
                  <Divider />
                </>
              )}
              {!isEditingMap && !components.length > 0 && (
                <>
                  <ListItem dense>
                    <ListItemIcon>
                      <ErrorIcon />
                    </ListItemIcon>
                    <ListItemText primary="This project has no components" />
                  </ListItem>
                  <ListItem dense>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      fullWidth
                      // className={classes.margin}
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() => setShowComponentCreateDialog(true)}
                    >
                      New Component
                    </Button>
                  </ListItem>
                </>
              )}
              {components.map((component, i) => (
                <React.Fragment key={i}>
                  <ListItem
                    dense
                    onClick={() => setSelectedComponentId(component._id)}
                    selected={component._id === selectedComponentId}
                    // style={{ backgroundColor: "#fc58ac" }}
                  >
                    <ListItemText
                      primary={component.component_name}
                      secondary={component.component_subtype}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
          {currTab === 0 && (
            <List>
              {projectFeatures?.features.length > 0 && (
                <>
                  <ListItem dense>
                    <IconButton>
                      <FilterList />
                    </IconButton>
                    <ListItemText primary="Filter" />
                  </ListItem>
                  <Divider />
                </>
              )}
              {!projectFeatures?.features.length > 0 && (
                <ListItem dense>
                  <ListItemIcon>
                    <ErrorIcon />
                  </ListItemIcon>
                  <ListItemText primary="This project has not been mapped" />
                </ListItem>
              )}
              {!isEditingMap && !projectFeatures?.features.length > 0 && (
                <ListItem dense>
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    fullWidth
                    // className={classes.margin}
                    startIcon={<EditOutlined />}
                    onClick={() => setIsEditingMap(!isEditingMap)}
                  >
                    Start mapping
                  </Button>
                </ListItem>
              )}

              {projectFeatures?.features
                .filter((feature) => {
                  if (!linkMode) {
                    return true;
                  } else if (linkMode === "points") {
                    return feature.properties._layerId.includes("point");
                  } else if (linkMode === "lines") {
                    return feature.properties._layerId.includes("line");
                  }
                  throw "Unable to filter unknown feature type - this should never happen :/";
                })
                .map((feature, i) => {
                  const featureId = feature.properties.id;
                  const isChecked = selectedFeautreIds.includes(
                    feature.properties.id
                  );
                  const isExpanded = expandedFeatureIds.includes(featureId);
                  const isHovered = featureId === hoveredOnMapFeatureId;
                  const linkedFeature = componentFeatures.features.find(
                    (linkedFeature) =>
                      linkedFeature.id === feature.properties.id
                  );
                  const thisFeatureComponentIds = linkedFeature?.components;

                  const checkboxCallback = () => {
                    if (isEditingMap) {
                      return;
                    }
                    if (isChecked) {
                      const newSelectedFeatures = selectedFeatures.filter(
                        (someFeature) =>
                          someFeature.properties.id !== feature.properties.id
                      );
                      setSelectedFeatures(newSelectedFeatures);
                    } else {
                      setSelectedFeatures([...selectedFeatures, feature]);
                    }
                  };
                  return (
                    <React.Fragment key={i}>
                      <ListItem
                        button
                        dense
                        className={isHovered ? classes.listItemMapHover : ""}
                        onClick={() => {
                          // override expand with checkbox if linking components
                          if (isLinkingComponents) {
                            checkboxCallback();
                            return;
                          }
                          if (isExpanded) {
                            // collapse
                            const newExpandedFeatureIds =
                              expandedFeatureIds.filter(
                                (exFeatureId) => exFeatureId !== featureId
                              );
                            setExpandedFeatureIds(newExpandedFeatureIds);
                          } else {
                            // expand
                            const newExpandedFeatureIds = [
                              ...expandedFeatureIds,
                              featureId,
                            ];
                            setExpandedFeatureIds(newExpandedFeatureIds);
                          }
                        }}
                      >
                        {isLinkingComponents && linkMode && (
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={isChecked}
                              disableRipple
                              color="primary"
                              onClick={checkboxCallback}
                            />
                          </ListItemIcon>
                        )}

                        <ListItemText
                          {...getFeatureLabel(feature, thisFeatureComponentIds)}
                        />
                        <ListItemSecondaryAction>
                          <IconButton color="primary">
                            {getIcon(feature)}
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Collapse in={isExpanded}>
                        {/* Nested list of components related to feature */}
                        <List component="div" disablePadding dense>
                          {thisFeatureComponentIds?.map((componentId) => {
                            const thisComponent = components.find(
                              (component) => component._id === componentId
                            );
                            return (
                              <ListItem
                                key={thisComponent._id}
                                className={classes.nested}
                              >
                                <ListItemText
                                  primary={`${thisComponent.component_name} #${thisComponent._id}`}
                                  secondary={thisComponent.component_subtype}
                                />
                                <ListItemSecondaryAction>
                                  <IconButton>
                                    <Cancel />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                            );
                          })}
                        </List>
                      </Collapse>
                      <Divider />
                    </React.Fragment>
                  );
                })}
            </List>
          )}
        </div>
      </Drawer>
      <main className={classes.content}>
        <div style={{ height: "100%" }}>
          <Toolbar
            style={{
              backgroundColor: "white",
              position: "fixed",
              zIndex: 1,
              width: "100%",
            }}
          >
            {!isLinkingComponents && (
              <Button
                size="small"
                color={isEditingMap ? "secondary" : "primary"}
                className={classes.margin}
                startIcon={isEditingMap ? <Cancel /> : <EditOutlined />}
                onClick={() => {
                  setIsEditingMap(!isEditingMap);
                  setCurrTab(0);
                }}
              >
                {isEditingMap ? "Cancel" : "Edit map"}
              </Button>
            )}
            {isEditingMap && (
              <Button
                size="small"
                variant="contained"
                color="primary"
                className={classes.margin}
                startIcon={<CheckCircle />}
                onClick={() => setIsEditingMap(!isEditingMap)}
              >
                Save edits
              </Button>
            )}
            {!isEditingMap && !isLinkingComponents && (
              <Button
                size="small"
                color="primary"
                className={classes.margin}
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => {
                  setIsCreatingComponent(true);
                  setIsLinkingComponents(!isLinkingComponents);
                  if (uniformGeometryType) {
                    // we can skip the linkmode step
                    setLinkMode(uniformGeometryType);
                  } else {
                    setShowLinkModeDialog(true);
                  }
                  setExpandedFeatureIds([]);
                  // setShowComponentCreateDialog(!showComponentCreateDialog)
                }}
                disabled={!projectFeatures?.features.length > 0}
              >
                New Component
              </Button>
            )}
            {!isEditingMap && !isLinkingComponents && (
              <Button
                size="small"
                color="primary"
                className={classes.margin}
                startIcon={<PlaylistAddIcon />}
                disabled={
                  !(
                    components?.length > 0 &&
                    projectFeatures.features.length > 0
                  )
                }
                onClick={() => {
                  setShowLinkModeDialog(true);
                  setIsLinkingComponents(!isLinkingComponents);
                }}
              >
                Link components
              </Button>
            )}
            {isLinkingComponents && linkMode && (
              <>
                <Button
                  size="small"
                  color="secondary"
                  className={classes.margin}
                  startIcon={<Cancel />}
                  onClick={() => {
                    setLinkMode(null);
                    setIsLinkingComponents(!isLinkingComponents);
                    setSelectedFeatures([]);
                  }}
                >
                  {isLinkingComponents ? "Cancel" : "Link components"}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.margin}
                  startIcon={<NavigateNextIcon />}
                  onClick={() => {
                    if (isCreatingComponent) {
                      setShowComponentCreateDialog(true);
                    } else {
                      setShowLinkComponentsDialog(true);
                    }
                  }}
                  disabled={selectedFeautreIds?.length === 0}
                >
                  Continue
                </Button>
              </>
            )}
          </Toolbar>
          <TheMap
            projectFeatures={projectFeatures}
            setProjectFeatures={setProjectFeatures}
            setHoveredOnMapFeatureId={setHoveredOnMapFeatureId}
            isEditingMap={isEditingMap}
          />
        </div>
        <ComponentModal
          showDialog={showComponentCreateDialog}
          setShowDialog={setShowComponentCreateDialog}
          dispatchComponents={dispatchComponents}
          setCurrTab={setCurrTab}
          selectedFeatures={selectedFeatures}
          setSelectedFeatures={setSelectedFeatures}
          componentFeatures={componentFeatures}
          setComponentFeatures={setComponentFeatures}
          setIsLinkingComponents={setIsLinkingComponents}
          setLinkMode={setLinkMode}
          setIsCreatingComponent={setIsCreatingComponent}
          linkMode={linkMode}
        />
        <LinkModeDialog
          showDialog={showLinkModeDialog}
          setShowDialog={setShowLinkModeDialog}
          setLinkMode={setLinkMode}
          setCurrTab={setCurrTab}
          setIsLinkingComponents={setIsLinkingComponents}
        />
        <LinkComponentsDialog
          showDialog={showLinkComponentsDialog}
          setShowDialog={setShowLinkComponentsDialog}
          components={components}
          setSelectedFeatures={setSelectedFeatures}
          selectedFeatures={selectedFeatures}
          componentFeatures={componentFeatures}
          setComponentFeatures={setComponentFeatures}
          setIsLinkingComponents={setIsLinkingComponents}
          setLinkMode={setLinkMode}
        />
      </main>
    </div>
  );
}
