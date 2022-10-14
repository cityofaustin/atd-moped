import { useState, useReducer, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Dialog } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import bbox from "@turf/bbox";
import TheMap from "./TheMap";
import ComponentEditModal from "./ComponentEditModal";
import DeleteComponentModal from "./DeleteComponentModal";
import EditModeDialog from "./EditModeDialog";
import ComponentMapToolbar from "./ComponentMapToolbar";
import ComponentListItem from "./ComponentListItem";
import DraftComponentListItem from "./DraftComponentListItem";
import { useAppBarHeight } from "./utils";

const drawerWidth = 350;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
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
    minHeight: ({ appBarHeight }) => `calc(100vh - ${appBarHeight}px)`,
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

/* per MUI suggestion - this empty toolbar pushes the list content below the main app toolbar  */
const PlaceholderToolbar = () => <Toolbar />;

export default function MapView({ projectName, projectStatuses }) {
  const appBarHeight = useAppBarHeight();
  const classes = useStyles({ appBarHeight });
  const mapRef = useRef();

  /* holds this project's components */
  const [components, setComponents] = useState([]);

  /* tracks a component clicked from the list or the projectFeature popup */
  const [clickedComponent, setClickedComponent] = useState(null);

  /* tracks a projectFeature clicked from the map */
  const [clickedProjectFeature, setClickedProjectFeature] = useState(null);

  /* holds the state of a component that's being created */
  const [draftComponent, setDraftComponent] = useState(null);

  /* tracks a projectFeature hovered on map */
  const [hoveredOnMapFeature, setHoveredOnMapFeature] = useState(null);

  /* sets the type of geometry to use in component edit mode. allowed values
  are `points`, `lines`, or `null` */
  const [linkMode, setLinkMode] = useState(null);

  /* if a component is being edited */
  const [isEditingComponent, setIsEditingComponent] = useState(false);

  /* if a component is being deleted */
  const [isDeletingComponent, setIsDeletingComponent] = useState(false);

  /* tracks the loading state of AGOL feature service fetching */
  const [isFetchingFeatures, setIsFetchingFeatures] = useState(false);

  const [showComponentEditDialog, setShowComponentEditDialog] = useState(false);

  const [showEditModeDialog, setShowEditModeDialog] = useState(false);

  /* fits clickedComponent to map bounds - called from component list item secondary action */
  const onClickZoomToComponent = (component) => {
    const featureCollection = {
      type: "FeatureCollection",
      features: component.features,
    };
    setClickedComponent(component);
    // close the map projectFeature map popup
    setClickedProjectFeature(null);
    // move the map
    mapRef.current?.fitBounds(bbox(featureCollection), {
      maxZoom: 19,
      // accounting for fixed top bar
      padding: {
        top: 75,
        bottom: 75,
        left: 75,
        right: 75,
      },
    });
  };

  const onSaveComponent = () => {
    const newComponents = [...components, draftComponent];
    setComponents(newComponents);
    setIsEditingComponent(false);
    setDraftComponent(null);
    setLinkMode(null);
    // TODO: Reset form? Or just reset it after setting draft to state
  };

  const onCancelComponentCreate = () => {
    setIsEditingComponent(!isEditingComponent);
    setDraftComponent(null);
    setLinkMode(null);
    // TODO: Reset form? Or just reset it after setting draft to state
  };

  const onStartCreatingComponent = () => {
    setIsEditingComponent(true);
    setShowComponentEditDialog(true);
    setClickedComponent(null);
  };

  const onStartEditingComponent = () => {
    setShowEditModeDialog(true);
  };

  const onCancelComponentEdit = () => {
    setShowEditModeDialog(false);
    setIsEditingComponent(false);
  };

  const onDeleteComponent = () => {
    const newComponentList = components.filter(
      (comp) => comp._id !== clickedComponent._id
    );
    setComponents(newComponentList);
    setClickedComponent(null);
    setIsDeletingComponent(false);
  };

  return (
    <Dialog fullScreen open={true}>
      <div className={classes.root}>
        <CssBaseline />
        <ComponentMapToolbar
          isFetchingFeatures={isFetchingFeatures}
          projectName={projectName}
          projectStatuses={projectStatuses}
        />
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <PlaceholderToolbar />
          <div className={classes.drawerContainer}>
            <List>
              {!isEditingComponent && (
                <>
                  <ListItem dense>
                    <Button
                      size="small"
                      color="primary"
                      fullWidth
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={onStartCreatingComponent}
                    >
                      New Component
                    </Button>
                  </ListItem>
                  <Divider />
                </>
              )}
              {draftComponent && (
                <DraftComponentListItem
                  component={draftComponent}
                  onSave={onSaveComponent}
                  onCancel={onCancelComponentCreate}
                />
              )}
              {components.map((component) => {
                const isExpanded = clickedComponent?._id === component._id;
                return (
                  <ComponentListItem
                    key={component._id}
                    component={component}
                    isExpanded={isExpanded}
                    setClickedComponent={setClickedComponent}
                    setIsDeletingComponent={setIsDeletingComponent}
                    onStartEditingComponent={onStartEditingComponent}
                    onClickZoomToComponent={onClickZoomToComponent}
                  />
                );
              })}
            </List>
          </div>
        </Drawer>
        <main className={classes.content}>
          <PlaceholderToolbar />
          <div style={{ height: "100%" }}>
            <TheMap
              mapRef={mapRef}
              components={components}
              draftComponent={draftComponent}
              setDraftComponent={setDraftComponent}
              setHoveredOnMapFeature={setHoveredOnMapFeature}
              hoveredOnMapFeature={hoveredOnMapFeature}
              isEditingComponent={isEditingComponent}
              clickedComponent={clickedComponent}
              setClickedComponent={setClickedComponent}
              clickedProjectFeature={clickedProjectFeature}
              setClickedProjectFeature={setClickedProjectFeature}
              setIsFetchingFeatures={setIsFetchingFeatures}
              linkMode={linkMode}
            />
          </div>
          <ComponentEditModal
            showDialog={showComponentEditDialog}
            setShowDialog={setShowComponentEditDialog}
            draftComponent={draftComponent}
            setDraftComponent={setDraftComponent}
            setLinkMode={setLinkMode}
            setIsEditingComponent={setIsEditingComponent}
          />
          <DeleteComponentModal
            showDialog={isDeletingComponent}
            setShowDialog={setIsDeletingComponent}
            clickedComponent={clickedComponent}
            setClickedComponent={setClickedComponent}
            setIsDeletingComponent={setIsDeletingComponent}
            onDeleteComponent={onDeleteComponent}
          />
          <EditModeDialog
            setIsEditingComponent={setIsEditingComponent}
            setShowComponentEditDialog={setShowComponentEditDialog}
            showDialog={showEditModeDialog}
            onClose={onCancelComponentEdit}
          />
        </main>
      </div>
    </Dialog>
  );
}
