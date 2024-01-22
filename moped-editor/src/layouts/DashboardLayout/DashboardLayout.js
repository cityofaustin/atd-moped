import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import TopBar from "./TopBar";
import { useUser } from "../../auth/user";

const DashboardLayout = () => {
  const { user } = useUser();

  return user ? (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "white",
        overflow: "hidden",
        height: "100vh",
        paddingTop: "64px",
      }}
    >
      <TopBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
        {/* <Footer /> */}
      </Box>
    </Box>
  ) : (
    <Navigate to="/moped/session/signin" />
  );
};

export default DashboardLayout;
