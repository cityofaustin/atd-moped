import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import TopBar from "./TopBar";
import { useUser } from "../../auth/user";
import Footer from "./Footer";
import ApolloErrorHandler from "src/components/ApolloErrorHandler";
import { useApolloErrorContext } from "src/utils/errorHandling";

const useStyles = makeStyles((theme) => ({
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
  const location = useLocation();
  const { apolloError } = useApolloErrorContext();

  /* If user is not authenticated, redirect to sign-in page
   * and preserve the current location so they can be redirected back
   * after successful login or if a browser refresh occurs. See MainLayout.js
   * for how this is handled.
   */
  return user ? (
    <div className={classes.root}>
      <TopBar />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <ApolloErrorHandler error={apolloError}>
              <Outlet />
            </ApolloErrorHandler>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/moped/session/signin" state={{ from: location }} replace />
  );
};

export default DashboardLayout;
