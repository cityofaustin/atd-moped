import React, { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import TopBar from "src/layouts/DashboardLayout/TopBar";
import { useUser } from "src/auth/user";
import Footer from "src/layouts/DashboardLayout/Footer";
import ApolloErrorHandler from "src/components/ApolloErrorHandler";
import { useApolloErrorContext } from "src/utils/errorHandling";

/**
 * Dashboard layout component for the app when users are signed in.
 * @returns {JSX.Element}
 */
const DashboardLayout = () => {
  const { user } = useUser();
  const location = useLocation();
  const { apolloError, setApolloError } = useApolloErrorContext();

  // Clear Apollo error when navigating to a new route so ApolloErrorHandler doesn't block UI
  useEffect(() => {
    setApolloError(null);
  }, [location.pathname, setApolloError]);

  /* If user is not authenticated, redirect to sign-in page
   * and preserve the current location so they can be redirected back
   * after successful login or if a browser refresh occurs. See MainLayout.js
   * for how this is handled.
   */
  return user ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <Box>
        <TopBar />
      </Box>
      <Box
        sx={{
          flex: "1 1 auto", // Take remaining space after static AppBar in TopBar
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ApolloErrorHandler error={apolloError}>
          <Outlet />
        </ApolloErrorHandler>
        <Footer />
      </Box>
    </Box>
  ) : (
    <Navigate to="/moped/session/signin" state={{ from: location }} replace />
  );
};

export default DashboardLayout;
