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
  onSaveDraftSignalComponent,
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
      phase,
      subphase,
      completionDate,
    } = formData;

    const newComponent = {
      component_id,
      component_name,
      component_subtype,
      line_representation,
      internal_table,
      moped_subcomponents: subcomponents,
      description: description.length > 0 ? description : null,
      phase_id: phase?.data.phase_id,
      subphase_id: subphase?.data.subphase_id,
      completion_date: completionDate,
      label: component_name,
      features: [],
    };

    const linkMode = newComponent.line_representation ? "lines" : "points";

    // Signal components get their geometry from the Knack signal dataset so we save them
    // immediately. All other components are saved after the user selects or draws their geometry.
    if (isSavingSignalFeature) {
      const newComponentWithSignalFeature = {
        ...newComponent,
        features: [formData.signal],
      };

      onSaveDraftSignalComponent(newComponentWithSignalFeature);
    } else {
      createDispatch({ type: "store_draft_component", payload: newComponent });
      setLinkMode(linkMode);
      createDispatch({ type: "close_create_dialog" });
    }
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
        <ComponentForm onSave={onSave} formButtonText="Continue" />
      </DialogContent>
    </Dialog>
  );
};

export default CreateComponentModal;
