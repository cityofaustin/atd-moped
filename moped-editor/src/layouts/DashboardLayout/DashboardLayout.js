import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { makeStyles, Typography } from "@material-ui/core";
import NavBar from "./NavBar/NavBar";
import TopBar from "./TopBar";
import { useUser } from "../../auth/user";
import ExternalLink from "../../components/ExternalLink";
var pckg = require("../../../package.json");

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: "flex",
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },
  wrapper: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    paddingTop: 64,
  },
  contentContainer: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
  },
  content: {
    flex: "1 1 auto",
    height: "100%",
    overflow: "auto",
  },
  footer: {
    paddingLeft: theme.spacing(4),
    paddingBottom: theme.spacing(2),
    color: "#1492ff",
  },
}));

const Footer = () => {
  const classes = useStyles();
  console.log(pckg);
  return (
    <div className={classes.footer}>
      <Typography variant="caption" color="textSecondary">
        Moped{" "}
        <ExternalLink
          text={`v${pckg.version}`}
          url={`https://github.com/cityofaustin/atd-moped/releases/tag/v${pckg.version}`}
          linkColor="inherit"
        />
      </Typography>
    </div>
  );
};

const DashboardLayout = () => {
  const classes = useStyles();
  const [isOpen, setOpen] = useState(false);
  const { user } = useUser();

  console.log("user", user);

  return user ? (
    <div className={classes.root}>
      <TopBar onOpen={() => setOpen(true)} />
      <NavBar onClose={() => setOpen(false)} isOpen={isOpen} />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Outlet />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/moped/session/signin" />
  );
};

export default DashboardLayout;
