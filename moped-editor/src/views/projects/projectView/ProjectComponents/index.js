import { useState, useRef } from "react";
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
import ComponentEditModal from "./ComponentEditModal";
import DeleteComponentModal from "./DeleteComponentModal";
import EditModeDialog from "./EditModeDialog";
import ComponentMapToolbar from "./ComponentMapToolbar";
import ComponentListItem from "./ComponentListItem";
import DraftComponentListItem from "./DraftComponentListItem";
import { useAppBarHeight } from "./utils/map";
import {
  ADD_PROJECT_COMPONENT,
  GET_PROJECT_COMPONENTS,
  DELETE_PROJECT_COMPONENT,
} from "src/queries/components";
import {
  makeDrawnLinesInsertionData,
  makeDrawnPointsInsertionData,
  makeLineStringFeatureInsertionData,
  makePointFeatureInsertionData,
} from "./utils/makeFeatures";
import { makeComponentFeatureCollectionsMap } from "./utils/makeData";

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

  /* holds this project's components */
  const [components, setComponents] = useState([]);
  const [featureCollectionsByComponentId, setFeatureCollectionsByComponentId] =
    useState({});

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

  const [addProjectComponent] = useMutation(ADD_PROJECT_COMPONENT);
  const [deleteProjectComponent] = useMutation(DELETE_PROJECT_COMPONENT);
  const {
    loading,
    error,
    data,
    refetch: refetchProjectComponents,
  } = useQuery(GET_PROJECT_COMPONENTS, {
    variables: { projectId },
    fetchPolicy: "no-cache",
    onCompleted: () => {
      setComponents(data.moped_proj_components);

      // Create feature collections of all features in each component
      const componentFeatureCollections = makeComponentFeatureCollectionsMap(
        data.project_geography
      );
      setFeatureCollectionsByComponentId(componentFeatureCollections);
    },
  });

  /* fits clickedComponent to map bounds - called from component list item secondary action */
  const onClickZoomToComponent = (component) => {
    const componentId = component.project_component_id;
    const featureCollection = featureCollectionsByComponentId[componentId];

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
    // Start data preparation
    const {
      component_id,
      description,
      moped_subcomponents,
      component_name,
      internal_table,
      features,
    } = draftComponent;

    const subcomponentsArray = moped_subcomponents
      ? moped_subcomponents.map((subcomponent) => ({
          subcomponent_id: subcomponent.value,
        }))
      : [];

    const featureTable = internal_table;

    const featuresToInsert = [];
    const drawnLinesToInsert = [];
    const drawnPointsToInsert = [];

    const drawnFeatures = features.filter(
      (feature) => feature?.properties?.["DRAW_ID"]
    );
    const selectedFeatures = features.filter(
      (feature) => !feature?.properties?.["DRAW_ID"]
    );

    if (featureTable === "feature_street_segments") {
      makeLineStringFeatureInsertionData(
        featureTable,
        selectedFeatures,
        featuresToInsert
      );
      makeDrawnLinesInsertionData(drawnFeatures, drawnLinesToInsert);
    } else if (
      featureTable === "feature_intersections" ||
      featureTable === "feature_signals"
    ) {
      makePointFeatureInsertionData(
        featureTable,
        selectedFeatures,
        featuresToInsert
      );
      makeDrawnPointsInsertionData(drawnFeatures, drawnPointsToInsert);
    }

    const newComponentData = {
      description,
      component_id,
      name: component_name,
      project_id: projectId,
      moped_proj_components_subcomponents: {
        data: subcomponentsArray,
      },
      [featureTable]: {
        data: featuresToInsert,
      },
      feature_drawn_lines: { data: drawnLinesToInsert },
      feature_drawn_points: { data: drawnPointsToInsert },
    };

    // End data preparation

    addProjectComponent({ variables: { object: newComponentData } }).then(
      () => {
        refetchProjectComponents();
      }
    );

    setIsEditingComponent(false);
    setDraftComponent(null);
    setLinkMode(null);
  };

  const onCancelComponentCreate = () => {
    setIsEditingComponent(!isEditingComponent);
    setDraftComponent(null);
    setLinkMode(null);
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
    deleteProjectComponent({
      variables: { projectComponentId: clickedComponent.project_component_id },
    }).then(() => {
      refetchProjectComponents();
    });

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
              featureCollectionsByComponentId={featureCollectionsByComponentId}
            />
          </div>
          <ComponentEditModal
            showDialog={showComponentEditDialog}
            setShowDialog={setShowComponentEditDialog}
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
