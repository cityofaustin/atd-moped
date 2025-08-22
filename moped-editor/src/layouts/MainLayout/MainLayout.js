import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import { useUser } from "../../auth/user";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    display: "flex",
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },
  wrapper: {
    display: "flex",
    flex: "1 1 auto",
    overflow: "hidden",
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

const MainLayout = () => {
  const classes = useStyles();
  const location = useLocation();
  const { user } = useUser();

  /* If user is authenticated, redirect to the intended route
   * after login or if a browser refresh occurs.
   * If no intended route is preserved, redirect to the default route.
   * See DashboardLayout.js for how the React Router state is passed.
   */
  if (user) {
    // Get the intended route from location state
    const from = location.state?.from;

    if (from) {
      // Reconstruct the full URL with pathname, search, and hash
      const redirectTo =
        from.pathname + (from.search || "") + (from.hash || "");
      return <Navigate to={redirectTo} replace />;
    }
    // Default redirect if no preserved route
    return <Navigate to="/moped" replace />;
  }

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
