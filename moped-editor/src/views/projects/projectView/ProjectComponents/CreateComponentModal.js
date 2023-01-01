import React from "react";
import ComponentForm from "./ComponentForm";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const CreateComponentModal = ({
  showDialog,
  setLinkMode,
  createDispatch,
  onSignalChange,
  onSaveDraftComponent,
}) => {
  const classes = useStyles();

  const onSave = (formData) => {
    const isSavingSignalFeature = Boolean(formData.signal);

    const {
      component: {
        data: {
          component_id,
          component_name,
          component_subtype,
          line_representation,
          feature_layer: { internal_table },
        },
      },
      subcomponents,
      description,
    } = formData;

    const newComponent = {
      component_id,
      component_name,
      component_subtype,
      line_representation,
      internal_table,
      moped_subcomponents: subcomponents,
      description: description.length > 0 ? description : null,
      label: component_name,
      features: [],
    };

    const linkMode = newComponent.line_representation ? "lines" : "points";

    if (isSavingSignalFeature) {
      // Add the signal feature to the new component
      const newComponentWithSignalFeature = {
        ...newComponent,
        features: [formData.signal],
      };

      onSaveDraftComponent(newComponentWithSignalFeature);
    } else {
      createDispatch({ type: "store_draft_component", payload: newComponent });
      setLinkMode(linkMode);
      createDispatch({ type: "close_create_dialog" });
    }

    createDispatch({ type: "store_draft_component", payload: newComponent });
    setLinkMode(linkMode);
    createDispatch({ type: "close_create_dialog" });
  };

  const onClose = () => {
    setLinkMode(null);
    createDispatch({ type: "cancel_create" });
  };

  return (
    <Dialog open={showDialog} onClose={onClose} fullWidth scroll="body">
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <h3>New component</h3>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <ComponentForm
          onSave={onSave}
          formButtonText="Continue"
          onSignalChange={onSignalChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateComponentModal;
