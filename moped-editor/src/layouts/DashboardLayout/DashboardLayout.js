import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import TopBar from "src/layouts/DashboardLayout/TopBar";
import { useUser } from "src/auth/user";
import Footer from "src/layouts/DashboardLayout/Footer";
import Box from "@mui/material/Box";

/**
 * Dashboard layout component for the app when users are signed in.
 * @returns {JSX.Element}
 */
const DashboardLayout = () => {
  const { user } = useUser();

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
    <Navigate to="/moped/session/signin" />
  );
};

export default DashboardLayout;
