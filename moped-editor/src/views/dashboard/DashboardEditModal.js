import React, { useState } from "react";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import { makeStyles } from "@material-ui/core/styles";
import ProjectComments from "./../projects/projectView/ProjectComments";
import parse from "html-react-parser";

const useStyles = makeStyles(theme => ({
  dialogTitle: {
    color: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusUpdateText: {
    cursor: "pointer",
  },
  tooltipIcon: {
    fontSize: "20px",
  },
}));

const DashboardEditModal = ({ project, displayText, queryRefetch }) => {
  const classes = useStyles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    queryRefetch();
  };

  return (
    <>
      <Typography
        className={classes.statusUpdateText}
        onClick={() => setIsDialogOpen(true)}
      >
        {displayText.length > 0 ? (
          parse(displayText)
        ) : (
          <Tooltip placement="bottom-start" title="Create new status update">
            <ControlPointIcon className={classes.tooltipIcon} />
          </Tooltip>
        )}
      </Typography>
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth={"md"}
      >
        <DialogTitle disableTypography className={classes.dialogTitle}>
          <h4>{`Status update - ${project.project_name}`}</h4>
          <IconButton onClick={() => handleDialogClose()}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ProjectComments
            modal
            projectId={project.project_id}
            closeModalDialog={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardEditModal;
