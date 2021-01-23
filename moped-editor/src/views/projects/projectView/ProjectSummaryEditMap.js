import React, { useState } from "react";
import NewProjectMap from "../newProjectView/NewProjectMap";
import {
  AppBar,
  Button,
  IconButton,
  Dialog,
  makeStyles,
  Toolbar,
  Typography,
  Slide,
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";

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

const ProjectSummaryMap = ({
  selectedLayerIds,
  projectExtentGeoJSON,
  isEditing,
  setIsEditing,
}) => {
  const classes = useStyles();
  const [editLayerIds, setEditLayerIds] = useState(selectedLayerIds);
  const [editFeatureCollection, setEditFeatureCollection] = useState(
    projectExtentGeoJSON
  );

  const handleClose = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    // TODO: Add GraphQL mutation
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
          <Typography variant="h6" className={classes.title}>
            Edit Map
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSave}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <NewProjectMap
        selectedLayerIds={editLayerIds}
        setSelectedLayerIds={setEditLayerIds}
        featureCollection={editFeatureCollection}
        setFeatureCollection={setEditFeatureCollection}
      />
    </Dialog>
  );
};

export default ProjectSummaryMap;
