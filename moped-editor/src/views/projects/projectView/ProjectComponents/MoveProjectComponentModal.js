import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import CloseIcon from "@mui/icons-material/Close";

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
  componentId,
  showDialog,
  setIsMovingComponent,
  refetchProjectComponents,
}) => {
  const classes = useStyles();

  // Update component project_component_id mutation

  // Refetch project components and close modal
  const onSaveSuccess = () => {
    refetchProjectComponents().then(() => {
      onClose();
    });
  };

  const onClose = () => {
    setIsMovingComponent(false);
  };

  return (
    <Dialog open={showDialog} onClose={onClose} fullWidth scroll="body">
      <DialogTitle className={classes.dialogTitle}>
        <h3>Edit component</h3>
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>"the move component modal"</DialogContent>
    </Dialog>
  );
};

export default MoveProjectComponentModal;
