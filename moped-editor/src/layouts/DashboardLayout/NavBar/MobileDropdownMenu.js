import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconButton, Link, Menu, MenuItem } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { helpItems, arcGISLink } from "./DropdownMenu";
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
      <IconButton onClick={handleMobileClick} size="large">
        <MenuIcon />
      </IconButton>
      <Menu
        id="mobileDropdown"
        anchorEl={mobileAnchorEl}
        keepMounted
        open={Boolean(mobileAnchorEl)}
        onClose={handleMobileClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
        {/* ArcGIS Map link */}
        <MenuItem
          key={arcGISLink.link}
          onClick={() => {
            handleMobileClose();
            navigate(arcGISLink.link);
          }}
        >
          {arcGISLink.title}
        </MenuItem>
        <MenuItem key="help" onClick={setShowSubMenu}>
          Help
          {subMenu ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </MenuItem>
        {subMenu && (
          <div className={classes.subMenu}>
            {helpItems.map((item) => {
              if (item.linkType === "external") {
                return (
                  <MenuItem key={item.link} onClick={handleMobileClose}>
                    <Link
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="inherit"
                      underline="none"
                    >
                      {item.title}
                    </Link>
                  </MenuItem>
                );
              }
              if (item.linkType === "internal") {
                return (
                  <MenuItem
                    key={item.link}
                    onClick={() => {
                      handleMobileClose();
                      navigate(item.link);
                    }}
                  >
                    {item.title}
                  </MenuItem>
                );
              }
              return null;
            })}
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
