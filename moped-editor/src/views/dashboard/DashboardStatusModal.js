import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import ProjectNotes from "../projects/projectView/ProjectNotes";

/**
 * Dashboard status modal component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {String} eCaprisSubprojectId - The eCapris subproject ID associated with project (if there is one)
 * @param {Number} projectName - The name of the current project being viewed
 * @param {Number} currentPhaseId - The id of the current phase of the project
 * @param {String} modalParent - The parent of the modal - either "summary" or "dashboard"
 * @param {String} statusUpdate - The current status update for the project
 * @param {Function} queryRefetch - The refetch function to fire on modal close
 * @param {Function} handleSnackbar - The function to handle feedback snackbar messages
 * @param {JSX.Element} children - The content to render inside the modal
 * @param {Object} data - The project data object from the GraphQL query
 * @returns {JSX.Element}
 */
const DashboardStatusModal = ({
  projectId,
  eCaprisSubprojectId,
  projectName,
  currentPhaseId,
  modalParent,
  statusUpdate,
  queryRefetch,
  handleSnackbar,
  children,
  data,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    queryRefetch();
  };

  return (
    <>
      <Typography
        component="span"
        sx={{
          cursor: "pointer",
        }}
        onClick={() => setIsDialogOpen(true)}
      >
        {/* if there is no status update, render the add status icon */}
        {!statusUpdate && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* if the parent is the summary page, also render the status label */}
            {modalParent === "summary" && children}
            <Tooltip placement="bottom-start" title="Create new status update">
              <ControlPointIcon sx={{ fontSize: "1.5rem" }} />
            </Tooltip>
          </Box>
        )}
        {/* if there is a status update, render the content */}
        {!!statusUpdate && children}
      </Typography>
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          variant="h4"
        >
          {`Status update - ${projectName}`}
          <IconButton onClick={() => handleDialogClose()} size="large">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ProjectNotes
            modal
            projectId={projectId}
            eCaprisSubprojectId={eCaprisSubprojectId}
            currentPhaseId={currentPhaseId}
            closeModalDialog={handleDialogClose}
            handleSnackbar={handleSnackbar}
            data={data}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardStatusModal;
