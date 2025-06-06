import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import ProjectWorkActivitiesForm from "./ProjectWorkActivityForm";

const ProjectWorkActivitiesDialog = ({
  onClose,
  activity,
  onSubmitCallback,
  handleSnackbar
}) => {
  const titleText = activity.id ? "Edit work activity" : "Add work activity";
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
        <ProjectWorkActivitiesForm
          activity={activity}
          onSubmitCallback={onSubmitCallback}
          handleSnackbar={handleSnackbar}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectWorkActivitiesDialog;
