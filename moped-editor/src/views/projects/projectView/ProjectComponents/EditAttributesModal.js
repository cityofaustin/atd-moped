import React from "react";
import { useMutation } from "@apollo/client";
import ComponentForm from "./ComponentForm";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import CloseIcon from "@mui/icons-material/Close";
import {
  UPDATE_COMPONENT_ATTRIBUTES,
  UPDATE_SIGNAL_COMPONENT,
} from "src/queries/components";
import { knackSignalRecordToFeatureSignalsRecord } from "src/utils/signalComponentHelpers";
import { zoomMapToFeatureCollection } from "./utils/map";
import { fitBoundsOptions } from "./mapSettings";
import {
  makeComponentFormFieldValue,
  makeSubcomponentsFormFieldValues,
  makeSignalFormFieldValue,
  makePhaseFormFieldValue,
  makeSubphaseFormFieldValue,
  makeTagFormFieldValues,
} from "./utils/form";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const EditAttributesModal = ({
  showDialog,
  editDispatch,
  componentToEdit,
  refetchProjectComponents,
  mapRef,
}) => {
  const classes = useStyles();

  const [updateComponentAttributes] = useMutation(UPDATE_COMPONENT_ATTRIBUTES);
  const [updateSignalComponent] = useMutation(UPDATE_SIGNAL_COMPONENT);

  const onSaveSuccess = () => {
    refetchProjectComponents().then(() => {
      onClose();
    });
  };

  const onSave = (formData) => {
    const isSavingSignalFeature = Boolean(formData.signal);

    const { subcomponents, phase, subphase, tags } = formData;
    const completionDate = !!phase ? formData.completionDate : null;
    // TODO: Can we remove this because RHF returns null now?
    const description =
      formData.description?.length > 0 ? formData.description : null;
    // TODO: Can we remove this because RHF returns null now?
    const srtsId = formData.srtsId?.length > 0 ? formData.srtsId : null;
    const { project_component_id: projectComponentId } = componentToEdit;

    // Prepare the subcomponent data for the mutation
    const subcomponentsArray = subcomponents
      ? subcomponents.map((subcomponent) => ({
          subcomponent_id: subcomponent.value,
          is_deleted: false, // Used for update on constraint in mutation
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

    if (isSavingSignalFeature) {
      const signalFromForm = formData.signal;
      const featureSignalRecord =
        knackSignalRecordToFeatureSignalsRecord(signalFromForm);

      const signalToInsert = {
        ...featureSignalRecord,
        component_id: projectComponentId,
      };

      updateSignalComponent({
        variables: {
          projectComponentId: projectComponentId,
          description,
          subcomponents: subcomponentsArray,
          signals: [signalToInsert],
          phaseId: phase?.data.phase_id,
          subphaseId: subphase?.data.subphase_id,
          componentTags: tagsArray,
          completionDate,
          srtsId,
        },
      })
        .then(() => {
          onSaveSuccess();

          const [existingLongitude, existingLatitude] =
            featureSignalRecord.geography.coordinates[0];
          const [newLongitude, newLatitude] =
            signalFromForm.geometry.coordinates;
          const hasLocationChanged =
            existingLongitude !== newLongitude ||
            existingLatitude !== newLatitude;

          // Zoom to the new signal location if it updated
          hasLocationChanged &&
            zoomMapToFeatureCollection(
              mapRef,
              { type: "FeatureCollection", features: [signalFromForm] },
              fitBoundsOptions.zoomToClickedComponent
            );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      updateComponentAttributes({
        variables: {
          projectComponentId: projectComponentId,
          description,
          subcomponents: subcomponentsArray,
          phaseId: phase?.data.phase_id,
          subphaseId: subphase?.data.subphase_id,
          componentTags: tagsArray,
          completionDate,
          srtsId,
        },
      })
        .then(() => onSaveSuccess())
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const onClose = () => {
    editDispatch({ type: "cancel_attributes_edit" });
  };

  const initialFormValues = componentToEdit
    ? {
        component: makeComponentFormFieldValue(componentToEdit),
        description: componentToEdit.description,
        subcomponents: makeSubcomponentsFormFieldValues(
          componentToEdit.moped_proj_components_subcomponents
        ),
        signal: makeSignalFormFieldValue(componentToEdit),
        phase: makePhaseFormFieldValue(componentToEdit.moped_phase),
        subphase: makeSubphaseFormFieldValue(componentToEdit.moped_subphase),
        completionDate: componentToEdit.completion_date,
        srtsId: componentToEdit.srts_id,
        tags: makeTagFormFieldValues(
          componentToEdit?.moped_proj_component_tags
        ),
      }
    : null;

  return (
    <Dialog open={showDialog} onClose={onClose} fullWidth scroll="body">
      <DialogTitle className={classes.dialogTitle}>
        <h3>Edit component</h3>
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
