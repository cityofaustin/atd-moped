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
import ProjectComments from "../projects/projectView/ProjectComments";

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

const DashboardStatusModal = ({
  projectId,
  projectName,
  modalParent,
  statusUpdate,
  queryRefetch,
  children,
}) => {
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
        {/* if there is no status update, render the add status icon */}
        {!statusUpdate && (
          <div>
            {/* if the parent is the summary page, also render the status label */}
            {modalParent === "summary" && children}
            <Tooltip placement="bottom-start" title="Create new status update">
              <ControlPointIcon className={classes.tooltipIcon} />
            </Tooltip>
          </div>
        )}
        {/* if there is a status update, render the content */}
        {!!statusUpdate && children}
      </Typography>
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth={"md"}
      >
        <DialogTitle disableTypography className={classes.dialogTitle}>
          <h4>{`Status update - ${projectName}`}</h4>
          <IconButton onClick={() => handleDialogClose()}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ProjectComments
            modal
            projectId={projectId}
            closeModalDialog={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardStatusModal;