import { useState, useRef, useEffect, Profiler, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router";
import makeStyles from "@mui/styles/makeStyles";
import { Dialog } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import TheMap from "./TheMap";
import CreateComponentModal from "./CreateComponentModal";
import EditAttributesModal from "./EditAttributesModal";
import DeleteComponentModal from "./DeleteComponentModal";
import ComponentMapToolbar from "./ComponentMapToolbar";
import MoveProjectComponentModal from "./MoveProjectComponentModal";
import { useAppBarHeight } from "./utils/map";
import { GET_PROJECT_COMPONENTS } from "src/queries/components";
import { getAllComponentFeatures } from "./utils/makeFeatureCollections";
import { fitBoundsOptions } from "./mapSettings";
import { useCreateComponent } from "./utils/useCreateComponent";
import { useUpdateComponent } from "./utils/useUpdateComponent";
import { useDeleteComponent } from "./utils/useDeleteComponent";
import {
  useComponentLinkParams,
  updateClickedComponentIdInSearchParams,
} from "./utils/useComponentLinkParams";
import { useToolbarErrorMessage } from "./utils/useToolbarErrorMessage";
import { zoomMapToFeatureCollection } from "./utils/map";
import { useProjectComponents } from "./utils/useProjectComponents";
import NewComponentToolbar from "./NewComponentToolbar";
import DraftComponentList from "./DraftComponentList";
import VirtualizedComponentsList from "./VirtualizedComponentsList";

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
    overflow: "hidden",
    flex: 1,
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

export default function MapView({
  projectName,
  phaseKey,
  phaseName,
  parentProjectId,
  onCloseTab,
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

  /* tracks a projectFeature hovered on map */
  const [hoveredOnMapFeature, setHoveredOnMapFeature] = useState(null);

  /* tracks the loading state of AGOL feature service fetching */
  const [isFetchingFeatures, setIsFetchingFeatures] = useState(false);

  /* tracks the drawing state of the map */
  const [isDrawing, setIsDrawing] = useState(false);

  /* tracks when a component is being moved from one project to another */
  const [isMovingComponent, setIsMovingComponent] = useState(false);

  /* track settings state and whether we show parent, sibling, and child projects */
  const [areSettingsOpen, setAreSettingsOpen] = useState(true);
  const [shouldShowRelatedProjects, setShouldShowRelatedProjects] =
    useState(true);
  const [isClickedComponentRelated, setIsClickedComponentRelated] =
    useState(false);

  const toggleShowRelatedProjects = () => {
    setShouldShowRelatedProjects(!shouldShowRelatedProjects);

    // If the clicked component is a related component, we need to clear clicked component state
    // so it is no longer highlighted on the map.
    if (isClickedComponentRelated) {
      setClickedComponent(null);
      setIsClickedComponentRelated(false);
    }
  };

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

  const { projectComponents, allRelatedComponents } =
    useProjectComponents(data);

  const { errorMessageDispatch, errorMessageState } = useToolbarErrorMessage();

  useComponentLinkParams({
    setClickedComponent,
    setIsClickedComponentRelated,
    projectComponents,
    allRelatedComponents,
    clickedComponent,
    errorMessageDispatch,
    mapRef,
  });

  /* Bundle updates that need to be made any time a component UI element is clicked */
  const makeClickedComponentUpdates = useCallback((clickedComponent) => {
    setClickedComponent(clickedComponent);
    updateClickedComponentIdInSearchParams(clickedComponent);
  }, []);

  const {
    onSaveDraftComponent,
    onSaveDraftSignalComponent,
    onCancelComponentCreate,
    createState,
    createDispatch,
  } = useCreateComponent({
    projectId,
    setLinkMode,
    refetchProjectComponents,
    setIsDrawing,
    mapRef,
  });

  const {
    editState,
    editDispatch,
    onSaveEditedComponent,
    onCancelComponentMapEdit,
    onEditFeatures,
    doesDraftEditComponentHaveFeatures,
  } = useUpdateComponent({
    projectComponents,
    clickedComponent,
    setLinkMode,
    refetchProjectComponents,
    setIsDrawing,
    mapRef,
    makeClickedComponentUpdates,
  });

  // Keep clickedComponent state up to date with edits made to project components
  useEffect(() => {
    if (clickedComponent === null) return;

    const clickedComponentId = clickedComponent?.project_component_id;
    const updatedClickedComponent =
      projectComponents.find(
        (component) => component.project_component_id === clickedComponentId
      ) ||
      allRelatedComponents.find(
        (component) => component.project_component_id === clickedComponentId
      );

    setClickedComponent(updatedClickedComponent);
  }, [clickedComponent, projectComponents, allRelatedComponents]);

  // Keep draft component state in sync with clicked component (when editing)
  useEffect(() => {
    if (clickedComponent && !editState.isEditingComponent) {
      editDispatch({ type: "set_draft_component", payload: clickedComponent });
    }
  }, [
    clickedComponent,
    editDispatch,
    editState.draftEditComponent,
    editState.isEditingComponent,
  ]);

  const { isDeletingComponent, setIsDeletingComponent, onDeleteComponent } =
    useDeleteComponent({
      clickedComponent,
      refetchProjectComponents,
      makeClickedComponentUpdates,
    });

  if (error) console.log(error);

  /* fits clickedComponent to map bounds - called from component list item secondary action */
  const onClickZoomToComponent = useCallback(
    (component) => {
      const features = getAllComponentFeatures(component);
      const featureCollection = { type: "FeatureCollection", features };

      makeClickedComponentUpdates(component);

      // move the map
      zoomMapToFeatureCollection(
        mapRef,
        featureCollection,
        fitBoundsOptions.zoomToClickedComponent
      );
    },
    [makeClickedComponentUpdates]
  );

  /* Start creating and clear clicked component and draft edit states to deselect component */
  const onStartCreatingComponent = () => {
    createDispatch({ type: "start_create" });
    editDispatch({ type: "clear_draft_component" });
    makeClickedComponentUpdates(null);
  };

  const getIsExpanded = useCallback(
    (component) =>
      clickedComponent?.project_component_id === component.project_component_id,
    [clickedComponent]
  );

  const onListItemClick = (component) => {
    setIsClickedComponentRelated(false);
    // Clear clickedComponent and draftEditComponent when we are not selecting for edit
    if (getIsExpanded(component)) {
      makeClickedComponentUpdates(null);
      editDispatch({ type: "clear_draft_component" });
    } else if (isNotCreatingOrEditing) {
      makeClickedComponentUpdates(component);
    }
  };

  const onRelatedListItemClick = (component) => {
    if (getIsExpanded(component)) {
      makeClickedComponentUpdates(null);
      setIsClickedComponentRelated(false);
    } else if (isNotCreatingOrEditing) {
      makeClickedComponentUpdates(component);
      setIsClickedComponentRelated(true);
    }
  };

  const isNotCreatingOrEditing =
    !createState.isCreatingComponent && !editState.isEditingComponent;

  function onRender(
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) {
    console.log({
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
    });
  }

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
          onCloseTab={onCloseTab}
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
              <NewComponentToolbar
                createState={createState}
                editState={editState}
                shouldShowRelatedProjects={shouldShowRelatedProjects}
                toggleShowRelatedProjects={toggleShowRelatedProjects}
                onStartCreatingComponent={onStartCreatingComponent}
                areSettingsOpen={areSettingsOpen}
                setAreSettingsOpen={setAreSettingsOpen}
              />
              <DraftComponentList
                createState={createState}
                editState={editState}
                onCancelComponentCreate={onCancelComponentCreate}
                onCancelComponentMapEdit={onCancelComponentMapEdit}
                doesDraftEditComponentHaveFeatures={
                  doesDraftEditComponentHaveFeatures
                }
                onSaveDraftComponent={onSaveDraftComponent}
                onSaveEditedComponent={onSaveEditedComponent}
              />
            </List>
            {isNotCreatingOrEditing ? (
              <VirtualizedComponentsList
                projectId={projectId}
                createState={createState}
                editState={editState}
                editDispatch={editDispatch}
                onClickZoomToComponent={onClickZoomToComponent}
                onEditFeatures={onEditFeatures}
                projectComponents={projectComponents}
                allRelatedComponents={allRelatedComponents}
                setIsDeletingComponent={setIsDeletingComponent}
                setIsMovingComponent={setIsMovingComponent}
                setIsClickedComponentRelated={setIsClickedComponentRelated}
                onListItemClick={onListItemClick}
                getIsExpanded={getIsExpanded}
                shouldShowRelatedProjects={shouldShowRelatedProjects}
                makeClickedComponentUpdates={makeClickedComponentUpdates}
                onRelatedListItemClick={onRelatedListItemClick}
              />
            ) : null}
          </div>
        </Drawer>
        <main className={classes.content}>
          <PlaceholderToolbar />
          <div style={{ height: "100%" }}>
            <TheMap
              mapRef={mapRef}
              projectComponents={projectComponents}
              allRelatedComponents={allRelatedComponents}
              draftComponent={createState.draftComponent}
              createDispatch={createDispatch}
              draftEditComponent={editState.draftEditComponent}
              editDispatch={editDispatch}
              setHoveredOnMapFeature={setHoveredOnMapFeature}
              hoveredOnMapFeature={hoveredOnMapFeature}
              isCreatingComponent={createState.isCreatingComponent}
              isEditingComponent={editState.isEditingComponent}
              clickedComponent={clickedComponent}
              isClickedComponentRelated={isClickedComponentRelated}
              setIsClickedComponentRelated={setIsClickedComponentRelated}
              setIsFetchingFeatures={setIsFetchingFeatures}
              linkMode={linkMode}
              isDrawing={isDrawing}
              setIsDrawing={setIsDrawing}
              errorMessageDispatch={errorMessageDispatch}
              shouldShowRelatedProjects={shouldShowRelatedProjects}
              makeClickedComponentUpdates={makeClickedComponentUpdates}
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
            setIsDeletingComponent={setIsDeletingComponent}
            onDeleteComponent={onDeleteComponent}
          />
          <EditAttributesModal
            showDialog={editState.showEditAttributesDialog}
            editDispatch={editDispatch}
            clickedComponent={clickedComponent}
            refetchProjectComponents={refetchProjectComponents}
            mapRef={mapRef}
          />
          <MoveProjectComponentModal
            component={clickedComponent}
            showDialog={isMovingComponent}
            setIsMovingComponent={setIsMovingComponent}
            refetchProjectComponents={refetchProjectComponents}
          />
        </main>
      </div>
    </Dialog>
  );
}
