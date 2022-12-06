import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import TopBar from "./TopBar";
import { useUser } from "../../auth/user";
import Footer from "./Footer";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },
  wrapper: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
    // If in staging environment, add extra padding
    // to make room for staging environment info alert
    paddingTop: process.env.REACT_APP_HASURA_ENV !== "production" ? 114 : 64,
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
}));

const DashboardLayout = () => {
  const classes = useStyles();
  const { user } = useUser();

  console.debug("user", user);

  return user ? (
    <div className={classes.root}>
      <TopBar />
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
