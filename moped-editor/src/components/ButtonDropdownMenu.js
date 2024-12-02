import React, { useState } from "react";
import { Button, ListItemIcon, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import AddCircle from "@mui/icons-material/AddCircle";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  dropDownMenu: {
    color: theme.palette.background.paper,
    "& .MuiMenu-paper": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.background.paper,
    },
    "& .MuiList-root": {
      padding: "0px",
    },
    "& .MuiMenuItem-root": {
      textTransform: "uppercase",
      fontSize: "14px",
      fontWeight: 500,
      paddingTop: "8px",
      paddingBottom: "8px",
    },
    "& .MuiMenuItem-root:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    "& .MuiMenuItem-root:first-of-type": {
      borderBottom: `1px solid ${theme.palette.primary.dark}`,
    },
    "& .MuiListItemIcon-root": {
      color: theme.palette.background.paper,
      minWidth: "28px",
    },
  },
}));

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
  const classes = useStyles();
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
    openActionDialog(true)
    setAnchorEl(null)
  }

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
        className={classes.dropDownMenu}
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
