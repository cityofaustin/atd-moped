import ProjectPhaseForm from "./ProjectPhaseForm";
import FormDialog from "src/components/FormDialog";

const dialogTitle = (phase) => {
  if (phase.project_phase_id) {
    if (phase.is_current_phase) {
      return "Edit current phase";
    }
    return "Edit phase";
  }
  return "Add phase";
};

const ProjectPhaseDialog = ({
  onClose,
  phase,
  phases,
  noteTypes,
  currentProjectPhaseId,
  currentPhaseTypeId,
  onSubmitCallback,
  handleSnackbar,
}) => {
  const titleText = dialogTitle(phase);
  return (
    <FormDialog
      title={titleText}
      handleClose={onClose}
      dialogOpen={true}
      showDialogActions={false}
    >
      <ProjectPhaseForm
        phase={phase}
        onSubmitCallback={onSubmitCallback}
        phases={phases}
        noteTypes={noteTypes}
        currentProjectPhaseId={currentProjectPhaseId}
        currentPhaseTypeId={currentPhaseTypeId}
        handleSnackbar={handleSnackbar}
      />
    </FormDialog>
  );
};

export default ProjectPhaseDialog;
