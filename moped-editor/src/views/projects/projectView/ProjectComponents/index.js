import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router";
import makeStyles from "@mui/styles/makeStyles";
import { Dialog } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import TheMap from "src/views/projects/projectView/ProjectComponents/TheMap";
import CreateComponentModal from "src/views/projects/projectView/ProjectComponents/CreateComponentModal";
import EditAttributesModal from "src/views/projects/projectView/ProjectComponents/EditAttributesModal";
import DeleteComponentModal from "src/views/projects/projectView/ProjectComponents/DeleteComponentModal";
import ComponentMapToolbar from "src/views/projects/projectView/ProjectComponents/ComponentMapToolbar";
import MoveProjectComponentModal from "src/views/projects/projectView/ProjectComponents/MoveProjectComponentModal";
import { useAppBarHeight } from "src/views/projects/projectView/ProjectComponents/utils/map";
import { GET_PROJECT_COMPONENTS } from "src/queries/components";
import { getAllComponentFeatures } from "./utils/makeFeatureCollections";
import { fitBoundsOptions } from "./mapSettings";
import { useCreateComponent } from "src/views/projects/projectView/ProjectComponents/utils/useCreateComponent";
import { useUpdateComponent } from "src/views/projects/projectView/ProjectComponents/utils/useUpdateComponent";
import { useDeleteComponent } from "src/views/projects/projectView/ProjectComponents/utils/useDeleteComponent";
import {
  useComponentLinkParams,
  updateClickedComponentIdInSearchParams,
} from "./utils/useComponentLinkParams";
import { useToolbarErrorMessage } from "src/views/projects/projectView/ProjectComponents/utils/useToolbarErrorMessage";
import { zoomMapToFeatureCollection } from "src/views/projects/projectView/ProjectComponents/utils/map";
import { useProjectComponents } from "src/views/projects/projectView/ProjectComponents/utils/useProjectComponents";
import NewComponentToolbar from "src/views/projects/projectView/ProjectComponents/NewComponentToolbar";
import DraftComponentList from "src/views/projects/projectView/ProjectComponents/DraftComponentList";
import ProjectComponentsList from "src/views/projects/projectView/ProjectComponents/ProjectComponentsList";

export const drawerWidth = 350;

const useStyles = makeStyles(() => ({
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

  const isNotCreatingOrEditing =
    !createState.isCreatingComponent && !editState.isEditingComponent;

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
            <List sx={{ paddingBottom: 0 }}>
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
              <ProjectComponentsList
                projectId={projectId}
                editDispatch={editDispatch}
                onClickZoomToComponent={onClickZoomToComponent}
                onEditFeatures={onEditFeatures}
                projectComponents={projectComponents}
                allRelatedComponents={allRelatedComponents}
                setIsDeletingComponent={setIsDeletingComponent}
                setIsMovingComponent={setIsMovingComponent}
                setIsClickedComponentRelated={setIsClickedComponentRelated}
                makeClickedComponentUpdates={makeClickedComponentUpdates}
                getIsExpanded={getIsExpanded}
                shouldShowRelatedProjects={shouldShowRelatedProjects}
                isNotCreatingOrEditing={isNotCreatingOrEditing}
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
