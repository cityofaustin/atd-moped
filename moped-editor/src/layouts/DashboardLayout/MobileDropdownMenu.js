import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { CanAddProjectButton } from "../../views/projects/projectsListView/ProjectListViewCustomComponents";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  mobileMenu: {
    width: 300,
  },
  subMenu: {
    marginLeft: "1em",
  },
  newProject: {
    marginRight: 8,
  },
}));

const items = [
  {
    href: "/moped/dashboard",
    title: "Dashboard",
  },
  {
    href: "/moped/projects",
    title: "Projects",
  },
  {
    href: "/moped/staff",
    title: "Staff",
  },
];

const MobileDropdownMenu = ({ className, onOpen, ...rest }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
  const [subMenu, showSubMenu] = useState(false);

  const handleMobileClick = event => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMobileClose = () => {
    setMobileAnchorEl(null);
    showSubMenu(false);
  };

  const setShowSubMenu = () => showSubMenu(subMenu => !subMenu);

  return (
    <>
      <IconButton onClick={handleMobileClick}>
        <MenuIcon />
      </IconButton>
      <Menu
        id="mobileDropdown"
        anchorEl={mobileAnchorEl}
        // keepMounted
        open={Boolean(mobileAnchorEl)}
        onClose={handleMobileClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        getContentAnchorEl={null}
        className={classes.mobileMenu}
      >
        {items.map(item => (
          <MenuItem
            onClick={() => {
              handleMobileClose();
              navigate(item.href);
            }}
          >
            {item.title}
          </MenuItem>
        ))}
        <MenuItem onClick={setShowSubMenu}>Help</MenuItem>
        {subMenu && (
          <div className={classes.subMenu}>
            <MenuItem
              onClick={() => {
                handleMobileClose();
              }}
            >
              Report a Bug
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMobileClose();
              }}
            >
              Request an Enhancement
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMobileClose();
              }}
            >
              Ask a Question
            </MenuItem>
          </div>
        )}
        <MenuItem>
          <CanAddProjectButton />
        </MenuItem>
      </Menu>
    </>
  );
};

export default MobileDropdownMenu;
