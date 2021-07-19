import React from "react";
import { Link as RouterLink, NavLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Icon,
  IconButton,
  Toolbar,
  Tabs,
  Tab,
  makeStyles,
} from "@material-ui/core";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Logo from "src/components/Logo";
import { getSessionDatabaseData, useUser } from "../../auth/user";
import emailToInitials from "../../utils/emailToInitials";
import CDNAvatar from "../../components/CDN/Avatar";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "#fff", //theme.color.common.white,
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
    marginRight: 8,
  },
  active: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    borderBottomWidth: "2px",
    borderStyle: "solid",
  },
  newProject: {
    marginRight: 8,
  }
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
  const { user } = useUser();

  const userDbData = getSessionDatabaseData();
  console.log(userDbData);

  return (
    <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to="/moped">
          <Logo />
        </RouterLink>
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
          <Button
            color="primary"
            variant="contained"
            component={RouterLink}
            to={'/moped/projects/new'}
            startIcon={<Icon>add_circle</Icon>}
            className={classes.newProject}
          >
            {"New project"}
          </Button>
        </Box>
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
        <IconButton onClick={onOpen} medium>
          <HelpOutlineIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onNavOpen: PropTypes.func,
};

export default TopBar;
