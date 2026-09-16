import React from "react";
import { Outlet, Navigate, useLocation } from "react-router";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "src/auth/auth";
import Box from "@mui/material/Box";

/**
 * Main layout component for the app when not logged in (sign in page).
 * @returns {JSX.Element}
 */
const MainLayout = () => {
  const location = useLocation();
  const { status } = useAuth();

  if (status === "initializing") {
    return (
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  /* If user is authenticated, redirect to the intended route
   * after login or if a browser refresh occurs.
   * If no intended route is preserved, redirect to the default route.
   * See DashboardLayout.js for how the React Router state is passed.
   */
  if (status === "authenticated") {
    // Get the intended route from location state
    const from = location.state?.from;

    if (from) {
      // Reconstruct the full URL with pathname, search, and hash
      const redirectTo =
        from.pathname + (from.search || "") + (from.hash || "");
      if (redirectTo === "/moped/logout") {
        return <Navigate to="/moped" replace />;
      }
      return <Navigate to={redirectTo} replace />;
    }
    // Default redirect if no preserved route
    return <Navigate to="/moped" replace />;
  }

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        display: "flex",
        height: "100%",
        overflow: "hidden",
        width: "100%",
      })}
    >
      <Box
        sx={{
          flex: "1 1 auto",
          height: "100%",
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
