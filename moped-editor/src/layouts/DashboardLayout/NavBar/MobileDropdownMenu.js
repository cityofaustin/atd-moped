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
import { helpItems } from "./SupportMenu";
import { navigationItems } from "../TopBar";
import { CanAddProjectButton } from "../../../views/projects/projectsListView/ProjectListViewCustomComponents";

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
        keepMounted
        open={Boolean(mobileAnchorEl)}
        onClose={handleMobileClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        getContentAnchorEl={null}
        className={classes.mobileMenu}
      >
        {navigationItems.map(item => (
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
            {helpItems.map(item => (
              <MenuItem onClick={handleMobileClose}>
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
        <MenuItem>
          <CanAddProjectButton />
        </MenuItem>
      </Menu>
    </>
  );
};

export default MobileDropdownMenu;
