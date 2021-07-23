import React, { useState } from "react";
import { Link as RouterLink, NavLink, useNavigate } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  AppBar,
  Box,
  Button,
  Hidden,
  Toolbar,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import Logo from "src/components/Logo";
import { CanAddProjectButton } from "../../views/projects/projectsListView/ProjectListViewCustomComponents";
import MobileDropdownMenu from "./NavBar/MobileDropdownMenu";
import SupportMenu from "./NavBar/SupportMenu";
import { getSessionDatabaseData, useUser } from "../../auth/user";
import emailToInitials from "../../utils/emailToInitials";
import CDNAvatar from "../../components/CDN/Avatar";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    marginLeft: "12px",
  },
  tab: {
    textTransform: "capitalize",
    color: theme.palette.text.header,
    fontSize: "1.2em",
    minWidth: "75px",
    height: "64px",
    opacity: 1,
  },
  avatar: {
    margin: 0,
  },
  avatarButton: {
    borderRadius: "50%",
    height: "64px",
  },
  active: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    borderBottomWidth: "2px",
    borderStyle: "solid",
    fontWeight: 800,
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

export const navigationItems = [
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

const TopBar = ({ className, onOpen, ...rest }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user } = useUser();

  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);

  const handleAvatarClick = event => {
    setAvatarAnchorEl(event.currentTarget);
  };

  const handleAvatarClose = () => {
    setAvatarAnchorEl(null);
  };

  const userDbData = getSessionDatabaseData();
  const userInitials = userDbData
    ? userDbData.first_name[0] + userDbData.last_name[0]
    : emailToInitials(user?.idToken?.payload?.email);

  return (
    <AppBar className={clsx(classes.root, className)} elevation={1} {...rest}>
      <Toolbar>
        <RouterLink to="/moped">
          <Logo />
        </RouterLink>
        <Hidden mdDown>
          <Box>
            <Tabs className={classes.tabs}>
              {navigationItems.map(item => (
                <Tab
                  label={item.title}
                  className={classes.tab}
                  component={NavLink}
                  activeClassName={classes.active}
                  to={item.href}
                />
              ))}
            </Tabs>
          </Box>
          <Box flexGrow={1} />
          <Box className={classes.newProject}>
            <CanAddProjectButton />
          </Box>
        </Hidden>
        <Hidden mdUp>
          <Box flexGrow={1} />
        </Hidden>
        <Box>
          <Button className={classes.avatarButton} onClick={handleAvatarClick}>
            <CDNAvatar
              className={classes.avatar}
              src={userDbData.picture}
              initials={userInitials}
            />
          </Button>
          <Menu
            id="avatarDropdown"
            anchorEl={avatarAnchorEl}
            keepMounted
            open={Boolean(avatarAnchorEl)}
            onClose={handleAvatarClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: 'top', horizontal: 'right'}}
            getContentAnchorEl={null}
          >
            <MenuItem
              onClick={() => {
                handleAvatarClose();
                navigate("/moped/account");
              }}
            >
              Account
            </MenuItem>
            <MenuItem onClick={() => navigate("/moped/logout")}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
        <Hidden mdDown>
          <Box>
            <SupportMenu />
          </Box>
        </Hidden>
        <Hidden mdUp>
          <MobileDropdownMenu />
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onNavOpen: PropTypes.func,
};

export default TopBar;
