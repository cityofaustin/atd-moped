import React from "react";
import { useMutation } from "@apollo/client";
import MoveComponentForm from "./MoveComponentForm";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink } from "react-router-dom";
import { UPDATE_COMPONENT_PROJECT_ID } from "src/queries/components";
import theme from "src/theme/index";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const MoveProjectComponentModal = ({
  component,
  showDialog,
  setIsMovingComponent,
  refetchProjectComponents,
}) => {
  const classes = useStyles();
  const [updatedComponentFormData, setUpdatedComponentFormData] =
    React.useState(null);
  const updatedProjectId = updatedComponentFormData?.project?.value;
  const updatedProjectLabel = updatedComponentFormData?.project?.label;

  const [updateProjectId] = useMutation(UPDATE_COMPONENT_PROJECT_ID);

  // Refetch project components and close modal
  const onSaveSuccess = (formData) => {
    refetchProjectComponents().then(() => {
      setUpdatedComponentFormData(formData);
    });
  };

  const onClose = () => {
    setIsMovingComponent(false);
    setUpdatedComponentFormData(null);
  };

  // Update component project_component_id mutation
  const onSave = (formData) => {
    const projectId = formData?.project?.value;
    const componentId = component?.project_component_id;

    updateProjectId({
      variables: {
        projectId,
        componentId,
      },
    })
      .then(() => {
        onSaveSuccess(formData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Dialog open={showDialog} onClose={onClose} fullWidth scroll="body">
      <DialogTitle className={classes.dialogTitle}>
        <h3>Move component to another project</h3>
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        {!updatedComponentFormData ? (
          <MoveComponentForm component={component} onSave={onSave} />
        ) : (
          // TODO: Should we add project_component_id to the url here too?
          <Typography>
            Component moved to{" "}
            <RouterLink
              to={`/moped/projects/${updatedProjectId}?tab=map`}
              style={{ color: theme.palette.primary.main }}
            >
              #{updatedProjectLabel}
            </RouterLink>
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MoveProjectComponentModal;
