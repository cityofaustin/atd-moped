import { type MouseEvent, useState } from "react";
import { Link as RouterLink, NavLink } from "react-router";
import {
  type AlertColor,
  AppBar,
  Box,
  Toolbar,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import Logo from "src/components/Logo";
import { CanAddProjectButton } from "src/views/projects/projectsListView/ProjectListViewCustomComponents";
import MobileDropdownMenu from "src/layouts/AuthenticatedLayout/NavBar/MobileDropdownMenu";
import DropdownMenu from "src/layouts/AuthenticatedLayout/NavBar/DropdownMenu";
import NavigationSearchInput from "src/layouts/AuthenticatedLayout/NavBar/NavigationSearchInput";
import { navigationItems } from "src/layouts/AuthenticatedLayout/helpers";

const getAlertBannerSeverity = (env: string): AlertColor => {
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
  const env = import.meta.env.VITE_APP_ENV;
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

const TopBar = () => {
  const [dropdownAnchorEl, setDropdownAnchorEl] = useState<HTMLElement | null>(
    null
  );

  const handleDropdownClick = (event: MouseEvent<HTMLElement>) => {
    setDropdownAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setDropdownAnchorEl(null);
  };

  return (
    <AppBar
      sx={{ backgroundColor: "background.paper" }}
      elevation={2}
      position="sticky"
    >
      <EnvAlertBanner />
      <Toolbar sx={{ backgroundColor: "background.paper" }}>
        <RouterLink to="/moped">
          <Logo />
        </RouterLink>
        <Box sx={{ display: { xs: "none", md: "contents" } }}>
          <Box>
            <Tabs
              sx={(theme) => ({
                marginLeft: theme.spacing(1.5),
              })}
              value={false}
            >
              {navigationItems.map((item) => (
                <Tab
                  key={item.href}
                  label={item.title}
                  sx={(theme) => ({
                    textTransform: "capitalize",
                    color: theme.palette.text.secondary,
                    fontSize: "1.2em",
                    minWidth: theme.spacing(9.375), // 75px / 8
                    height: theme.spacing(8), // 64px / 8
                    opacity: 1,
                    // NavLink adds the "active" class when its route matches
                    // see: https://reactrouter.com/api/components/NavLink#active
                    "&.active": {
                      color: theme.palette.primary.main,
                      borderBottom: `${theme.spacing(0.25)} solid ${theme.palette.primary.main}`, // 2px / 8
                      fontWeight: 800,
                    },
                  })}
                  component={NavLink}
                  to={item.href}
                />
              ))}
            </Tabs>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
            }}
          />
          <NavigationSearchInput />
          <Box
            sx={(theme) => ({
              marginRight: theme.spacing(1),
            })}
          >
            <CanAddProjectButton />
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
        >
          <NavigationSearchInput />
          <MobileDropdownMenu />
        </Box>
        <Box sx={{ display: { xs: "none", md: "contents" } }}>
          {/* @ts-expect-error Migrating DropdownMenu to TS captured in #30914 */}
          <DropdownMenu
            handleDropdownClick={handleDropdownClick}
            handleDropdownClose={handleDropdownClose}
            dropdownAnchorEl={dropdownAnchorEl}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default TopBar;
