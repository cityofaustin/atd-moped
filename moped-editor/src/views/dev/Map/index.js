import React, { useState, useReducer } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";

import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Collapse from "@material-ui/core/Collapse";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
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
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    backgroundColor: "#fff",
    minHeight: "100vh",
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

const getFeatureLabel = (feature, componentFeatures) => {
  const linkedFeature = componentFeatures.features.find(
    (linkedFeature) => linkedFeature.id === feature.properties.id
  );
  const componentCount = linkedFeature?.components.length || 0;
  const componentNoun = componentCount === 1 ? "component" : "components";
  const componentCountText = `${componentCount} ${componentNoun}`;
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

export default function MapView() {
  const classes = useStyles();
  const [componentFeatures, setComponentFeatures] = useState({
    features: [],
  });
  const [linkMode, setLinkMode] = useState(null);
  const [components, dispatchComponents] = useReducer(componentsReducer, []);
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [isEditingMap, setIsEditingMap] = useState(false);
  const [isLinkingComponents, setIsLinkingComponents] = useState(false);
  const [currTab, setCurrTab] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
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
        {/* <Toolbar /> */}
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
                      onClick={() => setShowDialog(true)}
                    >
                      New Component{" "}
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
                  console.log("expandedFeatureIds", expandedFeatureIds);
                  return (
                    <React.Fragment key={i}>
                      <ListItem
                        button
                        dense
                        onClick={() => {
                          if (isExpanded) {
                            const newExpandedFeatureIds =
                              expandedFeatureIds.filter(
                                (exFeatureId) => exFeatureId !== featureId
                              );
                            setExpandedFeatureIds(newExpandedFeatureIds);
                          } else {
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
                              onClick={() => {
                                if (isEditingMap) {
                                  return;
                                }
                                if (isChecked) {
                                  const newSelectedFeatures =
                                    selectedFeatures.filter(
                                      (someFeature) =>
                                        someFeature.properties.id !==
                                        feature.properties.id
                                    );
                                  setSelectedFeatures(newSelectedFeatures);
                                } else {
                                  setSelectedFeatures([
                                    ...selectedFeatures,
                                    feature,
                                  ]);
                                }
                              }}
                            />
                          </ListItemIcon>
                        )}

                        <ListItemText
                          {...getFeatureLabel(feature, componentFeatures)}
                        />
                        <ListItemSecondaryAction>
                          <IconButton color="primary">
                            {getIcon(feature)}
                          </IconButton>
                          {/* <IconButton color="primary">
                            <ExpandMoreIcon />
                          </IconButton> */}
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Collapse
                        in={expandedFeatureIds.includes(feature.properties.id)}
                      >
                        <ListItem>
                          <ListItemText>Heyyyyy</ListItemText>
                        </ListItem>
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
                onClick={() => setShowDialog(!showDialog)}
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
                  setLinkMode(null);
                  setIsLinkingComponents(!isLinkingComponents);
                }}
              >
                Link components
              </Button>
            )}

            {isLinkingComponents && !linkMode && (
              <>
                <Typography variant="h4" gutterBottom>
                  Which type of features?
                </Typography>
                <Button
                  color="primary"
                  size="small"
                  variant="outlined"
                  className={classes.margin}
                  startIcon={<RoomIcon />}
                  onClick={() => {
                    setLinkMode("points");
                    // switch to features tab
                    setCurrTab(0);
                  }}
                >
                  Intersections
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  className={classes.margin}
                  startIcon={<TimelineIcon />}
                  onClick={() => {
                    setLinkMode("lines");
                    // switch to features tab
                    setCurrTab(0);
                  }}
                >
                  Segments
                </Button>
                <Button
                  color="secondary"
                  size="small"
                  className={classes.margin}
                  startIcon={<Cancel />}
                  onClick={() => {
                    setLinkMode(null);
                    setIsLinkingComponents(!isLinkingComponents);
                  }}
                >
                  {isLinkingComponents ? "Cancel" : "Link components"}
                </Button>
              </>
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
                    // setIsLinkingComponents(!isLinkingComponents);
                  }}
                >
                  {isLinkingComponents ? "Cancel" : "Link components"}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.margin}
                  startIcon={<NavigateNextIcon />}
                  onClick={() => setShowLinkComponentsDialog(true)}
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
          />
        </div>
        <ComponentModal
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          dispatchComponents={dispatchComponents}
          setCurrTab={setCurrTab}
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
