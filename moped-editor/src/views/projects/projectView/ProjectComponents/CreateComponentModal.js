import React from "react";
import ComponentForm from "./ComponentForm";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CreateComponentModal = ({
  showDialog,
  setLinkMode,
  createDispatch,
  onSaveDraftSignalComponent,
}) => {
  const onSave = (formData) => {
    const isSavingSignalFeature = Boolean(formData.signal);

    let {
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
      tags,
      work_types,
      srtsId,
      locationDescription,
    } = formData;

    if (isSavingSignalFeature) {
      // disgusting hacky override to set the internal table to the asset table
      // when an asset has been selected in the form
      internal_table =
        formData.component.data.asset_feature_layer.internal_table;
    }

    const newComponent = {
      component_id,
      component_name,
      component_subtype,
      line_representation,
      internal_table,
      moped_subcomponents: subcomponents,
      work_types,
      description,
      phase_id: phase?.data.phase_id || null,
      subphase_id: subphase?.data.subphase_id || null,
      completion_date: completionDate,
      label: component_name,
      features: [],
      moped_proj_component_tags: tags,
      srts_id: srtsId,
      location_description: locationDescription,
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

  const onClose = (reason) => {
    if (reason && reason === "backdropClick")
      return;
    setLinkMode(null);
    createDispatch({ type: "cancel_create" });
  };

  return (
    <Dialog open={showDialog} onClose={onClose} fullWidth scroll="body">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        variant="h4"
      >
        New component
        <IconButton onClick={onClose} size="large">
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
