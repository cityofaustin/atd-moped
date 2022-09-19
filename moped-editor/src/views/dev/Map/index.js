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
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import ListItemText from "@material-ui/core/ListItemText";
import TimelineIcon from "@material-ui/icons/Timeline";
import RoomIcon from "@material-ui/icons/Room";
import EditOutlined from "@material-ui/icons/EditOutlined";
import TheMap from "./TheMap";
import ComponentModal from "./ComponentModal";

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
  const classes = useStyles();
  const [showDialog, setShowDialog] = useState(false);
  const [components, dispatchComponents] = useReducer(componentsReducer, []);
  const [currTab, setCurrTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setCurrTab(newValue);
  };

  const [projectFeatures, setProjectFeatures] = useState({
    type: "FeatureCollection",
    features: [],
  });

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
            <Tab label="Components" />
            <Tab label="Features" />
          </Tabs>
          {currTab === 0 && (
            <List>
              <ListItem button onClick={() => setShowDialog(!showDialog)}>
                <ListItemIcon>
                  <AddCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="New component" />
              </ListItem>
              {components.map((component, i) => (
                <React.Fragment key={i}>
                  <ListItem button>
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
          {currTab === 1 && (
            <List>
              <ListItem button onClick={() => setShowDialog(!showDialog)}>
                <ListItemIcon>
                  <EditOutlined />
                </ListItemIcon>
                <ListItemText primary="Edit map" />
              </ListItem>
              {projectFeatures?.features.map((feature, i) => (
                <React.Fragment key={i}>
                  <ListItem button>
                    <ListItemIcon>{getIcon(feature)}</ListItemIcon>
                    <ListItemText {...getFeatureLabel(feature)} />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
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
      </main>
    </div>
  );
}
