import React, { useState, useReducer, useMemo, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ErrorIcon from "@material-ui/icons/Error";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Cancel from "@material-ui/icons/Cancel";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { EditOutlined } from "@material-ui/icons";
import ListItemText from "@material-ui/core/ListItemText";
import TimelineIcon from "@material-ui/icons/Timeline";
import RoomIcon from "@material-ui/icons/Room";
import TheMap from "./TheMap";
import ComponentModal from "./ComponentModal";
import CheckCircle from "@material-ui/icons/CheckCircle";
import {
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@material-ui/core";
import turfCenter from "@turf/center";
import bbox from "@turf/bbox";

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
  listItemSelected: {
    backgroundColor: "rgba(252, 8, 133, .3)",
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const getIcon = (component) => {
  if (component.line_representation) {
    return <TimelineIcon />;
  } else {
    return <RoomIcon />;
  }
};

const DrawModeSelector = () => {
  return (
    <FormControl component="fieldset">
      <RadioGroup row aria-label="position" name="position" defaultValue="top">
        <FormControlLabel
          value="select"
          control={<Radio color="primary" />}
          label="Select"
          checked={true}
        />
        <FormControlLabel
          value="draw"
          control={<Radio color="primary" />}
          label="Draw"
          checked={false}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default function MapView() {
  const classes = useStyles();
  const mapRef = useRef();

  /* holds this project's components */
  const [components, setComponents] = useState([]);

  const [draftComponent, setDraftComponent] = useState(null);

  /* tracks a projectFeature clicked from the map */
  const [clickedProjectFeature, setClickedProjectFeature] = useState(null);

  /* tracks a component clicked from the list */
  const [clickedComponent, setClickedComponent] = useState(null);

  /* tracks a projectFeature hovered on map */
  const [hoveredOnMapFeatureId, setHoveredOnMapFeatureId] = useState(null);

  /* tracks features that have been "checked" in the link - used during
    the component <> feature linking flow */
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  /* tracks which features in the list have been clicked/expanded */
  const [expandedComponentId, setExpandedComponentId] = useState(null);

  /* sets the type of geometry to use in component-linking mode. allowed values
  are `points`, `lines`, or `null` */
  const [linkMode, setLinkMode] = useState(null);

  /* various interaction states */
  const [isEditingComponent, setIsEditingComponent] = useState(false);

  const [showComponentCreateDialog, setShowComponentCreateDialog] =
    useState(false);

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
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar style={{ backgroundColor: "#fff" }}>
          <Box width={drawerWidth}>
            <Typography variant="h3" noWrap color="primary">
              Project map
            </Typography>
          </Box>

          {isEditingComponent && draftComponent && (
            <>
              <Box color="text.primary">
                <DrawModeSelector />
              </Box>
              <Box>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  className={classes.margin}
                  startIcon={<Cancel />}
                  onClick={() => {
                    setIsEditingComponent(!isEditingComponent);
                    setDraftComponent(null);
                    setLinkMode(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  disabled={!draftComponent?.features.length > 0}
                  className={classes.margin}
                  startIcon={<CheckCircle />}
                  onClick={() => {
                    const newComponents = [...components, draftComponent];
                    setComponents(newComponents);
                    setIsEditingComponent(false);
                    setDraftComponent(null);
                    setLinkMode(null);
                  }}
                >
                  Save
                </Button>
              </Box>
            </>
          )}
          {!isEditingComponent && components?.length > 0 && (
            <Button
              size="small"
              color="primary"
              className={classes.margin}
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => {
                setIsEditingComponent(true);
                setShowComponentCreateDialog(true);
                setClickedComponent(null);
              }}
            >
              New Component
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        {/* this toolbar pushes the list content below the main app toolbar */}
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {!isEditingComponent && !components.length > 0 && (
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
                    onClick={() => {
                      setIsEditingComponent(true);
                      setShowComponentCreateDialog(true);
                      setClickedComponent(null);
                    }}
                  >
                    New Component
                  </Button>
                </ListItem>
              </>
            )}
            {components.map((component, i) => {
              const isExpanded = clickedComponent?._id === component._id;

              return (
                <Box
                  key={i}
                  borderLeft={7}
                  style={{
                    borderColor: isExpanded ? "#1276D1" : "#fff",
                    // backgroundColor: isExpanded ? "#e8f3fd" : "#fff",
                  }}
                >
                  <ListItem
                    dense
                    button
                    onClick={() => {
                      if (isExpanded) {
                        setClickedComponent(null);
                      } else {
                        setClickedComponent(component);
                      }
                    }}
                  >
                    <ListItemText
                      primary={component.component_name}
                      secondary={component.component_subtype}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          const fc = {
                            type: "FeatureCollection",
                            features: component.features,
                          };
                          // const currZoom = mapRef.current?.getZoom();
                          // update various states
                          setClickedComponent(component);
                          setClickedProjectFeature(null);
                          // move the map
                          mapRef.current?.fitBounds(bbox(fc), {
                            maxZoom: 19,
                            // accounting for fixed top bar
                            padding: {
                              top: 75,
                              bottom: 75,
                              left: 75,
                              right: 75,
                            },
                          });
                        }}
                      >
                        <ZoomInIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Collapse in={isExpanded}>
                    <List component="div" disablePadding dense>
                      {/* <ListItem className={classes.nested}>
                        <ListItemText primary="Subcomponents" />
                        <ListItemText secondary="more info" />
                      </ListItem> */}
                      {component.description && (
                        <ListItem className={classes.nested}>
                          <ListItemText secondary={component.description} />
                        </ListItem>
                      )}
                      <ListItem dense>
                        <ListItemText
                          primary={
                            <Button
                              fullWidth
                              size="small"
                              color="primary"
                              startIcon={<EditOutlined />}
                            >
                              Edit
                            </Button>
                          }
                        />
                        <ListItemText
                          primary={
                            <Button
                              fullWidth
                              size="small"
                              color="secondary"
                              startIcon={<DeleteIcon />}
                            >
                              Delete
                            </Button>
                          }
                        />
                      </ListItem>
                    </List>
                  </Collapse>
                  <Divider />
                </Box>
              );
            })}
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <div style={{ height: "100%" }}>
          <TheMap
            mapRef={mapRef}
            components={components}
            draftComponent={draftComponent}
            setDraftComponent={setDraftComponent}
            setHoveredOnMapFeatureId={setHoveredOnMapFeatureId}
            isEditingComponent={isEditingComponent}
            clickedComponent={clickedComponent}
            setClickedComponent={setClickedComponent}
            clickedProjectFeature={clickedProjectFeature}
            setClickedProjectFeature={setClickedProjectFeature}
            linkMode={linkMode}
          />
        </div>
        <ComponentModal
          showDialog={showComponentCreateDialog}
          setShowDialog={setShowComponentCreateDialog}
          draftComponent={draftComponent}
          setDraftComponent={setDraftComponent}
          setLinkMode={setLinkMode}
          setIsEditingComponent={setIsEditingComponent}
        />
      </main>
    </div>
  );
}
