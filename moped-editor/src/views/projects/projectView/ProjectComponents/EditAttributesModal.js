import React from "react";
import { useMutation } from "@apollo/client";
import ComponentForm from "./ComponentForm";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {
  UPDATE_COMPONENT_ATTRIBUTES,
  UPDATE_SIGNAL_COMPONENT,
} from "src/queries/components";
import { knackSignalRecordToFeatureSignalsRecord } from "src/utils/signalComponentHelpers";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const EditComponentModal = ({
  showDialog,
  editDispatch,
  componentToEdit,
  refetchProjectComponents,
  setClickedComponent,
}) => {
  const classes = useStyles();

  const [updateComponentAttributes] = useMutation(UPDATE_COMPONENT_ATTRIBUTES);
  const [updateSignalComponent] = useMutation(UPDATE_SIGNAL_COMPONENT);

  const onComponentSaveSuccess = (updatedClickedComponentState) => {
    // Update component list item and clicked component state to keep UI up to date
    refetchProjectComponents().then(() => {
      onClose();
      // Update clickedComponent with the attributes that were just edited
      setClickedComponent((prevComponent) => ({
        ...prevComponent,
        ...updatedClickedComponentState,
      }));
    });
  };

  const onSave = (formData) => {
    const isSavingSignalFeature = Boolean(formData.signal);

    const { description, subcomponents, phase, subphase, phaseEnd } = formData;
    const { project_component_id: projectComponentId } = componentToEdit;

    // Prepare the subcomponent data for the mutation
    const subcomponentsArray = subcomponents
      ? subcomponents.map((subcomponent) => ({
          subcomponent_id: subcomponent.value,
          is_deleted: false, // Used for update on constraint in mutation
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

      const updatedClickedComponentState = {
        description,
        moped_proj_components_subcomponents: subcomponentsArray,
        feature_signals: [
          { ...featureSignalRecord, geometry: featureSignalRecord.geography },
        ],
        moped_phase: phase?.data,
        moped_subphase: subphase?.data,
        phase_end: phaseEnd,
      };

      updateSignalComponent({
        variables: {
          projectComponentId: projectComponentId,
          description,
          subcomponents: subcomponentsArray,
          signals: [signalToInsert],
          phaseId: phase?.data.phase_id,
          subphaseId: subphase?.data.subphase_id,
          phaseEnd,
        },
      })
        .then(() => onComponentSaveSuccess(updatedClickedComponentState))
        .catch((error) => {
          console.log(error);
        });
    } else {
      const updatedClickedComponentState = {
        description,
        moped_proj_components_subcomponents: subcomponentsArray,
        moped_phase: phase?.data,
        moped_subphase: subphase?.data,
        phase_end: phaseEnd,
      };

      updateComponentAttributes({
        variables: {
          projectComponentId: projectComponentId,
          description,
          subcomponents: subcomponentsArray,
          phaseId: phase?.data.phase_id,
          subphaseId: subphase?.data.subphase_id,
          phaseEnd,
        },
      })
        .then(() => onComponentSaveSuccess(updatedClickedComponentState))
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const onClose = () => {
    editDispatch({ type: "cancel_attributes_edit" });
  };

  const initialFormValues = {
    component: componentToEdit,
    subcomponents: componentToEdit?.moped_proj_components_subcomponents,
    description: componentToEdit?.description,
    phase: componentToEdit?.moped_phase,
    subphase: componentToEdit?.moped_subphase,
    phaseEnd: componentToEdit?.phase_end,
  };

  return (
    <Dialog open={showDialog} onClose={onClose} fullWidth scroll="body">
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <h3>Edit component</h3>
        <IconButton onClick={onClose}>
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

export default EditComponentModal;
