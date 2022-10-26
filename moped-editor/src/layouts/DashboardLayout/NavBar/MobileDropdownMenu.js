import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Link,
  Menu,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { helpItems } from "./DropdownMenu";
import { navigationItems } from "../TopBar";
import { CanAddProjectButton } from "../../../views/projects/projectsListView/ProjectListViewCustomComponents";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  subMenu: {
    marginLeft: "1em",
  },
  newProject: {
    marginRight: 8,
  },
}));

/**
 * Renders dropdown menu visible on small screens
 * See https://material-ui.com/components/menus/ and https://material-ui.com/api/popover/
 * @return {JSX.Element}
 * @constructor
 */
const MobileDropdownMenu = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  // anchor element for menu to "attach" to
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
  // Boolean if Support Help menu should be visible or not
  const [subMenu, showSubMenu] = useState(false);

  const handleMobileClick = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMobileClose = () => {
    setMobileAnchorEl(null);
    showSubMenu(false);
  };

  const setShowSubMenu = () => showSubMenu((subMenu) => !subMenu);

  return (
    <>
      <IconButton onClick={handleMobileClick}>
        <MenuIcon />
      </IconButton>
      <Menu
        id="mobileDropdown"
        anchorEl={mobileAnchorEl}
        keepMounted
        open={Boolean(mobileAnchorEl)}
        onClose={handleMobileClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        // getContentAnchorEl needs to be null for the positioning to work
        getContentAnchorEl={null}
      >
        {navigationItems.map((item) => (
          <MenuItem
            key={item.href}
            onClick={() => {
              handleMobileClose();
              navigate(item.href);
            }}
          >
            {item.title}
          </MenuItem>
        ))}
        <MenuItem key="help" onClick={setShowSubMenu}>
          Help
          {subMenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </MenuItem>
        {subMenu && (
          <div className={classes.subMenu}>
            {helpItems.map((item) => (
              <MenuItem key={item.href} onClick={handleMobileClose}>
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="inherit"
                  underline="none"
                >
                  {item.title}
                </Link>
              </MenuItem>
            ))}
          </div>
        )}
        <MenuItem
          onClick={() => {
            handleMobileClose();
            navigate("/moped/account");
          }}
        >
          Account
        </MenuItem>
        <MenuItem onClick={() => navigate("/moped/logout")}>Logout</MenuItem>
        <MenuItem>
          <CanAddProjectButton />
        </MenuItem>
      </Menu>
    </>
  );
};

export default MobileDropdownMenu;
