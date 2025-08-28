import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import { useUser } from "../../auth/user";
import Footer from "./Footer";
import Box from "@mui/material/Box";

/**
 * Dashboard layout component for the app when users are signed in.
 * @returns {JSX.Element}
 */
const DashboardLayout = () => {
  const { user } = useUser();
  const location = useLocation();

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
        <Outlet />
        <Footer />
      </Box>
    </Box>
  ) : (
    <Navigate to="/moped/session/signin" state={{ from: location }} replace />
  );
};

export default DashboardLayout;
