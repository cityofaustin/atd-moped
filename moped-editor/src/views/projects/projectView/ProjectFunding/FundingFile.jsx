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
import ProjectFileLink from "src/views/projects/projectView/ProjectFiles/ProjectFileLink";

const FundingFile = ({ file }) => {
  const [anchorElement, setAnchorElement] = useState(null);
  const menuOpen = Boolean(anchorElement);

  const handleMenuOpen = (event) => {
    setAnchorElement(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElement(null);
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
          onClick={() => console.log("unlink this file")}
          selected={false}
        >
          <ListItemIcon>
            <LinkOff />
          </ListItemIcon>
          <ListItemText primary="Detach" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default FundingFile;
