import React, { useState } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import ProjectNotes from "../projects/projectView/ProjectNotes";
import FormDialog from "src/components/FormDialog";
import { fieldLabelText } from "src/styles/reusableStyles";
import parse from "html-react-parser";

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
 * @param {Object} data - The project data object from the GraphQL query
 * @param {String} statusUpdateAuthor - Author of status update being rendered
 * @param {String} statusUpdateDateCreated - Formatted date of status update
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
  data,
  statusUpdateAuthor,
  statusUpdateDateCreated,
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
        // if the parent is the summary page, use the fieldLabelText style,
        // otherwise set the cursor to pointer (applies to dashboard)
        sx={modalParent === "summary" ? fieldLabelText : { cursor: "pointer" }}
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Tooltip
                placement="bottom-start"
                title="Create new status update"
              >
                <ControlPointIcon
                  sx={(theme) => ({
                    fontSize: theme.spacing(2.5),
                  })}
                />
              </Tooltip>
            </Box>
          </Box>
        )}
        {/* if there is a status update, render the content */}
        {!!statusUpdate && (
          <Box>
            <Box>{parse(String(statusUpdate))}</Box>
            <Box
              sx={(theme) => ({
                width: "100%",
                color: theme.palette.text.secondary,
                fontSize: ".7rem",
              })}
            >
              {statusUpdateAuthor} - {statusUpdateDateCreated}
            </Box>
          </Box>
        )}
      </Typography>
      <FormDialog
        title={`Status update - ${projectName}`}
        dialogOpen={isDialogOpen}
        handleClose={handleDialogClose}
        showDialogActions={false}
      >
        <ProjectNotes
          modal
          projectId={projectId}
          eCaprisSubprojectId={eCaprisSubprojectId}
          currentPhaseId={currentPhaseId}
          closeModalDialog={handleDialogClose}
          handleSnackbar={handleSnackbar}
          data={data}
        />
      </FormDialog>
    </>
  );
};

export default DashboardStatusModal;
