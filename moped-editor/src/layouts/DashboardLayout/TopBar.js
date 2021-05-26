import React from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  AppBar,
  Avatar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { LogOut as LogOutIcon } from "react-feather";
import Logo from "src/components/Logo";
import { getSessionDatabaseData, useUser } from "../../auth/user";
import emailToInitials from "../../utils/emailToInitials";
import CDNAvatar from "../../components/CDN/Avatar";

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    marginRight: 8,
  },
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
  const classes = useStyles();
  const { user, logout } = useUser();

  const userDbData = getSessionDatabaseData();

  return (
    <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to="/moped">
          <Logo />
        </RouterLink>
        <Box flexGrow={1} />
        <Box>
          <div className={classes.root}>
            {userDbData ? (
              <CDNAvatar
                className={classes.avatar}
                src={userDbData.picture}
                initials={userDbData.first_name[0] + userDbData.last_name[0]}
              />
            ) : (
              <Avatar
                className={classes.avatar}
                component={RouterLink}
                src={null}
                to="/moped/account"
                style={{ backgroundColor: user ? user.userColor : null }}
              >
                {emailToInitials(user?.idToken?.payload?.email)}
              </Avatar>
            )}
          </div>
        </Box>
        <IconButton color="inherit" onClick={onMobileNavOpen}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
};

export default TopBar;
