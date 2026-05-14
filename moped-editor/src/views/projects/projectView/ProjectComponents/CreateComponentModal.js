import React from "react";
import ComponentForm from "./ComponentForm";
import FormDialog from "src/components/FormDialog";

const CreateComponentModal = ({
  showDialog,
  setLinkMode,
  createDispatch,
  onSaveDraftSignalComponent,
}) => {
  const onSave = (formData) => {
    const isSavingKnackFeature = Boolean(
      formData.signal || formData.schoolBeacon
    );

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

    if (isSavingKnackFeature) {
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

    // Signal components and school beacon components get their geometry from Knack datasets so we save them
    // immediately. All other components are saved after the user selects or draws their geometry.
    if (isSavingKnackFeature) {
      const newComponentWithSignalFeature = {
        ...newComponent,
        features: [formData.signal || formData.schoolBeacon],
      };
      onSaveDraftSignalComponent(newComponentWithSignalFeature);
    } else {
      createDispatch({ type: "store_draft_component", payload: newComponent });
      setLinkMode(linkMode);
      createDispatch({ type: "close_create_dialog" });
    }
  };

  const onClose = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setLinkMode(null);
    createDispatch({ type: "cancel_create" });
  };

  return (
    <FormDialog title="New component" open={showDialog} handleClose={onClose}>
      <ComponentForm onSave={onSave} formButtonText="Continue" />
    </FormDialog>
  );
};

export default CreateComponentModal;
