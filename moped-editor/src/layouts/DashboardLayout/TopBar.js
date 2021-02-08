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
import { useUser } from "../../auth/user";

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    marginRight: 8,
    backgroundColor: "#e53935",
  },
}));

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
  const classes = useStyles();
  const { user, logout } = useUser();

  const emailToInitials = email => {
    try {
      const subdomain = "austintexas.gov";
      if(!email.endsWith(subdomain)) return null;
      const [first, last] = email.replace("azure_ad", "").replace(subdomain, "").split(".")
      return first.charAt(0) + last.charAt(0);
    } catch {
      return null;
    }
  }

  return (
    <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to="/moped">
          <Logo />
        </RouterLink>
        <Box flexGrow={1} />
        <Box>
          <div className={classes.root}>
            <Avatar
              className={classes.avatar}
              component={RouterLink}
              src={null}
              to="/moped/account"
            >
              {emailToInitials(user.attributes.email)}
            </Avatar>
          </div>
        </Box>
        <Hidden mdDown>
          <IconButton color="inherit" onClick={logout}>
            <LogOutIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
};

export default TopBar;
