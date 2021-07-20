import React, { useState } from "react";
import { Link as RouterLink, NavLink, useNavigate } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Hidden,
  Icon,
  IconButton,
  Toolbar,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import Can from "../../auth/Can";
import Logo from "src/components/Logo";
import { getSessionDatabaseData, useUser } from "../../auth/user";
import emailToInitials from "../../utils/emailToInitials";
import CDNAvatar from "../../components/CDN/Avatar";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    textTransform: "capitalize",
    color: theme.palette.text.header,
    fontSize: "1.2em",
    minWidth: "100px",
    fontWeight: 800,
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

const TopBar = ({ className, onOpen, ...rest }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { user } = useUser();

  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
  const [subMenu, showSubMenu] = useState(false);

  const handleAvatarClick = event => {
    setAvatarAnchorEl(event.currentTarget);
  };

  const handleAvatarClose = () => {
    setAvatarAnchorEl(null);
  };

  const handleMobileClick = event => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMobileClose = () => {
    setMobileAnchorEl(null);
  };

  const setShowSubMenu = () => showSubMenu(subMenu => !subMenu);

  const userDbData = getSessionDatabaseData();

  return (
    <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to="/moped">
          <Logo />
        </RouterLink>
        <Hidden smDown>
          <Box>
            <Tabs>
              {items.map(item => (
                <Tab
                  label={item.title}
                  className={classes.tabs}
                  component={NavLink}
                  activeClassName={classes.active}
                  to={item.href}
                />
              ))}
            </Tabs>
          </Box>
          <Box flexGrow={1} />
          <Box>
            <Can
              perform="newProjects:visit"
              yes={
                <Button
                  color="primary"
                  variant="contained"
                  component={RouterLink}
                  to={"/moped/projects/new"}
                  startIcon={<Icon>add_circle</Icon>}
                  className={classes.newProject}
                >
                  {"New project"}
                </Button>
              }
            />
          </Box>
          <Box>
            <Button
              className={classes.avatarButton}
              onClick={handleAvatarClick}
            >
              {userDbData ? (
                <CDNAvatar
                  className={classes.avatar}
                  src={userDbData.picture}
                  initials={userDbData.first_name[0] + userDbData.last_name[0]}
                />
              ) : (
                <Avatar
                  className={classes.avatar}
                  style={{ backgroundColor: user ? user.userColor : null }}
                >
                  {emailToInitials(user?.idToken?.payload?.email)}
                </Avatar>
              )}
            </Button>
            <Menu
              id="avatarDropdown"
              anchorEl={avatarAnchorEl}
              keepMounted
              open={Boolean(avatarAnchorEl)}
              onClose={handleAvatarClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
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
          <Box>
            <IconButton
              onClick={() => console.log("This is in an upcoming issue")}
              size="medium"
            >
              <HelpOutlineIcon />
            </IconButton>
          </Box>
        </Hidden>
        <Hidden smUp>
          <Box flexGrow={1} />
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
              <Can
                perform="newProjects:visit"
                yes={
                  <Button
                    color="primary"
                    variant="contained"
                    component={RouterLink}
                    to={"/moped/projects/new"}
                    startIcon={<Icon>add_circle</Icon>}
                    className={classes.newProject}
                  >
                    {"New project"}
                  </Button>
                }
              />
            </MenuItem>
          </Menu>
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
