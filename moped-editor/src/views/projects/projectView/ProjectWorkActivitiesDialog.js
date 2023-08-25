import ProjectWorkActivitiesForm from "./ProjectWorkActivitiesForm";

// Material
import { IconButton, Dialog, DialogTitle, DialogContent } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

const ProjectWorkActivitiesDialog = ({
  onClose,
  activity,
  onSubmitCallback,
}) => {
  return (
    <Dialog open onClose={onClose} fullWidth scroll="body">
      <DialogTitle>
        Hello
        <IconButton onClick={onClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <ProjectWorkActivitiesForm
          activity={activity}
          onSubmitCallback={onSubmitCallback}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectWorkActivitiesDialog;
