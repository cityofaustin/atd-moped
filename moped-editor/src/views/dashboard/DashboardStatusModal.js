import React, { useState } from "react";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import clsx from "clsx";
import CloseIcon from "@material-ui/icons/Close";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import ProjectComments from "../projects/projectView/ProjectComments";

const DashboardStatusModal = ({
  projectId,
  projectName,
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
        <DialogTitle disableTypography className={classes.dialogTitle}>
          <h3>{`Status update - ${projectName}`}</h3>
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
