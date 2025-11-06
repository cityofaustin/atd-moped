import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import ProjectPhaseForm from "./ProjectPhaseForm";

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
    <Dialog open onClose={onClose} fullWidth scroll="body">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        variant="h4"
      >
        <span>{titleText}</span>
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <ProjectPhaseForm
          phase={phase}
          onSubmitCallback={onSubmitCallback}
          phases={phases}
          noteTypes={noteTypes}
          currentProjectPhaseId={currentProjectPhaseId}
          currentPhaseTypeId={currentPhaseTypeId}
          handleSnackbar={handleSnackbar}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectPhaseDialog;
