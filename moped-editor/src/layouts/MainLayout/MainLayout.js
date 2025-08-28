import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "src/auth/user";
import Box from "@mui/material/Box";

/**
 * Main layout component for the app when not logged in (sign in page).
 * @returns {JSX.Element}
 */
const MainLayout = () => {
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
