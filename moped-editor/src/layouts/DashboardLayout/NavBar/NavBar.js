import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Box, Drawer, Hidden, List, makeStyles } from "@material-ui/core";
import { EmojiTransportation } from "@material-ui/icons";
import {
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon,
  LogOut as LogOutIcon,
} from "react-feather";
import NavItem from "./NavItem";

const items = [
  {
    href: "/moped/dashboard",
    icon: BarChartIcon,
    title: "Dashboard",
  },
  {
    href: "/moped/staff",
    icon: UsersIcon,
    title: "Staff",
  },
  {
    href: "/moped/projects",
    icon: EmojiTransportation,
    title: "Projects",
  },
  {
    href: "/moped/account",
    icon: UserIcon,
    title: "Account",
  },
  {
    href: "/moped/settings",
    icon: SettingsIcon,
    title: "Settings",
  },
  {
    href: "/register",
    icon: UserPlusIcon,
    title: "Register",
  },
  {
    href: "/moped/logout",
    icon: LogOutIcon,
    title: "Logout",
  },
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: "calc(100% - 64px)",
  },
  avatar: {
    cursor: "pointer",
    width: 64,
    height: 64,
  },
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <Box p={2}>
        <List>
          {items.map(item => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false,
};

export default NavBar;
