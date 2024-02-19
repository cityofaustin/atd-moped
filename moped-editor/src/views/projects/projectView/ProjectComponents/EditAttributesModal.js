import React from "react";
import { useMutation } from "@apollo/client";
import ComponentForm from "./ComponentForm";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { UPDATE_COMPONENT_ATTRIBUTES } from "src/queries/components";
import { getFeatureChangesFromComponentForm } from "./utils/makeComponentData";
import { zoomMapToFeatureCollection } from "./utils/map";
import { fitBoundsOptions } from "./mapSettings";
import {
  makeComponentFormFieldValue,
  makeSubcomponentsFormFieldValues,
  makeSignalFormFieldValue,
  makePhaseFormFieldValue,
  makeSubphaseFormFieldValue,
  makeTagFormFieldValues,
  makeWorkTypesFormFieldValues,
} from "./utils/form";

const EditAttributesModal = ({
  showDialog,
  editDispatch,
  clickedComponent,
  refetchProjectComponents,
  mapRef,
}) => {
  const [updateComponentAttributes] = useMutation(UPDATE_COMPONENT_ATTRIBUTES);

  const onSaveSuccess = () => {
    refetchProjectComponents().then(() => {
      onClose();
    });
  };

  const onSave = (formData) => {
    const {
      component: {
        data: { component_id: componentId },
      },
      subcomponents,
      phase,
      subphase,
      tags,
      work_types,
      completionDate,
      srtsId,
      locationDescription,
      description,
    } = formData;

    const { project_component_id: projectComponentId } = clickedComponent;

    // Prepare the subcomponent data for the mutation
    const subcomponentsArray = subcomponents
      ? subcomponents.map((subcomponent) => ({
          subcomponent_id: subcomponent.value,
          is_deleted: false, // Used for update on constraint in mutation
          project_component_id: projectComponentId,
        }))
      : [];

    // Prepare the work type data for the mutation
    const workTypesArray = work_types
      ? work_types.map((workType) => ({
          work_type_id: workType.value,
          is_deleted: false,
          project_component_id: projectComponentId,
        }))
      : [];

    const tagsArray = tags
      ? tags.map((tag) => ({
          component_tag_id: tag.value,
          is_deleted: false,
          project_component_id: projectComponentId,
        }))
      : [];

    const signalFromForm = formData.signal;
    const { signalsToCreate, featureIdsToDelete } =
      getFeatureChangesFromComponentForm(signalFromForm, clickedComponent);

    updateComponentAttributes({
      variables: {
        projectComponentId: projectComponentId,
        componentId,
        description,
        subcomponents: subcomponentsArray,
        workTypes: workTypesArray,
        signalsToCreate: signalsToCreate,
        featureIdsToDelete: featureIdsToDelete,
        phaseId: phase?.value,
        subphaseId: subphase?.value,
        componentTags: tagsArray,
        completionDate,
        srtsId,
        locationDescription,
      },
    })
      .then(() => {
        onSaveSuccess();
        // Zoom to the new signal location if it was updated
        signalsToCreate.length > 0 &&
          zoomMapToFeatureCollection(
            mapRef,
            { type: "FeatureCollection", features: [signalFromForm] },
            fitBoundsOptions.zoomToClickedComponent
          );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onClose = () => {
    editDispatch({ type: "cancel_attributes_edit" });
  };

  const initialFormValues = clickedComponent
    ? {
        component: makeComponentFormFieldValue(clickedComponent),
        description:
          clickedComponent.description?.length > 0
            ? clickedComponent.description
            : null,
        subcomponents: makeSubcomponentsFormFieldValues(
          clickedComponent.moped_proj_components_subcomponents
        ),
        work_types: makeWorkTypesFormFieldValues(
          clickedComponent.moped_proj_component_work_types
        ),
        signal: makeSignalFormFieldValue(clickedComponent),
        phase: makePhaseFormFieldValue(clickedComponent.moped_phase),
        subphase: makeSubphaseFormFieldValue(clickedComponent.moped_subphase),
        completionDate: clickedComponent.completion_date,
        srtsId:
          clickedComponent.srts_id?.length > 0
            ? clickedComponent.srts_id
            : null,
        tags: makeTagFormFieldValues(
          clickedComponent.moped_proj_component_tags
        ),
        locationDescription:
          clickedComponent.location_description?.length > 0
            ? clickedComponent.location_description
            : null,
        councilDistrict: !!clickedComponent.council_districts[0]
          ? clickedComponent.council_districts.join(", ")
          : "-",
        projectComponentId: clickedComponent.project_component_id,
        componentLength: clickedComponent.component_length,
      }
    : null;

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
        Edit component
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <ComponentForm
          onSave={onSave}
          formButtonText="Save"
          initialFormValues={initialFormValues}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditAttributesModal;
