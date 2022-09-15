import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import TimelineIcon from "@material-ui/icons/Timeline";
import RoomIcon from "@material-ui/icons/Room";
import TheMap from "./TheMap";
import { lines } from "./lines";
import { projectLines } from "./project.lines";
import { projectPoints } from "./project.points";
const drawerWidth = 400;

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

export default function MapView() {
  const classes = useStyles();
  const projectLayer = {
    type: "FeatureCollection",
    features: [...projectPoints.features, ...projectLines.features],
  };

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
          <List>
            {projectLayer.features.map((feature) => (
              <React.Fragment key={feature.properties.component_id}>
                <ListItem button>
                  <ListItemIcon>
                    {/* {index % 2 === 0 ? <TimelineIcon /> : <RoomIcon />} */}
                  </ListItemIcon>
                  <ListItemText
                    primary={feature.properties.component_name}
                    secondary={feature.properties.component_subtype}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <div
          style={{
            height: "800px",
            backgroundColor: "green",
          }}
        >
          <TheMap />
        </div>
      </main>
    </div>
  );
}
