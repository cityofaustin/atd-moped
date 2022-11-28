import { useState, useRef, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router";
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
import ComponentCreateModal from "./ComponentCreateModal";
import DeleteComponentModal from "./DeleteComponentModal";
import EditModeDialog from "./EditModeDialog";
import ComponentMapToolbar from "./ComponentMapToolbar";
import ComponentListItem from "./ComponentListItem";
import DraftComponentListItem from "./DraftComponentListItem";
import { useAppBarHeight, useZoomToExistingComponents } from "./utils/map";
import {
  ADD_PROJECT_COMPONENT,
  GET_PROJECT_COMPONENTS,
  DELETE_PROJECT_COMPONENT,
} from "src/queries/components";
import { makeComponentFeatureCollectionsMap } from "./utils/makeData";
import { fitBoundsOptions } from "./mapSettings";
import { onSaveComponent, onUpdateComponent } from "./utils/crud";
import ComponentEditModal from "./ComponentEditModal";

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
  const { projectId } = useParams();

  /* tracks a component clicked from the list or the projectFeature popup */
  const [clickedComponent, setClickedComponent] = useState(null);

  /* tracks a projectFeature clicked from the map */
  const [clickedProjectFeature, setClickedProjectFeature] = useState(null);

  /* holds the state of a component that's being created */
  const [draftComponent, setDraftComponent] = useState(null);

  /* holds the features added when editing an existing component */
  const [createdOnEditFeatures, setCreatedOnEditFeatures] = useState([]);

  /* tracks a projectFeature hovered on map */
  const [hoveredOnMapFeature, setHoveredOnMapFeature] = useState(null);

  /* sets the type of geometry to use in component edit mode. allowed values
  are `points`, `lines`, or `null` */
  const [linkMode, setLinkMode] = useState(null);

  /* if a new component is being created */
  const [isCreatingComponent, setIsCreatingComponent] = useState(false);
  const [showComponentCreateDialog, setShowComponentCreateDialog] =
    useState(false);

  /* if a component is being edited */
  const [isEditingComponent, setIsEditingComponent] = useState(false);
  const [showComponentEditDialog, setShowComponentEditDialog] = useState(false);

  const [showEditModeDialog, setShowEditModeDialog] = useState(false);

  /* if a component is being deleted */
  const [isDeletingComponent, setIsDeletingComponent] = useState(false);

  /* tracks the loading state of AGOL feature service fetching */
  const [isFetchingFeatures, setIsFetchingFeatures] = useState(false);

  console.table({
    clickedComponent,
    clickedProjectFeature,
    draftComponent,
    createdOnEditFeatures,
    hoveredOnMapFeature,
    linkMode,
    isCreatingComponent,
    showComponentCreateDialog,
    isEditingComponent,
    showComponentEditDialog,
    showEditModeDialog,
    isDeletingComponent,
    isFetchingFeatures,
  });

  const [addProjectComponent] = useMutation(ADD_PROJECT_COMPONENT);
  const [deleteProjectComponent] = useMutation(DELETE_PROJECT_COMPONENT);
  const {
    data,
    refetch: refetchProjectComponents,
    error,
  } = useQuery(GET_PROJECT_COMPONENTS, {
    variables: { projectId },
    fetchPolicy: "no-cache",
  });

  if (error) console.log(error);

  /* holds this project's components */
  const components = useMemo(() => {
    if (!data?.moped_proj_components) return [];

    return data.moped_proj_components;
  }, [data]);

  const featureCollectionsByComponentId = useMemo(() => {
    if (!data?.project_geography) return {};

    return makeComponentFeatureCollectionsMap(data.project_geography);
  }, [data]);

  useZoomToExistingComponents(mapRef, data);

  /* fits clickedComponent to map bounds - called from component list item secondary action */
  const onClickZoomToComponent = (component) => {
    const componentId = component.project_component_id;
    const featureCollection = featureCollectionsByComponentId[componentId];

    setClickedComponent(component);
    // close the map projectFeature map popup
    setClickedProjectFeature(null);
    // move the map
    mapRef.current?.fitBounds(
      bbox(featureCollection),
      fitBoundsOptions.zoomToClickedComponent
    );
  };

  const onSaveDraftComponent = () => {
    onSaveComponent({
      addProjectComponent,
      draftComponent,
      projectId,
      refetchProjectComponents,
      setDraftComponent,
      setIsCreatingComponent,
      setShowComponentCreateDialog,
      setLinkMode,
    });
  };

  const onCancelComponentCreate = () => {
    setIsCreatingComponent(!isCreatingComponent);
    setDraftComponent(null);
    setLinkMode(null);
  };

  const onSaveEditedComponent = () => {
    onUpdateComponent({ createdOnEditFeatures });
  };

  const onCancelComponentMapEdit = () => {
    setIsEditingComponent(false);
    setCreatedOnEditFeatures([]);
    setLinkMode(null);
  };

  const onStartCreatingComponent = () => {
    setIsCreatingComponent(true);
    setShowComponentCreateDialog(true);
    setClickedComponent(null);
  };

  const onStartEditingComponent = () => {
    setShowEditModeDialog(true);
  };

  const onCancelComponentAttributesEdit = () => {
    setShowEditModeDialog(false);
    setIsCreatingComponent(false);
  };

  const onDeleteComponent = () => {
    deleteProjectComponent({
      variables: { projectComponentId: clickedComponent.project_component_id },
    }).then(() => {
      refetchProjectComponents();
    });

    setClickedComponent(null);
    setIsDeletingComponent(false);
  };

  const onEditAttributes = () => {
    setShowComponentEditDialog(true);
    setShowEditModeDialog(false);
  };

  const onEditFeatures = () => {
    // TODO: Add helper to convert line representation to "lines" or "points"
    // TODO: Set clicked component as the draft component
    const {
      moped_components: { line_representation },
    } = clickedComponent;
    const linkMode = line_representation === true ? "lines" : "points";

    setLinkMode(linkMode);
    setIsEditingComponent(true);
    setShowEditModeDialog(false);
  };

  // TODO: Ways to simplify this
  // The map only needs to know what to show in blue
  // It doesn't need to know whether that is the clicked component or editing component
  // How can we create a slot for that data and simplify all of the prep work?
  // Break down Sources and Layers into create/edit/clicked/etc?
  // useReducer to group together some of the state in this file?

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
              {!isCreatingComponent && (
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
              {draftComponent && isCreatingComponent && (
                <DraftComponentListItem
                  primaryText={draftComponent.component_name}
                  secondaryText={draftComponent.component_subtype}
                  onSave={onSaveDraftComponent}
                  onCancel={onCancelComponentCreate}
                  saveButtonDisabled={!draftComponent?.features.length > 0}
                  saveButtonText="Save"
                />
              )}
              {isEditingComponent && (
                <DraftComponentListItem
                  primaryText={clickedComponent.moped_components.component_name}
                  secondaryText={
                    clickedComponent.moped_components.component_subtype
                  }
                  onSave={onSaveEditedComponent}
                  onCancel={onCancelComponentMapEdit}
                  saveButtonDisabled={false}
                  saveButtonText="Save Edit"
                />
              )}
              {components.map((component) => {
                const isExpanded =
                  clickedComponent?.project_component_id ===
                  component.project_component_id;
                const isEditingThisComponent = isExpanded && isEditingComponent;
                return (
                  !isEditingThisComponent && (
                    <ComponentListItem
                      key={component.project_component_id}
                      component={component}
                      isExpanded={isExpanded}
                      setClickedComponent={setClickedComponent}
                      setIsDeletingComponent={setIsDeletingComponent}
                      onStartEditingComponent={onStartEditingComponent}
                      onClickZoomToComponent={onClickZoomToComponent}
                    />
                  )
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
              isCreatingComponent={isCreatingComponent}
              isEditingComponent={isEditingComponent}
              clickedComponent={clickedComponent}
              setClickedComponent={setClickedComponent}
              clickedProjectFeature={clickedProjectFeature}
              setClickedProjectFeature={setClickedProjectFeature}
              setIsFetchingFeatures={setIsFetchingFeatures}
              linkMode={linkMode}
              featureCollectionsByComponentId={featureCollectionsByComponentId}
              setCreatedOnEditFeatures={setCreatedOnEditFeatures}
            />
          </div>
          <ComponentCreateModal
            showDialog={showComponentCreateDialog}
            setShowDialog={setShowComponentCreateDialog}
            setDraftComponent={setDraftComponent}
            setLinkMode={setLinkMode}
            setIsCreatingComponent={setIsCreatingComponent}
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
            showDialog={showEditModeDialog}
            onClose={onCancelComponentAttributesEdit}
            onEditAttributes={onEditAttributes}
            onEditFeatures={onEditFeatures}
          />
          <ComponentEditModal
            showDialog={showComponentEditDialog}
            setShowDialog={setShowComponentEditDialog}
            setIsEditingComponent={setIsEditingComponent}
            componentToEdit={clickedComponent}
            refetchProjectComponents={refetchProjectComponents}
            setClickedComponent={setClickedComponent}
          />
        </main>
      </div>
    </Dialog>
  );
}
