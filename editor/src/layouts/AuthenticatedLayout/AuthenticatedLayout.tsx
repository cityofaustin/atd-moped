import React, { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router";
import Box from "@mui/material/Box";
import TopBar from "src/layouts/DashboardLayout/TopBar";
import { useAuth } from "src/auth/auth";
import Footer from "src/layouts/DashboardLayout/Footer";
import ApolloErrorHandler from "src/components/ApolloErrorHandler";
import AuthLoadingBackdrop from "src/auth/AuthLoadingBackdrop";
import { useApolloErrorContext } from "src/utils/errorHandling";
import { setReturnTo } from "src/auth/returnTo";

/**
 * Dashboard layout component for the app when users are signed in.
 * @returns {JSX.Element}
 */
const DashboardLayout = () => {
  const { status } = useAuth();
  const location = useLocation();
  const { apolloError, setApolloError } = useApolloErrorContext();

  // Clear Apollo error when navigating to a new route so ApolloErrorHandler doesn't block UI
  useEffect(() => {
    setApolloError(null);
  }, [location.pathname, setApolloError]);

  // Remember where users were headed so we can send them back after sign-in.
  // Runs before the sign-in redirect so we capture the route they wanted.
  useEffect(() => {
    if (status === "unauthenticated") {
      setReturnTo(location);
    }
  }, [status, location]);

  if (status === "initializing") {
    return <AuthLoadingBackdrop open={true} />;
  }

  /* If not authenticated, redirect to the sign-in page. The effect above stored
   * the route they wanted in sessionStorage; MainLayout reads it after sign-in.
   */
  if (status === "unauthenticated") {
    return <Navigate to="/moped/session/signin" replace />;
  }

  return (
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
          flex: "1 1 auto", // Take remaining space after sticky AppBar in TopBar
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
  );
};

export default DashboardLayout;
