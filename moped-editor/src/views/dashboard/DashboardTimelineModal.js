import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import ProjectTimeline from "../projects/projectView/ProjectTimeline";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    color: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clickableDiv: {
    cursor: "pointer",
  },
}));

const DashboardTimelineModal = ({
  table,
  projectId,
  projectName,
  queryRefetch,
  contents,
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
        className={classes.clickableDiv}
        onClick={() => setIsDialogOpen(true)}
      >
        {contents}
      </div>
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth={"xl"}
      >
        <DialogTitle disableTypography className={classes.dialogTitle}>
          <h4>{`Update phase - ${projectName}`}</h4>
          <IconButton onClick={() => handleDialogClose()}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ProjectTimeline
            table={table}
            projectIdFromTimelineModal={projectId}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardTimelineModal;
