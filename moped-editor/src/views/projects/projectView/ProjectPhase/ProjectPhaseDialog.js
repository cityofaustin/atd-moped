import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import ProjectPhaseForm from "./ProjectPhaseForm";

const ProjectPhaseDialog = ({
  onClose,
  phase,
  phases,
  currentProjectPhaseIds,
  currentPhaseIds,
  onSubmitCallback,
  handleSnackbar
}) => {
  const titleText = phase.project_phase_id ? "Edit phase" : "Add phase";
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
          currentProjectPhaseIds={currentProjectPhaseIds}
          currentPhaseIds={currentPhaseIds}
          handleSnackbar={handleSnackbar}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectPhaseDialog;
