import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {},
  dropDownMenu: {
    color: "#fff",
    "& .MuiMenu-paper": {
      backgroundColor: theme.palette.primary.main,
      color: "#fff",
    },
    "& .MuiListItem-root": {
      textTransform: "uppercase",
      fontSize: "14px",
      fontWeight: 500,
    },
  },
}));

const ButtonDropdownMenu = ({ buttonWrapperStyle, addAction, openFundingDialog }) => {
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
        Add Funding Source
      </Button>
      <Menu
        className={classes.dropDownMenu}
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        elevation={0}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem onClick={addRowToTable}>Generic funding source</MenuItem>
        <MenuItem onClick={() => openFundingDialog(true)}>
          From eCapris
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ButtonDropdownMenu;
