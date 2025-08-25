import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import { useUser } from "src/auth/user";
import Box from "@mui/material/Box";

const MainLayout = () => {
  const { user } = useUser();

  return user ? (
    <Navigate to="/moped" />
  ) : (
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
