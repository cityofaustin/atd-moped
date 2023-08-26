import ProjectWorkActivitiesForm from "./ProjectWorkActivitiesForm";

// Material
import { IconButton, Dialog, DialogTitle, DialogContent } from "@mui/material";

import { makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const ProjectWorkActivitiesDialog = ({
  onClose,
  activity,
  onSubmitCallback,
}) => {
  const classes = useStyles();
  return (
    <Dialog open onClose={onClose} fullWidth scroll="body">
      <DialogTitle className={classes.DialogTitle}>
        <span>Hello</span>
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
