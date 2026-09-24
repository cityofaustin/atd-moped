import React, { useState } from "react";
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { LinkOff } from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import ProjectFileLink from "src/views/projects/projectView/ProjectFiles/ProjectFileLink";
import DeleteConfirmationModal from "src/views/projects/projectView/DeleteConfirmationModal";
import MopedDataGridRowLink from "src/components/MopedDataGridRowLink";
import { highlightedRowParam } from "src/views/projects/projectView/ProjectFiles/ProjectFiles";

/**
 *
 * @param {Object} file - File information object to pass into ProjectFileLink
 * @param {Function} refetch - Provides a manual callback to update the Apollo cache
 * @param {number} fileRecordId - files_project_funding id /  ecapris_subproject_funding id  / files_project_work_activities id for record
 * @param {Function} handleSnackbar - The function to handle feedback snackbar messages
 * @param {Function} detachFileMutation - function to detach file from parent record
 * @param {string} confirmationFileType - type of file, either funding or work activity. Used in delete confirmation message
 * @param {number} projectId - project ID used to link to the attached file in the Files table
 * @returns {JSX.Element}
 */
const AttachedFile = ({
  file,
  projectId,
  refetch,
  fileRecordId,
  handleSnackbar,
  detachFileMutation,
  confirmationFileType,
}) => {
  const [anchorElement, setAnchorElement] = useState(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const menuOpen = Boolean(anchorElement);

  const handleMenuOpen = (event) => {
    setAnchorElement(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElement(null);
  };

  const [detachFundingFileAttachment, { loading: mutationPending }] =
    useMutation(detachFileMutation);

  const handleUnlinkFileAttachment = (id) => {
    detachFundingFileAttachment({
      variables: {
        id,
      },
    })
      .then(() => {
        setIsDeleteConfirmationOpen(false);
        handleSnackbar(true, "File attachment detached", "success");
      })
      .catch((error) => {
        setIsDeleteConfirmationOpen(false);
        handleSnackbar(true, "Error detaching file attachment", "error", error);
      })
      .finally(() => {
        refetch();
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <ProjectFileLink
        fileKey={file.file_key}
        fileUrl={file.file_url}
        fileName={file.file_name}
        condensed
        showNetworkPathStyles={false}
      />
      <IconButton onClick={handleMenuOpen}>
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id={`funding-file-action-menu-${fileRecordId}`}
        anchorEl={anchorElement}
        keepMounted
        open={menuOpen}
        onClose={handleMenuClose}
        slotProps={{
          transition: {
            fade: {
              in: true,
            },
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem
          component={MopedDataGridRowLink}
          projectId={Number(projectId)}
          tab="files"
          highlightedRowParam={highlightedRowParam}
          paramId={file.project_file_id}
          onClick={handleMenuClose}
        >
          <ListItemIcon>
            <EditOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
        <MenuItem
          onClick={() => setIsDeleteConfirmationOpen(true)}
          selected={false}
        >
          <ListItemIcon>
            <LinkOff />
          </ListItemIcon>
          <ListItemText primary="Detach" />
        </MenuItem>
      </Menu>
      {isDeleteConfirmationOpen && (
        <DeleteConfirmationModal
          type="file attachment"
          actionButtonText="Detach"
          additionalConfirmationText={`This will not delete the file, only detach it from this ${confirmationFileType} record.`}
          actionButtonIcon={<LinkOff />}
          submitDelete={() => handleUnlinkFileAttachment(fileRecordId)}
          isDeleteConfirmationOpen={isDeleteConfirmationOpen}
          setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
          mutationPending={mutationPending}
        />
      )}
    </Box>
  );
};

export default AttachedFile;
