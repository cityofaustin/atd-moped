import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { AppBar, Box, Hidden, Toolbar, Tabs, Tab, Alert } from "@mui/material";
import Logo from "src/components/Logo";
import { CanAddProjectButton } from "src/views/projects/projectsListView/ProjectListViewCustomComponents";
import MobileDropdownMenu from "src/layouts/DashboardLayout/NavBar/MobileDropdownMenu";
import DropdownMenu from "src/layouts/DashboardLayout/NavBar/DropdownMenu";
import NavigationSearchInput from "src/layouts/DashboardLayout/NavBar/NavigationSearchInput";
import { NavLink } from "react-router-dom";

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
  const [dropdownAnchorEl, setDropdownAnchorEl] = useState(null);

  const handleDropdownClick = (event) => {
    setDropdownAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setDropdownAnchorEl(null);
  };

  return (
    <AppBar
      sx={{ backgroundColor: "background.paper" }}
      elevation={2}
      {...rest}
    >
      <EnvAlertBanner />
      <Toolbar sx={{ backgroundColor: "background.paper" }}>
        <RouterLink to="/moped">
          <Logo />
        </RouterLink>
        <Hidden mdDown>
          <Box>
            <Tabs sx={{ marginLeft: "12px" }} value={false}>
              {navigationItems.map((item) => (
                <Tab
                  key={item.href}
                  label={item.title}
                  sx={{
                    textTransform: "capitalize",
                    color: (theme) => theme.palette.text.secondary,
                    fontSize: "1.2em",
                    minWidth: "75px",
                    height: "64px",
                    opacity: 1,
                  }}
                  component={NavLink}
                  to={item.href}
                  style={({ isActive }) =>
                    // react-router-dom is removing support for "activeClassName" in favor of this isActive prop
                    // see: https://reactrouter.com/docs/en/v6/upgrading/v5#remove-activeclassname-and-activestyle-props-from-navlink-
                    isActive
                      ? {
                          color: (theme) => theme.palette.primary.main,
                          borderColor: (theme) => theme.palette.primary.main,
                          borderBottomWidth: "2px",
                          borderStyle: "solid",
                          fontWeight: 800,
                        }
                      : {}
                  }
                />
              ))}
            </Tabs>
          </Box>
          <Box flexGrow={1} />
          <NavigationSearchInput />
          <Box sx={{ marginRight: (theme) => theme.spacing(1) }}>
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

export default TopBar;
