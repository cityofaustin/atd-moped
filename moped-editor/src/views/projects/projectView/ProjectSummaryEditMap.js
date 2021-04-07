import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import NewProjectMap from "../newProjectView/NewProjectMap";
import {
  sumFeaturesSelected,
  mapErrors,
  mapConfig,
} from "../../../utils/mapHelpers";
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
import { UPDATE_PROJECT_EXTENT } from "../../../queries/project";

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

const ProjectSummaryMap = ({
  projectId,
  selectedLayerIds,
  projectExtentGeoJSON,
  isEditing,
  setIsEditing,
  refetchProjectDetails,
}) => {
  const classes = useStyles();
  const [updateProjectExtent, { loading, error }] = useMutation(
    UPDATE_PROJECT_EXTENT
  );
  const [editLayerIds, setEditLayerIds] = useState(selectedLayerIds);
  const [editFeatureCollection, setEditFeatureCollection] = useState(
    projectExtentGeoJSON
  );
  const areMinimumFeaturesSet =
    sumFeaturesSelected(editLayerIds) >= mapConfig.minimumFeaturesInProject;

  /**
   * Updates isEditing state to close dialog on cancel button click
   */
  const handleClose = () => {
    setIsEditing(false);
  };

  /**
   * Calls update project mutation, refetches data and handles dialog close on success
   */
  const handleSave = () => {
    updateProjectExtent({
      variables: { projectId, editLayerIds, editFeatureCollection },
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
        selectedLayerIds={editLayerIds}
        setSelectedLayerIds={setEditLayerIds}
        featureCollection={editFeatureCollection}
        setFeatureCollection={setEditFeatureCollection}
      />
      {error && (
        <Alert className={classes.mapAlert} severity="error">
          {mapErrors.failedToSave}
        </Alert>
      )}
      {!areMinimumFeaturesSet && (
        <Alert className={classes.mapAlert} severity="error">
          {mapErrors.atLeastOneLocation}
        </Alert>
      )}
    </Dialog>
  );
};

export default ProjectSummaryMap;
