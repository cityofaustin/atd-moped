import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import ProjectStatusBadge from "../projects/projectView/ProjectStatusBadge";
import ProjectTimeline from "../projects/projectView/ProjectTimeline";

const useStyles = makeStyles((theme) => ({
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

const DashboardPhaseModal = ({
  status,
  phase,
  project,
  projectStatuses,
  projectId,
  queryRefetch,
}) => {
  const classes = useStyles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    queryRefetch();
  };

  return (
    <>
      <div
        className={classes.statusUpdateText}
        onClick={() => setIsDialogOpen(true)}
      >
        <ProjectStatusBadge
          status={status}
          phase={phase}
          projectStatuses={projectStatuses}
          condensed
        />
      </div>
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth={"xl"}
      >
        <DialogTitle disableTypography className={classes.dialogTitle}>
          <h4>{`Update phase - ${project.project_name}`}</h4>
          <IconButton onClick={() => handleDialogClose()}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ProjectTimeline projectIdFromPhaseModal={projectId} isPhaseModal />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardPhaseModal;
