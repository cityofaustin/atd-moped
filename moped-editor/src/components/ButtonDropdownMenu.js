import React, { useState } from "react";
import { Button, ListItemIcon, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AddCircle from "@mui/icons-material/AddCircle";

/**
 * ButtonDropdownMenu - Button that opens to show two different options
 *
 * @return {JSX.Element}
 * @constructor
 */
const ButtonDropdownMenu = ({
  buttonWrapperStyle,
  addAction,
  openActionDialog,
  parentButtonText,
  firstOptionText,
  secondOptionText,
  secondOptionIcon,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleDropdown = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const addRowToTable = () => {
    addAction();
    setAnchorEl(null);
  };

  const handleActionDialog = () => {
    openActionDialog(true);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={toggleDropdown}
        startIcon={
          Boolean(anchorEl) ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
        }
        className={buttonWrapperStyle}
      >
        {parentButtonText}
      </Button>
      <Menu
        sx={{
          color: "background.paper",
          "& .MuiMenu-paper": {
            backgroundColor: "primary.main",
            color: "background.paper",
          },
          "& .MuiList-root": {
            padding: 0,
          },
          "& .MuiMenuItem-root": {
            textTransform: "uppercase",
            fontSize: "14px",
            fontWeight: 500,
            paddingTop: "8px",
            paddingBottom: "8px",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
            "&:first-of-type": {
              borderBottom: "1px solid",
              borderBottomColor: "primary.dark",
            },
          },
          "& .MuiListItemIcon-root": {
            color: "background.paper",
            minWidth: "28px",
          },
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        elevation={0}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={addRowToTable}>
          <ListItemIcon>
            <AddCircle fontSize="small" />
          </ListItemIcon>
          {firstOptionText}
        </MenuItem>
        <MenuItem onClick={handleActionDialog}>
          <ListItemIcon>
            {secondOptionIcon ? (
              <PlaylistAddIcon fontSize="small" />
            ) : (
              <AddCircle fontSize="small" />
            )}
          </ListItemIcon>
          {secondOptionText}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ButtonDropdownMenu;
