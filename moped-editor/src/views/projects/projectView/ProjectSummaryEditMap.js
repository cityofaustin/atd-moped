import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import NewProjectMap from "../newProjectView/NewProjectMap";
import { countFeatures, mapErrors, mapConfig } from "../../../utils/mapHelpers";
import {
  AppBar,
  Button,
  IconButton,
  Dialog,
  makeStyles,
  Toolbar,
  Typography,
  Slide,
  CircularProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Close as CloseIcon, Save as SaveIcon } from "@material-ui/icons";
import { UPSERT_PROJECT_EXTENT } from "../../../queries/project";
import { filterObjectByKeys } from "../../../utils/materialTableHelpers";

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  mapAlert: {
    margin: "0px 24px 24px 24px",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProjectSummaryEditMap = ({
  projectId,
  projectFeatureCollection,
  projectFeatureRecords,
  isEditing,
  setIsEditing,
  refetchProjectDetails,
}) => {
  const classes = useStyles();
  const [updateProjectExtent, { loading, error }] = useMutation(
    UPSERT_PROJECT_EXTENT
  );
  const [editFeatureCollection, setEditFeatureCollection] = useState(
    projectFeatureCollection
  );
  const areMinimumFeaturesSet =
    countFeatures(projectFeatureCollection) >=
    mapConfig.minimumFeaturesInProject;

  // projectExtent updates when refetchProjectDetails is called, update editFeatureCollection which is passed to editor and draw UI
  useEffect(() => {
    setEditFeatureCollection(projectFeatureCollection);
  }, [projectFeatureCollection]);

  /**
   * Updates isEditing state to close dialog on cancel button click
   */
  const handleClose = () => {
    setIsEditing(false);
  };

  /**
   * Calls upsert project features mutation, refetches data, and handles dialog close on success
   */
  const handleSave = () => {
    const editedFeatures = editFeatureCollection.features;

    // Find new records that need to be inserted and create a feature record from them
    const newRecordsToInsert = editedFeatures
      .filter(
        feature =>
          !projectFeatureRecords.find(
            record =>
              feature.properties.PROJECT_EXTENT_ID ===
              record.location.properties.PROJECT_EXTENT_ID
          )
      )
      .map(feature => ({
        location: feature,
        project_id: projectId,
        status_id: 1,
      }));

    // Find existing records that need to be soft deleted, clean them, and set status to inactive
    const existingRecordsToUpdate = projectFeatureRecords
      .map(record => filterObjectByKeys(record, ["__typename"]))
      .filter(
        record =>
          !editedFeatures.find(
            feature =>
              feature.properties.PROJECT_EXTENT_ID ===
              record.location.properties.PROJECT_EXTENT_ID
          )
      )
      .map(record => ({
        ...record,
        status_id: 0,
      }));

    const upserts = [...newRecordsToInsert, ...existingRecordsToUpdate];

    updateProjectExtent({
      variables: { upserts },
    }).then(() => {
      refetchProjectDetails().then(() => {
        handleClose();
      });
    });
  };

  return (
    <Dialog
      fullScreen
      open={isEditing}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" className={classes.title}>
            Edit Project Extent
          </Typography>
          {!loading ? (
            <Button
              autoFocus
              color="inherit"
              onClick={handleSave}
              disabled={!areMinimumFeaturesSet}
              startIcon={<SaveIcon />}
            >
              save
            </Button>
          ) : (
            <CircularProgress />
          )}
        </Toolbar>
      </AppBar>
      <NewProjectMap
        featureCollection={editFeatureCollection}
        setFeatureCollection={setEditFeatureCollection}
        projectId={projectId}
        refetchProjectDetails={refetchProjectDetails}
      />
      {error && (
        <Alert className={classes.mapAlert} severity="error">
          {mapErrors.failedToSave}
        </Alert>
      )}
      {!areMinimumFeaturesSet && (
        <Alert className={classes.mapAlert} severity="error">
          {mapErrors.minimumLocations}
        </Alert>
      )}
    </Dialog>
  );
};

export default ProjectSummaryEditMap;
