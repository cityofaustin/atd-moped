import React, { useState, useReducer } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ListItemText from "@material-ui/core/ListItemText";
import TimelineIcon from "@material-ui/icons/Timeline";
import RoomIcon from "@material-ui/icons/Room";
import EditOutlined from "@material-ui/icons/EditOutlined";
import TheMap from "./TheMap";
import ComponentModal from "./ComponentModal";
import AssociateComponentsDialogue from "./AssociateComponentsDialogue";
const drawerWidth = 325;

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
  },
}));

const getFeatureLabel = (feature) => {
  if (feature.properties._layerId.includes("lines")) {
    return {
      primary: "Road segment",
      secondary: `${feature.properties.FROM_ADDRESS_MIN} BLK ${feature.properties.FULL_STREET_NAME}`,
    };
  } else if (feature.properties._layerId.includes("points")) {
    return {
      primary: "Intersection",
      secondary: `${feature.properties._label}`,
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
  const [isEditingMap, setIsEditingMap] = useState(false);
  const [showComponentApplyDialogue, setShowComponentApplyDialogue] =
    useState(false);
  const classes = useStyles();
  const [showDialog, setShowDialog] = useState(false);
  const [components, dispatchComponents] = useReducer(componentsReducer, []);
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [currTab, setCurrTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setCurrTab(newValue);
  };

  const [projectFeatures, setProjectFeatures] = useState({
    type: "FeatureCollection",
    features: [],
  });

  // warning! this is fraught—IDs are not guaranteed unique across multiple layers
  const selectedFeautreIds = selectedFeatures.map(
    (feature) => feature.properties.id
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Map
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
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
              <ListItem button onClick={() => setShowDialog(!showDialog)}>
                <ListItemIcon>
                  <AddCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="New component" />
              </ListItem>
              {components.map((component, i) => (
                <React.Fragment key={i}>
                  <ListItem
                    button
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
              {selectedFeautreIds.length === 0 && (
                <ListItem button onClick={() => setIsEditingMap(!isEditingMap)}>
                  <ListItemIcon>
                    <EditOutlined />
                  </ListItemIcon>
                  <ListItemText
                    primary={isEditingMap ? "Save changes" : "Edit map"}
                  />
                </ListItem>
              )}

              {selectedFeautreIds.length > 0 && (
                <ListItem
                  button
                  onClick={() => setShowComponentApplyDialogue(true)}
                >
                  <ListItemIcon>
                    <PlaylistAddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add components..." />
                </ListItem>
              )}
              {projectFeatures?.features.map((feature, i) => {
                const isChecked = selectedFeautreIds.includes(
                  feature.properties.id
                );
                return (
                  <React.Fragment key={i}>
                    <ListItem
                      button
                      onClick={() => {
                        if (isEditingMap) {
                          return;
                        }
                        if (isChecked) {
                          const newSelectedFeatures = selectedFeatures.filter(
                            (someFeature) =>
                              someFeature.properties.id !==
                              feature.properties.id
                          );
                          setSelectedFeatures(newSelectedFeatures);
                        } else {
                          setSelectedFeatures([...selectedFeatures, feature]);
                        }
                      }}
                    >
                      {!isEditingMap && (
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={isChecked}
                            disableRipple
                          />
                        </ListItemIcon>
                      )}
                      <ListItemText {...getFeatureLabel(feature)} />
                      <ListItemIcon>{getIcon(feature)}</ListItemIcon>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </div>
      </Drawer>
      <main className={classes.content}>
        <div
          style={{
            height: "800px",
            backgroundColor: "green",
          }}
        >
          <TheMap
            projectFeatures={projectFeatures}
            setProjectFeatures={setProjectFeatures}
          />
        </div>
        <ComponentModal
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          dispatchComponents={dispatchComponents}
        />
        <AssociateComponentsDialogue
          showDialog={showComponentApplyDialogue}
          setShowDialog={setShowComponentApplyDialogue}
          components={components}
          setSelectedFeatures={setSelectedFeatures}
        />
      </main>
    </div>
  );
}
