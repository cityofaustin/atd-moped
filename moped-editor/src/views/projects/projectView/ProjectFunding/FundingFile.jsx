import React, { useState } from "react";
import {
  Box,
  Fade,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { LinkOff } from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import ProjectFileLink from "src/views/projects/projectView/ProjectFiles/ProjectFileLink";
import DeleteConfirmationModal from "src/views/projects/projectView/DeleteConfirmationModal";
import {
  DETACH_FILE_ECAPRIS_FUNDING_ATTACHMENT,
  DETACH_FILE_MOPED_FUNDING_ATTACHMENT,
} from "src/queries/project";

const FundingFile = ({
  file,
  isSyncedFromECapris,
  refetch,
  fileRecordId,
  handleSnackbar,
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

  const [detachFundingFileAttachment] = useMutation(
    isSyncedFromECapris
      ? DETACH_FILE_ECAPRIS_FUNDING_ATTACHMENT
      : DETACH_FILE_MOPED_FUNDING_ATTACHMENT
  );

  const handleUnlinkFileAttachment = (id) => {
    detachFundingFileAttachment({
      variables: {
        id,
      },
    })
      .then(() => {
        setIsDeleteConfirmationOpen(null);
        handleSnackbar(true, "File attachment detached", "success");
      })
      .catch((error) => {
        setIsDeleteConfirmationOpen(null);
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
        id="funding-file-action-menu"
        anchorEl={anchorElement}
        keepMounted
        open={menuOpen}
        onClose={handleMenuClose}
        autoFocus={false}
        TransitionComponent={Fade}
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
          additionalConfirmationText="This will not delete the file, only detach it from this funding record."
          actionButtonIcon={<LinkOff />}
          submitDelete={() => handleUnlinkFileAttachment(fileRecordId)}
          isDeleteConfirmationOpen={isDeleteConfirmationOpen}
          setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
        />
      )}
    </Box>
  );
};

export default FundingFile;
