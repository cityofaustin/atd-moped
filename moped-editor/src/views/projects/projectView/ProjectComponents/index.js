import { useState, useRef, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import { Dialog, Typography } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import TuneIcon from "@material-ui/icons/Tune";
import bbox from "@turf/bbox";
import TheMap from "./TheMap";
import CreateComponentModal from "./CreateComponentModal";
import EditAttributesModal from "./EditAttributesModal";
import DeleteComponentModal from "./DeleteComponentModal";
import EditModeDialog from "./EditModeDialog";
import ComponentMapToolbar from "./ComponentMapToolbar";
import ComponentListItem from "./ComponentListItem";
import DraftComponentListItem from "./DraftComponentListItem";
import { useAppBarHeight, useZoomToExistingComponents } from "./utils/map";
import { GET_PROJECT_COMPONENTS } from "src/queries/components";
import { useComponentFeatureCollectionsMap } from "./utils/makeFeatureCollections";
import { fitBoundsOptions } from "./mapSettings";
import { useCreateComponent } from "./utils/useCreateComponent";
import { useUpdateComponent } from "./utils/useUpdateComponent";
import { useDeleteComponent } from "./utils/useDeleteComponent";
import { useToolbarErrorMessage } from "./utils/useToolbarErrorMessage";

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
  buttonTextLeft: {
    justifyContent: "flex-start",
  },
}));

/* per MUI suggestion - this empty toolbar pushes the list content below the main app toolbar  */
const PlaceholderToolbar = () => <Toolbar />;

export default function MapView({
  projectName,
  phaseKey,
  phaseName,
  parentProjectId,
}) {
  const appBarHeight = useAppBarHeight();
  const classes = useStyles({ appBarHeight });
  const mapRef = useRef();
  const { projectId } = useParams();

  /* sets the type of geometry to use in component edit mode. allowed values
  are `points`, `lines`, or `null` */
  const [linkMode, setLinkMode] = useState(null);

  /* tracks a component clicked from the list or the projectFeature popup */
  const [clickedComponent, setClickedComponent] = useState(null);

  /* tracks a projectFeature clicked from the map */
  const [clickedProjectFeature, setClickedProjectFeature] = useState(null);

  /* tracks a projectFeature hovered on map */
  const [hoveredOnMapFeature, setHoveredOnMapFeature] = useState(null);

  /* tracks the loading state of AGOL feature service fetching */
  const [isFetchingFeatures, setIsFetchingFeatures] = useState(false);

  /* tracks the drawing state of the map */
  const [isDrawing, setIsDrawing] = useState(false);

  const {
    data,
    refetch: refetchProjectComponents,
    error,
  } = useQuery(GET_PROJECT_COMPONENTS, {
    variables: {
      projectId,
      ...(parentProjectId && { parentProjectId }),
    },
    fetchPolicy: "no-cache",
  });

  /* holds this project's components */
  const components = useMemo(() => {
    if (!data?.moped_proj_components) return [];

    return data.moped_proj_components;
  }, [data]);

  const featureCollectionsByComponentId =
    useComponentFeatureCollectionsMap(data);

  const parentComponents = useMemo(() => {
    if (!data?.parentProjectComponents) return [];

    return data.parentProjectComponents;
  }, [data]);

  const siblingComponents = useMemo(() => {
    if (!data?.siblingProjectComponents) return [];

    const allSiblingComponents = data.siblingProjectComponents.reduce(
      (acc, sibling) => [...acc, ...sibling.moped_proj_components],
      []
    );

    return allSiblingComponents;
  }, [data]);
  console.log(siblingComponents);

  const {
    onStartCreatingComponent,
    onSaveDraftComponent,
    onSaveDraftSignalComponent,
    onCancelComponentCreate,
    createState,
    createDispatch,
  } = useCreateComponent({
    projectId,
    setClickedComponent,
    setLinkMode,
    refetchProjectComponents,
    setIsDrawing,
  });

  const {
    editState,
    editDispatch,
    onSaveEditedComponent,
    onCancelComponentMapEdit,
    onEditFeatures,
    doesDraftEditComponentHaveFeatures,
  } = useUpdateComponent({
    components,
    clickedComponent,
    setClickedComponent,
    setLinkMode,
    refetchProjectComponents,
    setIsDrawing,
  });

  const { isDeletingComponent, setIsDeletingComponent, onDeleteComponent } =
    useDeleteComponent({
      clickedComponent,
      setClickedComponent,
      refetchProjectComponents,
    });

  const { errorMessageDispatch, errorMessageState } = useToolbarErrorMessage();

  if (error) console.log(error);

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

  const [areSettingsOpen, setAreSettingsOpen] = useState(false);
  const [shouldShowRelatedProjects, setShouldShowRelatedProjects] =
    useState(true);

  return (
    <Dialog fullScreen open={true}>
      <div className={classes.root}>
        <CssBaseline />
        <ComponentMapToolbar
          isFetchingFeatures={isFetchingFeatures}
          projectName={projectName}
          phaseKey={phaseKey}
          phaseName={phaseName}
          errorMessageState={errorMessageState}
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
              {!createState.isCreatingComponent &&
                !editState.isEditingComponent && (
                  <>
                    <ListItem dense>
                      <Button
                        className={classes.buttonTextLeft}
                        size="small"
                        color="primary"
                        fullWidth
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={onStartCreatingComponent}
                      >
                        New Component
                      </Button>
                      <IconButton
                        onClick={() => setAreSettingsOpen(!areSettingsOpen)}
                        aria-label="settings"
                      >
                        <TuneIcon fontSize="small" />
                      </IconButton>
                    </ListItem>
                    <Collapse in={areSettingsOpen}>
                      <ListItem>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={shouldShowRelatedProjects}
                              onChange={() =>
                                setShouldShowRelatedProjects(
                                  !shouldShowRelatedProjects
                                )
                              }
                              name="showRelatedProjects"
                              color="primary"
                            />
                          }
                          label={
                            <Typography variant="subtitle2">
                              Show related projects
                            </Typography>
                          }
                          labelPlacement="start"
                        />
                      </ListItem>
                    </Collapse>
                    <Divider />
                  </>
                )}
              {createState.draftComponent &&
                createState.isCreatingComponent && (
                  <DraftComponentListItem
                    primaryText={createState.draftComponent.component_name}
                    secondaryText={createState.draftComponent.component_subtype}
                    onSave={onSaveDraftComponent}
                    onCancel={onCancelComponentCreate}
                    saveButtonDisabled={
                      !createState.draftComponent?.features.length > 0
                    }
                    saveButtonText="Save"
                  />
                )}
              {editState.draftEditComponent && editState.isEditingComponent && (
                <DraftComponentListItem
                  primaryText={
                    editState.draftEditComponent?.moped_components
                      ?.component_name
                  }
                  secondaryText={
                    editState.draftEditComponent?.moped_components
                      ?.component_subtype
                  }
                  onSave={onSaveEditedComponent}
                  onCancel={onCancelComponentMapEdit}
                  saveButtonDisabled={!doesDraftEditComponentHaveFeatures}
                  saveButtonText="Save Edit"
                />
              )}
              {!editState.isEditingComponent &&
                !createState.isCreatingComponent &&
                components.map((component) => {
                  const isExpanded =
                    clickedComponent?.project_component_id ===
                    component.project_component_id;
                  return (
                    <ComponentListItem
                      key={component.project_component_id}
                      component={component}
                      isExpanded={isExpanded}
                      setClickedComponent={setClickedComponent}
                      setIsDeletingComponent={setIsDeletingComponent}
                      editDispatch={editDispatch}
                      onClickZoomToComponent={onClickZoomToComponent}
                      isEditingComponent={editState.isEditingComponent}
                      isCreatingComponent={createState.isCreatingComponent}
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
              parentComponents={parentComponents}
              siblingComponents={siblingComponents}
              draftComponent={createState.draftComponent}
              createDispatch={createDispatch}
              draftEditComponent={editState.draftEditComponent}
              editDispatch={editDispatch}
              setHoveredOnMapFeature={setHoveredOnMapFeature}
              hoveredOnMapFeature={hoveredOnMapFeature}
              isCreatingComponent={createState.isCreatingComponent}
              isEditingComponent={editState.isEditingComponent}
              clickedComponent={clickedComponent}
              setClickedComponent={setClickedComponent}
              clickedProjectFeature={clickedProjectFeature}
              setClickedProjectFeature={setClickedProjectFeature}
              setIsFetchingFeatures={setIsFetchingFeatures}
              linkMode={linkMode}
              featureCollectionsByComponentId={featureCollectionsByComponentId}
              isDrawing={isDrawing}
              setIsDrawing={setIsDrawing}
              errorMessageDispatch={errorMessageDispatch}
              shouldShowRelatedProjects={shouldShowRelatedProjects}
            />
          </div>
          <CreateComponentModal
            setLinkMode={setLinkMode}
            createDispatch={createDispatch}
            showDialog={createState.showCreateDialog}
            onSaveDraftSignalComponent={onSaveDraftSignalComponent}
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
            showDialog={editState.showEditModeDialog}
            editDispatch={editDispatch}
            onEditFeatures={onEditFeatures}
          />
          <EditAttributesModal
            showDialog={editState.showEditAttributesDialog}
            editDispatch={editDispatch}
            componentToEdit={clickedComponent}
            refetchProjectComponents={refetchProjectComponents}
            setClickedComponent={setClickedComponent}
          />
        </main>
      </div>
    </Dialog>
  );
}
