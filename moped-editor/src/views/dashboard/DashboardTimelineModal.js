import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
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
}));

const DashboardTimelineModal = ({
  table,
  projectId,
  status,
  phase,
  project,
  projectStatuses,
  completedMilestonesPercentage,
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
      <div className={classes.statusUpdateText} onClick={() => setIsDialogOpen(true)}>
        {table === "phases" && (
          <ProjectStatusBadge
            status={status}
            phase={phase}
            projectStatuses={projectStatuses}
            condensed
          />
        )}
        {table === "milestones" && (
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
              variant="determinate"
              value={completedMilestonesPercentage}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption" component="div">
                {`${Math.round(completedMilestonesPercentage)}%`}
              </Typography>
            </Box>
          </Box>
        )}
      </div>
      <Dialog
        open={!!table && isDialogOpen}
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
