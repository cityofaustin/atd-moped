import React, { useState } from "react";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import clsx from "clsx";
import CloseIcon from "@mui/icons-material/Close";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import ProjectNotes from "../projects/projectView/ProjectNotes";

const DashboardStatusModal = ({
  projectId,
  projectName,
  currentPhaseId,
  modalParent,
  statusUpdate,
  queryRefetch,
  children,
  classes,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    queryRefetch();
  };

  return (
    <>
      <Typography
        component={"span"}
        className={clsx({
          [classes.fieldLabelText]: modalParent === "summary",
          [classes.statusUpdateText]: modalParent !== "summary",
        })}
        onClick={() => setIsDialogOpen(true)}
      >
        {/* if there is no status update, render the add status icon */}
        {!statusUpdate && (
          <div className={classes.newStatusIconDiv}>
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
        <DialogTitle className={classes.dialogTitle}>
          <h3>{`Status update - ${projectName}`}</h3>
          <IconButton onClick={() => handleDialogClose()} size="large">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ProjectNotes
            modal
            projectId={projectId}
            currentPhaseId={currentPhaseId}
            closeModalDialog={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardStatusModal;
