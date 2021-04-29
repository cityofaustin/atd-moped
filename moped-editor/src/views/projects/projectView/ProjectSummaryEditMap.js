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
import { UPDATE_PROJECT_EXTENT } from "../../../queries/project";
import { createFeatureCollectionFromProjectFeatures } from "../../../utils/mapHelpers";

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
    UPDATE_PROJECT_EXTENT
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
   * Calls update project mutation, refetches data, and handles dialog close on success
   */
  const handleSave = () => {
    // When a user clicks, the feature is either
    // 1. Already in the feature collection so find it and update to status_id of 0 to soft delete
    // 2. Is a new feature so insert a new record so it comes back on refetch
    // We need to separate records that
    // 1. Need to be inserted (are NEW)
    // 2. Need to be updated to status_id of 0 (are EXISTING)
    const records = projectFeatureRecords;
    debugger;

    updateProjectExtent({
      variables: { projectId, editFeatureCollection },
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
