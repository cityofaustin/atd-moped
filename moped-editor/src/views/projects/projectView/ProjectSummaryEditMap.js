import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import NewProjectMap from "../newProjectView/NewProjectMap";
import {
  AppBar,
  Button,
  Container,
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
    const recordsToUpdate = [];
    const recordsToInsert = [];

    const editedFeatures = editFeatureCollection.features;

    // Find new records that need to be inserted
    editedFeatures.forEach(feature => {
      // If there is a match, nothing needs to happen
      const match = projectFeatureRecords.find(
        record =>
          feature.properties.PROJECT_EXTENT_ID ===
          record.location.properties.PROJECT_EXTENT_ID
      );

      // If there isn't we need to insert
      !match &&
        recordsToInsert.push({
          location: feature,
          project_id: projectId,
          status_id: 1,
        });
    });

    // Find existing records that need to be soft deleted
    projectFeatureRecords
      .map(record => filterObjectByKeys(record, ["__typename"]))
      .forEach(record => {
        // If there is a match, nothing needs to happen
        const editedFeaturesMatch = editedFeatures.find(
          feature =>
            feature.properties.PROJECT_EXTENT_ID ===
            record.location.properties.PROJECT_EXTENT_ID
        );

        // If there isn't a match, we need to update
        !editedFeaturesMatch &&
          recordsToUpdate.push({
            ...record,
            status_id: 0,
          });
      });

    const upserts = [...recordsToInsert, ...recordsToUpdate];

    updateProjectExtent({
      variables: { upserts },
    }).then(() => {
      refetchProjectDetails();
      handleClose();
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
        <Container>
          <Alert severity="error">
            The map edit failed to save. Please try again.
          </Alert>
        </Container>
      )}
    </Dialog>
  );
};

export default ProjectSummaryEditMap;
