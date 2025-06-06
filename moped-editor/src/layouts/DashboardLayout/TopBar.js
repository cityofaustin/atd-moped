import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import { AppBar, Box, Hidden, Toolbar, Tabs, Tab } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Alert } from "@mui/material";
import Logo from "src/components/Logo";
import { CanAddProjectButton } from "src/views/projects/projectsListView/ProjectListViewCustomComponents";
import MobileDropdownMenu from "src/layouts/DashboardLayout/NavBar/MobileDropdownMenu";
import DropdownMenu from "src/layouts/DashboardLayout/NavBar/DropdownMenu";
import NavigationSearchInput from "src/layouts/DashboardLayout/NavBar/NavigationSearchInput";
import NavLink from "src/components/NavLink";

const getAlertBannerSeverity = (env) => {
  // show an orange banner on local
  // show blue on staging, netlify, test, ...not production
  switch (env) {
    case "local":
      return "warning";
    default:
      return "info";
  }
};

const EnvAlertBanner = () => {
  const env = process.env.REACT_APP_HASURA_ENV;
  if (env === "production") {
    return null;
  }
  return (
    <Alert severity={getAlertBannerSeverity(env)}>
      This is a <span style={{ fontWeight: "bold" }}>{env}</span> environment
      for testing purposes.
    </Alert>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    marginLeft: "12px",
  },
  tab: {
    textTransform: "capitalize",
    color: theme.palette.text.secondary,
    fontSize: "1.2em",
    minWidth: "75px",
    height: "64px",
    opacity: 1,
  },
  active: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    borderBottomWidth: "2px",
    borderStyle: "solid",
    fontWeight: 800,
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

const TopBar = ({ className, ...rest }) => {
  const classes = useStyles();

  const [dropdownAnchorEl, setDropdownAnchorEl] = useState(null);

  const handleDropdownClick = (event) => {
    setDropdownAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setDropdownAnchorEl(null);
  };

  return (
    <AppBar className={clsx(classes.root, className)} elevation={2} {...rest}>
      <EnvAlertBanner />
      <Toolbar className={classes.root}>
        <RouterLink to="/moped">
          <Logo />
        </RouterLink>
        <Hidden mdDown>
          <Box>
            <Tabs className={classes.tabs} value={false}>
              {navigationItems.map((item) => (
                <Tab
                  key={item.href}
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
          <NavigationSearchInput />
          <Box className={classes.newProject}>
            <CanAddProjectButton />
          </Box>
        </Hidden>
        <Hidden mdUp>
          <Box flexGrow={1} />
          <NavigationSearchInput />
        </Hidden>
        <Hidden mdDown>
          <Box>
            <DropdownMenu
              handleDropdownClick={handleDropdownClick}
              handleDropdownClose={handleDropdownClose}
              dropdownAnchorEl={dropdownAnchorEl}
            />
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
